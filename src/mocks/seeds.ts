import { Server } from 'miragejs';
import { AppRegistry } from './models';

export function seedDatabase(server: Server<AppRegistry>) {
  server.create('school', {
    id: 'school-1',
    name: 'Colegio Nova Geracao',
    address: 'Rua das Flores, 120 - Centro',
    number_of_classes: 3,
  });

  server.create('school', {
    id: 'school-2',
    name: 'Escola Horizonte',
    address: 'Av. Principal, 980 - Jardim Sol',
    number_of_classes: 2,
  });

  server.create('class', {
    id: 'class-1',
    name: 'Turma A',
    shift: 'morning',
    school_year: 2026,
    schoolId: 'school-1',
  });

  server.create('class', {
    id: 'class-2',
    name: 'Turma B',
    shift: 'afternoon',
    school_year: 2026,
    schoolId: 'school-1',
  });

  server.create('class', {
    id: 'class-3',
    name: 'Turma C',
    shift: 'evening',
    school_year: 2026,
    schoolId: 'school-2',
  });
}
