export const SCHOOL_CACHE_KEY = 'school-control:schools';
export const CLASS_CACHE_PREFIX = 'school-control:classes:';
export const OUTBOX_CACHE_KEY = 'school-control:outbox';
export const ID_MAP_CACHE_KEY = 'school-control:id-map';

export const classCacheKey = (schoolId: string) => `${CLASS_CACHE_PREFIX}${schoolId}`;
