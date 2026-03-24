import { ClassClass } from '../../class/services/classService';
import { Class, CreateClass, UpdateClass } from '../../class/types/classDto';
import { SchoolService } from '../../school/services/schoolService';
import { CreateSchool, School, UpdateSchool } from '../../school/types/schoolDto';
import { useOfflineSyncStore } from '../stores/index';
import { classCacheKey, ID_MAP_CACHE_KEY, OUTBOX_CACHE_KEY, SCHOOL_CACHE_KEY } from './offlineKeys';
import { readOfflineItem, writeOfflineItem } from './offlineStorage';

type OfflineEntity = 'school' | 'class';
type OfflineAction = 'create' | 'update' | 'delete';

type OfflineOperationBase = {
  id: string;
  entity: OfflineEntity;
  action: OfflineAction;
  targetId: string;
  createdAt: number;
};

type SchoolOperation = OfflineOperationBase & {
  entity: 'school';
  payload?: CreateSchool | UpdateSchool;
};

type ClassOperation = OfflineOperationBase & {
  entity: 'class';
  payload?: CreateClass | UpdateClass;
};

export type OfflineOperation = SchoolOperation | ClassOperation;

type IdMap = Record<string, string>;

const schoolService = new SchoolService();
const classService = new ClassClass();
let isSyncInProgress = false;

const makeOperationId = () => `op-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const resolveMappedId = (id: string, idMap: IdMap) => idMap[id] || id;

const replaceOperationIds = (operations: OfflineOperation[], fromId: string, toId: string) => {
  return operations.map((operation) => {
    const nextOperation: OfflineOperation = {
      ...operation,
      targetId: operation.targetId === fromId ? toId : operation.targetId,
    } as OfflineOperation;

    if (nextOperation.entity === 'class' && nextOperation.payload) {
      const payload = { ...nextOperation.payload } as CreateClass | UpdateClass;

      if ('schoolId' in payload && payload.schoolId === fromId) {
        payload.schoolId = toId;
      }

      return { ...nextOperation, payload } as OfflineOperation;
    }

    return nextOperation;
  });
};

const readOutbox = async () => (await readOfflineItem<OfflineOperation[]>(OUTBOX_CACHE_KEY)) || [];

const writeOutbox = async (operations: OfflineOperation[]) => {
  await writeOfflineItem(OUTBOX_CACHE_KEY, operations);
  useOfflineSyncStore.getState().setPendingCount(operations.length);
};

export async function getOfflineOutboxSnapshot(): Promise<OfflineOperation[]> {
  return readOutbox();
}

export async function refreshOfflineSyncState(): Promise<void> {
  const operations = await readOutbox();
  useOfflineSyncStore.getState().setPendingCount(operations.length);
}

const readIdMap = async () => (await readOfflineItem<IdMap>(ID_MAP_CACHE_KEY)) || {};
const writeIdMap = async (idMap: IdMap) => writeOfflineItem(ID_MAP_CACHE_KEY, idMap);

const isLocalOnlyId = (id: string) => id.startsWith('local-');

const updateSchoolCacheReplaceId = async (fromId: string, nextSchool: School & { id: string }) => {
  const schools = (await readOfflineItem<(School & { id: string })[]>(SCHOOL_CACHE_KEY)) || [];
  const hasMatch = schools.some((school) => school.id === fromId);

  if (!hasMatch) return;

  const nextSchools = schools.map((school) =>
    school.id === fromId ? ({ ...school, ...nextSchool } as School & { id: string }) : school,
  );

  await writeOfflineItem(SCHOOL_CACHE_KEY, nextSchools);
};

const updateClassCacheReplaceId = async (schoolId: string, fromId: string, nextClass: Class & { id: string }) => {
  const classes = (await readOfflineItem<(Class & { id: string })[]>(classCacheKey(schoolId))) || [];
  const hasMatch = classes.some((classItem) => classItem.id === fromId);

  if (!hasMatch) return;

  const nextClasses = classes.map((classItem) =>
    classItem.id === fromId ? ({ ...classItem, ...nextClass } as Class & { id: string }) : classItem,
  );

  await writeOfflineItem(classCacheKey(schoolId), nextClasses);
};

export async function enqueueOfflineOperation(
  input: Omit<OfflineOperation, 'id' | 'createdAt'>,
): Promise<void> {
  const operations = await readOutbox();

  if (input.action === 'delete') {
    const hasCreatePending = operations.some(
      (operation) =>
        operation.entity === input.entity &&
        operation.targetId === input.targetId &&
        operation.action === 'create',
    );

    if (hasCreatePending) {
      const compacted = operations.filter(
        (operation) => !(operation.entity === input.entity && operation.targetId === input.targetId),
      );
      await writeOutbox(compacted);
      return;
    }
  }

  if (input.action === 'update') {
    const createIndex = operations.findIndex(
      (operation) =>
        operation.entity === input.entity &&
        operation.targetId === input.targetId &&
        operation.action === 'create',
    );

    if (createIndex >= 0) {
      const createOperation = operations[createIndex];
      operations[createIndex] = {
        ...createOperation,
        payload: {
          ...(createOperation.payload || {}),
          ...(input.payload || {}),
        },
      } as OfflineOperation;

      await writeOutbox(operations);
      return;
    }
  }

  const operation: OfflineOperation = {
    ...input,
    id: makeOperationId(),
    createdAt: Date.now(),
  } as OfflineOperation;

  await writeOutbox([...operations, operation]);
}

async function processSchoolCreate(operation: SchoolOperation, idMap: IdMap): Promise<IdMap> {
  const payload = (operation.payload || {}) as CreateSchool;
  const created = (await schoolService.create(payload)) as School & { id: string };
  const resolvedCreatedId = created.id;

  if (operation.targetId !== resolvedCreatedId) {
    const nextIdMap = { ...idMap, [operation.targetId]: resolvedCreatedId };
    await writeIdMap(nextIdMap);
    await updateSchoolCacheReplaceId(operation.targetId, created);
    return nextIdMap;
  }

  return idMap;
}

async function processClassCreate(operation: ClassOperation, idMap: IdMap): Promise<IdMap> {
  const payload = { ...(operation.payload || {}) } as CreateClass;

  if (!payload.schoolId) {
    throw new Error('Missing schoolId for class create');
  }

  payload.schoolId = resolveMappedId(payload.schoolId, idMap);

  const created = (await classService.create(payload)) as Class & { id: string };

  if (operation.targetId !== created.id) {
    const nextIdMap = { ...idMap, [operation.targetId]: created.id };
    await writeIdMap(nextIdMap);
    await updateClassCacheReplaceId(payload.schoolId, operation.targetId, created);
    return nextIdMap;
  }

  return idMap;
}

async function processOperation(operation: OfflineOperation, idMap: IdMap): Promise<IdMap> {
  const resolvedTargetId = resolveMappedId(operation.targetId, idMap);

  if (operation.entity === 'school') {
    if (operation.action === 'create') {
      return processSchoolCreate(operation, idMap);
    }

    if (isLocalOnlyId(resolvedTargetId)) {
      throw new Error('Waiting for school id mapping');
    }

    if (operation.action === 'update') {
      await schoolService.update(resolvedTargetId, (operation.payload || {}) as UpdateSchool);
      return idMap;
    }

    await schoolService.delete(resolvedTargetId);
    return idMap;
  }

  if (operation.action === 'create') {
    return processClassCreate(operation, idMap);
  }

  if (isLocalOnlyId(resolvedTargetId)) {
    throw new Error('Waiting for class id mapping');
  }

  if (operation.action === 'update') {
    const payload = { ...(operation.payload || {}) } as UpdateClass;
    if (payload.schoolId) {
      payload.schoolId = resolveMappedId(payload.schoolId, idMap);
    }
    await classService.update(resolvedTargetId, payload);
    return idMap;
  }

  await classService.delete(resolvedTargetId);
  return idMap;
}

export async function syncOfflineOutbox(): Promise<void> {
  if (isSyncInProgress) return;

  isSyncInProgress = true;
  useOfflineSyncStore.getState().setIsSyncing(true);
  useOfflineSyncStore.getState().setLastError(null);

  let operations = await readOutbox();
  useOfflineSyncStore.getState().setPendingCount(operations.length);

  if (!operations.length) {
    useOfflineSyncStore.getState().setIsSyncing(false);
    isSyncInProgress = false;
    return;
  }

  try {
    let idMap = await readIdMap();
    const pendingOperations = [...operations].sort((a, b) => a.createdAt - b.createdAt);
    const completedOperationIds = new Set<string>();
    let syncErrorMessage: string | null = null;

    for (const operation of pendingOperations) {
      try {
        idMap = await processOperation(operation, idMap);
        completedOperationIds.add(operation.id);

        operations = replaceOperationIds(operations, operation.targetId, resolveMappedId(operation.targetId, idMap));
      } catch (error) {
        syncErrorMessage = error instanceof Error ? error.message : 'Falha ao sincronizar pendencias.';
        break;
      }
    }

    if (completedOperationIds.size) {
      const remainingOperations = operations.filter((operation) => !completedOperationIds.has(operation.id));
      await writeOutbox(remainingOperations);
      useOfflineSyncStore.getState().setLastSyncedAt(Date.now());
    }

    if (syncErrorMessage) {
      useOfflineSyncStore.getState().setLastError(syncErrorMessage);
    }
  } finally {
    useOfflineSyncStore.getState().setIsSyncing(false);
    isSyncInProgress = false;
  }
}
