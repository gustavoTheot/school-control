import { Class } from '../types/classDto';

type Shift = Class['shift'];

const SHIFT_LABELS: Record<Shift, string> = {
  morning: 'Manha',
  afternoon: 'Tarde',
  evening: 'Noite',
};

export function formatShiftPtBr(shift: Shift): string {
  return SHIFT_LABELS[shift] || shift;
}
