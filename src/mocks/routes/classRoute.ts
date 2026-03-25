import { Response, Server } from 'miragejs';

import { AppRegistry, AppSchema } from '../models';

export function setupClassRoutes(server: Server<AppRegistry>) {
  server.get('/classes', (schema: AppSchema, request) => {
    const schoolId = request.queryParams.schoolId;
    const normalizedSchoolId = Array.isArray(schoolId) ? schoolId[0] : schoolId;
    const search = request.queryParams.search;
    const searchTerm = Array.isArray(search) ? search[0] : search;

    if (!normalizedSchoolId) {
      return new Response(400, {}, { message: 'schoolId is required' });
    }

    return schema
      .where('class', (classItem: any) => {
        const isSchoolMatch = classItem.schoolId === normalizedSchoolId;
        if (!searchTerm) return isSchoolMatch;
        const isSearchMatch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase());

        return isSchoolMatch && isSearchMatch;
      })
      .models.map((classItem) => classItem.attrs);
  });

  server.get('/classes/:id', (schema: AppSchema, request) => {
    const classItem = schema.find('class', request.params.id);

    if (!classItem) {
      return new Response(404, {}, { message: 'Class not found' });
    }

    return classItem.attrs;
  });

  server.post('/classes', (schema: AppSchema, request) => {
    const attrs = JSON.parse(request.requestBody);

    if (!attrs.schoolId) {
      return new Response(400, {}, { message: 'schoolId is required' });
    }

    const created = schema.create('class', attrs);

    const school = schema.find('school', attrs.schoolId);
    if (school) {
      const currentCount = Number(school.attrs.number_of_classes || 0);
      school.update({ number_of_classes: currentCount + 1 });
    }

    return created.attrs;
  });

  server.put('/classes/:id', (schema: AppSchema, request) => {
    const classItem = schema.find('class', request.params.id);

    if (!classItem) {
      return new Response(404, {}, { message: 'Class not found' });
    }

    const newAttrs = JSON.parse(request.requestBody);
    classItem.update(newAttrs);

    return classItem.attrs;
  });

  server.delete('/classes/:id', (schema: AppSchema, request) => {
    const classItem = schema.find('class', request.params.id);

    if (!classItem) {
      return new Response(404, {}, { message: 'Class not found' });
    }

    const school = schema.find('school', classItem.attrs.schoolId);
    if (school) {
      const currentCount = Number(school.attrs.number_of_classes || 0);
      school.update({ number_of_classes: Math.max(0, currentCount - 1) });
    }

    classItem.destroy();

    return new Response(204);
  });
}
