type Shift = 'morning' | 'afternoon' | 'evening';

export interface Class{
  id: string;
  schoolId: string;
  name: string;
  shift: Shift;
  school_year: number;
}

export interface CreateClass {
  schoolId: string;
  name: string;
  shift: Shift;
  school_year: number;
}

export interface UpdateClass {
  schoolId?: string;
  name?: string;
  shift?: Shift;
  school_year?: number;
}