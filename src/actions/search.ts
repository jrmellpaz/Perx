'use server';

import { createClient } from '@/utils/supabase/server';

export async function fullTextSearch(queryText: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('full_text_search', {
    query_text: queryText,
  });

  if (error) {
    console.error('Search Error:', error.message);
    throw new Error(error.message);
  }

  return data;
}
