import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useSchool } from '../useSchool';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockFetchSchools = jest.fn();
const mockRemoveSchool = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock('../../../shared/utils/useDebouncedValue', () => ({
  useDebouncedValue: (value: string) => value,
}));

jest.mock('../../stores/schoolStore', () => ({
  useSchoolStore: () => ({
    schools: [],
    isLoading: false,
    error: null,
    fetchSchools: mockFetchSchools,
    removeSchool: mockRemoveSchool,
  }),
}));

describe('useSchool filtro', () => {
  it('deve aplicar trim no filtro antes de buscar escolas', async () => {
    const { result } = renderHook(() => useSchool());

    expect(mockFetchSchools).toHaveBeenCalledWith(undefined);

    act(() => {
      result.current.setSearchQuery('   sesi   ');
    });

    await waitFor(() => {
      expect(mockFetchSchools).toHaveBeenLastCalledWith('sesi');
    });
  });
});
