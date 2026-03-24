import { Response, Server } from 'miragejs';
import { AppRegistry, AppSchema } from '../models';

export function setupSchoolRoutes(server: Server<AppRegistry>) {
  server.get('/schools', (schema: AppSchema, request) => {
    const search = request.queryParams.search;
    const searchTerm = Array.isArray(search) ? search[0] : search;

    const schools = schema
      .where('school', (school: any) => {
        if (!searchTerm) return true;
        return school.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .models.map((school) => school.attrs);

    return schools;
  });

  server.get('/schools/:id', (schema: AppSchema, request) => {
    const school = schema.find('school', request.params.id);

    if (!school) {
      return new Response(404, {}, { message: 'School not found' });
    }

    return school.attrs;
  });

  server.post('/schools', (schema: AppSchema, request) => {
    const attrs = JSON.parse(request.requestBody);
    return schema.create('school', {
      number_of_classes: 0,
      ...attrs,
    }).attrs;
  });

  server.put('/schools/:id', (schema: AppSchema, request) => {
    const school = schema.find('school', request.params.id);

    if (!school) {
      return new Response(404, {}, { message: 'School not found' });
    }

    const newAttrs = JSON.parse(request.requestBody);
    school.update(newAttrs);
    return school.attrs;
  });

  server.delete('/schools/:id', (schema: AppSchema, request) => {
    const school = schema.find('school', request.params.id);

    if (!school) {
      return new Response(404, {}, { message: 'School not found' });
    }

    school.destroy();
    return new Response(204);
  });
}
