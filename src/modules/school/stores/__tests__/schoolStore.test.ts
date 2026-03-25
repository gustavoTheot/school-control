const mockGetAll = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock('../../services/schoolService', () => ({
  SchoolService: jest.fn().mockImplementation(() => ({
    getAll: mockGetAll,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  })),
}));

const { useSchoolStore } = require('../schoolStore') as typeof import('../schoolStore');

describe('useSchoolStore', () => {
  beforeEach(() => {
    useSchoolStore.setState({ schools: [], isLoading: false, error: null });
  });

  it('deve salvar escola no store quando addSchool for chamado', async () => {
    mockCreate.mockResolvedValue({
      id: 'school-1',
      name: 'SESI',
      address: 'Rua A',
      number_of_classes: 0,
    });

    await useSchoolStore.getState().addSchool({ name: 'SESI', address: 'Rua A' });

    expect(useSchoolStore.getState().schools).toHaveLength(1);
    expect(useSchoolStore.getState().schools[0].name).toBe('SESI');
  });

  it('deve atualizar e remover escola no store', async () => {
    useSchoolStore.setState({
      schools: [
        { id: 'school-1', name: 'SESI', address: 'Rua A', number_of_classes: 0 },
        { id: 'school-2', name: 'SENAI', address: 'Rua B', number_of_classes: 1 },
      ],
      isLoading: false,
      error: null,
    });

    mockUpdate.mockResolvedValue({
      id: 'school-1',
      name: 'SESI Atualizada',
      address: 'Rua A',
      number_of_classes: 0,
    });

    await useSchoolStore.getState().updateSchool('school-1', { name: 'SESI Atualizada' });
    expect(useSchoolStore.getState().schools[0].name).toBe('SESI Atualizada');

    mockDelete.mockResolvedValue(undefined);
    await useSchoolStore.getState().removeSchool('school-2');

    expect(useSchoolStore.getState().schools).toHaveLength(1);
    expect(useSchoolStore.getState().schools[0].id).toBe('school-1');
  });
});
