'use server';

import { createClient } from '@/utils/supabase/server';
import { embedText } from './embedder';

export async function semanticSearch(query: string) {
  const queryEmbedding = await embedText(query);
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('semantic_search', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7
  });

  if (error) {
    console.error('Semantic Search Error:', error.message);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    console.warn('No matching results found!');
    return [];
  }

  // Map the basic search results
  return data.map((result: any) => ({
    type: result.type, // 'coupon' or 'merchant'
    id: result.id,
    similarity: result.similarity,
  }));
}

export async function hybridSearch(queryText: string) {
  const queryEmbedding = await embedText(queryText);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('hybrid_search', {
    query_text: queryText,
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
  });

  if (error) {
    console.error('Hybrid Search Error:', error.message);
    throw new Error(error.message);
  }

  return data;
}
