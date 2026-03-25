import { SchoolInterface } from '../adapters/school';
import { CreateSchool, School, UpdateSchool } from '../types/schoolDto';
import axios from 'axios';

export class SchoolService implements SchoolInterface {
  private uri = '/schools';

  async getAll(search?: string): Promise<School[]> {
    const response = await axios.get<School[]>(this.uri, {
      params: search ? { search } : undefined,
    });

    return response.data;
  }

  async get(id: string): Promise<School> {
    const response = await axios.get<School>(`${this.uri}/${id}`);

    return response.data;
  }

  async create(data: CreateSchool): Promise<School> {
    const response = await axios.post<School>(this.uri, data);

    return response.data;
  }

  async update(id: string, data: UpdateSchool): Promise<School> {
    const response = await axios.put<School>(`${this.uri}/${id}`, data);

    return response.data;
  }

  async delete(id: string) {
    await axios.delete(`${this.uri}/${id}`);
  }
}
