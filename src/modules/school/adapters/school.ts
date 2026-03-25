import { CreateSchool, School, UpdateSchool } from '../types/schoolDto';

export interface SchoolInterface {
  getAll(search?: string): Promise<School[]>;
  get(id: string): Promise<School>;
  create(data: CreateSchool): Promise<School>;
  update(id: string, data: UpdateSchool): Promise<School>;
  delete(id: string): Promise<void>;
}
