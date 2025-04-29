import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

interface InfinitePaginationOptions<T> {
  table: string;
  select: string;
  orderBy: string;
  orderAsc?: boolean;
  pageSize?: number;
}

export function useInfinitePagination<T>({
  table,
  select,
  orderBy,
  orderAsc = false,
  pageSize = 9,
}: InfinitePaginationOptions<T>) {}
