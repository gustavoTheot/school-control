import { SchoolInterface } from '../adapters/school';
import { CreateSchool, School, UpdateSchool } from '../types/schoolDto';
import axios from 'axios';

export class SchoolService implements SchoolInterface {
  private uri = '/schools';

  private unwrapList(data: unknown): School[] {
    if (Array.isArray(data)) {
      return data as School[];
    }

    if (
      data &&
      typeof data === 'object' &&
      Array.isArray((data as { schools?: School[] }).schools)
    ) {
      return (data as { schools: School[] }).schools;
    }

    return [];
  }

  private unwrapItem(data: unknown): School {
    if (data && typeof data === 'object' && (data as { school?: School }).school) {
      return (data as { school: School }).school;
    }

    return data as School;
  }

  async getAll(search?: string): Promise<School[]> {
    const response = await axios.get(this.uri, {
      params: search ? { search } : undefined,
    });

    return this.unwrapList(response.data);
  }

  async get(id: string): Promise<School> {
    const response = await axios.get(`${this.uri}/${id}`);

    return this.unwrapItem(response.data);
  }

  async create(data: CreateSchool): Promise<School> {
    const response = await axios.post(this.uri, data);

    return this.unwrapItem(response.data);
  }

  async update(id: string, data: UpdateSchool): Promise<School> {
    const response = await axios.put(`${this.uri}/${id}`, data);

    return this.unwrapItem(response.data);
  }

  async delete(id: string) {
    await axios.delete(`${this.uri}/${id}`);
  }
}
