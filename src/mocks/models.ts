import { Model, Registry } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';
import Schema from 'miragejs/orm/schema';

import { Class } from '../modules/class/types/classDto';
import { School } from '../modules/school/types/schoolDto';

export const models = {
  school: Model.extend({}) as ModelDefinition<School>,
  class: Model.extend({}) as ModelDefinition<Class>,
};

export type AppRegistry = Registry<typeof models, {}>;
export type AppSchema = Schema<AppRegistry>;
