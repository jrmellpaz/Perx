'use client';

import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { createClient } from '@/utils/supabase/client';
import { fetchPointsHistory } from '@/actions/consumerProfile';
import { PointsHistories } from '@/lib/types';

const PAGE_SIZE = 10;

const PointsHistoryList = ({ userId }: { userId: string }) => {
  const [entries, setEntries] = useState<PointsHistories>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const loadMore = async () => {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    try {
      const newEntries = await fetchPointsHistory(userId, from, to);
      setEntries((prev) => {
        // Create a Set of existing entry keys to check for duplicates
        const existingKeys = new Set(prev.map(entry => `${entry.id}-${entry.created_at}`));
        // Filter out any new entries that already exist
        const uniqueNewEntries = newEntries.filter(
          entry => !existingKeys.has(`${entry.id}-${entry.created_at}`)
        );
        return [...prev, ...uniqueNewEntries];
      });
      setHasMore(newEntries.length === PAGE_SIZE);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error('Error loading points history:', err);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <InfiniteScroll
        dataLength={entries.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<p className="text-center">Loading more...</p>}
      >
        {entries.map((entry) => (
          <div
            key={`${entry.id}-${entry.created_at}`}
            className="rounded-lg border p-4 shadow-sm mb-3 bg-white hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-1">              
              <span className={`font-semibold text-lg ${entry.points_earned >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {entry.points_earned >= 0 ? `+${entry.points_earned}` : entry.points_earned} pts
              </span>
              <span className="text-xs text-gray-500">
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
            </div>
            {/* <p className="text-sm text-gray-700 mb-1">{entry.description}</p> */}
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
              {entry.source.replace('_', ' ')}
            </span>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PointsHistoryList;
