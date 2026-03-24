import { Class, CreateClass, UpdateClass } from "../types/classDto";

export interface ClassInterface {
  getAll(schoolId: string, search?: string): Promise<Class[]>;
  get(id: string): Promise<Class>;
  create(data: CreateClass): Promise<Class>;
  update(id: string, data: UpdateClass): Promise<Class>;
  delete(id: string): Promise<void>;
}