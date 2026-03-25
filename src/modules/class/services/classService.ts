import axios from 'axios';
import { Class, CreateClass, UpdateClass } from '../types/classDto';
import { ClassInterface } from '../adapters/classInterface';

export class ClassClass implements ClassInterface {
  private uri = '/classes';

  private unwrapList(data: unknown): Class[] {
    if (Array.isArray(data)) {
      return data as Class[];
    }

    if (
      data &&
      typeof data === 'object' &&
      Array.isArray((data as { classes?: Class[] }).classes)
    ) {
      return (data as { classes: Class[] }).classes;
    }

    return [];
  }

  private unwrapItem(data: unknown): Class {
    if (data && typeof data === 'object' && (data as { class?: Class }).class) {
      return (data as { class: Class }).class;
    }

    return data as Class;
  }

  async getAll(schoolId: string, search?: string): Promise<Class[]> {
    const response = await axios.get(this.uri, {
      params: {
        schoolId,
        ...(search ? { search } : {}),
      },
    });

    return this.unwrapList(response.data);
  }

  async get(id: string): Promise<Class> {
    const response = await axios.get(`${this.uri}/${id}`);

    return this.unwrapItem(response.data);
  }

  async create(data: CreateClass): Promise<Class> {
    const response = await axios.post(this.uri, data);

    return this.unwrapItem(response.data);
  }

  async update(id: string, data: UpdateClass): Promise<Class> {
    const response = await axios.put(`${this.uri}/${id}`, data);

    return this.unwrapItem(response.data);
  }

  async delete(id: string) {
    await axios.delete(`${this.uri}/${id}`);
  }
}
