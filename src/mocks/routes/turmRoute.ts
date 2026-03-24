import { Server } from 'miragejs';
import { AppRegistry, AppSchema } from '../models';

export function setupStoreRoutes(server: Server<AppRegistry>) {
  server.get('/stores', (schema: AppSchema, request) => {
    const { companyId, search } = request.queryParams;

    // Filtro usando callback para poder comparar as strings parcialmente
    let storesCollection = schema.where('store', (store: any) => {
      // 1. O id da empresa deve sempre bater (se fornecido)
      const isCompanyMatch = companyId ? store.companyId === companyId : true;

      // 2. Se houver `search`, verifique se o nome contém a palavra buscada
      const isSearchMatch = search ? store.name.toLowerCase().includes(search.toLowerCase()) : true;

      return isCompanyMatch && isSearchMatch;
    });

    const storesWithCounts = storesCollection.models.map((store) => {
      const productsCount = schema.where('product', { storeId: store.id }).length;

      return {
        ...store.attrs,
        quantityOfProducts: productsCount,
      };
    });

    return { stores: storesWithCounts };
  });

  server.post('/stores', (schema: AppSchema, request) => {
    const attrs = JSON.parse(request.requestBody);
    return schema.create('store', attrs);
  });

  server.put('/stores/:id', (schema: AppSchema, request) => {
    const newAttrs = JSON.parse(request.requestBody);
    const id = request.params.id;
    return schema.find('store', id)?.update(newAttrs);
  });

  server.delete('/stores/:id', (schema: AppSchema, request) => {
    const id = request.params.id;
    return schema.find('store', id)?.destroy();
  });
}
