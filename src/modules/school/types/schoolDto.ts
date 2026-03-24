export interface School{
  name: string;
  address: string;
  number_of_classes: number;
}

export interface CreateSchool {
  name: string;
  address: string;
}

export interface UpdateSchool {
  name?: string;
  address?: string;
  number_of_classes?: number;
}