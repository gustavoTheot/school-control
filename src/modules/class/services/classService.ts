import axios from 'axios';
import { Class, CreateClass, UpdateClass } from '../types/classDto';
import { ClassInterface } from '../adapters/classInterface';

export class ClassService implements ClassInterface {
  private uri = '/classes';

  async getAll(schoolId: string, search?: string): Promise<Class[]> {
    const response = await axios.get<Class[]>(this.uri, {
      params: {
        schoolId,
        ...(search ? { search } : {}),
      },
    });

    return response.data;
  }

  async get(id: string): Promise<Class> {
    const response = await axios.get<Class>(`${this.uri}/${id}`);

    return response.data;
  }

  async create(data: CreateClass): Promise<Class> {
    const response = await axios.post<Class>(this.uri, data);

    return response.data;
  }

  async update(id: string, data: UpdateClass): Promise<Class> {
    const response = await axios.put<Class>(`${this.uri}/${id}`, data);

    return response.data;
  }

  async delete(id: string) {
    await axios.delete(`${this.uri}/${id}`);
  }
}
