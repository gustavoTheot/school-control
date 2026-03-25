import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import SchoolsScreen from '../SchoolsScreen';

const mockUseSchool = jest.fn();

jest.mock('../../hooks/useSchool', () => ({
  useSchool: () => mockUseSchool(),
}));

describe('SchoolsScreen', () => {
  it('deve renderizar lista de escolas e acionar botao nova escola', () => {
    const handleNavigateToNewSchool = jest.fn();

    mockUseSchool.mockReturnValue({
      schools: [
        {
          id: 'school-1',
          name: 'SESI',
          address: 'Rua A',
          number_of_classes: 2,
        },
      ],
      isLoading: false,
      error: null,
      searchQuery: '',
      setSearchQuery: jest.fn(),
      handleDeletePress: jest.fn(),
      handleEditPress: jest.fn(),
      handleNavigateToNewSchool,
      handleGoBack: jest.fn(),
      handleViewClasses: jest.fn(),
    });

    const { getByText } = render(<SchoolsScreen />);

    expect(getByText('Escolas')).toBeTruthy();
    expect(getByText('SESI')).toBeTruthy();
    expect(getByText('Turmas:')).toBeTruthy();

    fireEvent.press(getByText('+ Nova Escola'));
    expect(handleNavigateToNewSchool).toHaveBeenCalledTimes(1);
  });
});
