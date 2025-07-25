import { useQuery } from '@tanstack/react-query';
import { fetchClasses, fetchRoles } from '../api/common';

// Roles list
export const useRoles = () =>
  useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  });

// Classes list
export const useClasses = () =>
  useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });


