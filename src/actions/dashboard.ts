'use server';

import { createClient } from '@/utils/supabase/server';

import type { User } from '@supabase/supabase-js';
import type {
  SuccessResponse,
  Transaction,
  TransactionWithCoupon,
} from '@/lib/types';
import { create } from 'domain';
import { Coupon } from '@/components/custom/Coupon';

const fetchMerchant = async (): Promise<SuccessResponse<User | null>> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('FETCH USER AUTHENTICATION: User not authenticated');
    }

    if (user.user_metadata.role !== 'merchant') {
      throw new Error('FETCH USER ROLE ERROR: User is not a merchant');
    }

    return {
      success: true,
      message: 'User fetched successfully',
      data: user,
    };
  } catch (error) {
    console.error('FETCH MERCHANT ERROR:', error);
    return {
      success: false,
      message: `FETCH MERCHANT ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: null,
    };
  }
};

export type MonthlyRevenueData = {
  name: string;
  [year: number]: number;
};

export const fetchRevenueForYearByMonth = async (
  year: number
): Promise<MonthlyRevenueData[]> => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const resultData: MonthlyRevenueData[] = monthNames.map((name) => ({
    name,
    [year]: 0,
  }));

  try {
    const supabase = await createClient();
    const { success, message, data: user } = await fetchMerchant();

    if (!success || !user) {
      throw new Error(
        `FETCH REVENUE FOR YEAR ERROR: Authentication failed or user is not a merchant. ${message}`
      );
    }

    const startDate = new Date(year, 0, 1).toISOString();
    const endDate = new Date(year, 11, 31, 23, 59, 999).toISOString();

    const { data: transactions_history, error } = await supabase
      .from('transactions_history')
      .select('created_at, price')
      .eq('merchant_id', user.id)
      .not('price', 'is', null)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) {
      throw new Error(
        `FETCH REVENUE DATA FOR YEAR ${year} ERROR: ${error.message}`
      );
    }

    if (transactions_history) {
      const monthlyAggregates: { [monthIndex: number]: number } = {};

      for (const transaction of transactions_history) {
        if (transaction.price != null && transaction.created_at) {
          const transactionDate = new Date(transaction.created_at);
          if (transactionDate.getFullYear() === year) {
            const monthIndex = transactionDate.getMonth();
            monthlyAggregates[monthIndex] =
              (monthlyAggregates[monthIndex] || 0) + transaction.price;
          }
        }
      }

      resultData.forEach((monthResult, index) => {
        if (monthlyAggregates[index] !== undefined) {
          monthResult[year] = monthlyAggregates[index];
        }
      });
    }

    return resultData;
  } catch (error) {
    console.error('FETCH REVENUE FOR YEAR BY MONTH ERROR:', error);
    // In case of an error, return the initialized data (all zeros)
    // to prevent the chart from breaking.
    return monthNames.map((monthName) => ({ name: monthName, [year]: 0 }));
  }
};

export const fetchMonthlyRevenue = async (): Promise<number> => {
  try {
    const supabase = await createClient();

    // Check if the user is authenticated and has the merchant role
    const { success, message, data: user } = await fetchMerchant();

    if (!success || !user) {
      throw new Error(`FETCH REVENUE ERROR: ${message}`);
    }

    // Fetch the monthly revenue for the merchant
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const { data, error } = await supabase
      .from('transactions_history')
      .select('price.sum()')
      .eq('merchant_id', user.id)
      .not('price', 'is', null)
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString());

    if (error) {
      throw new Error(`FETCH REVENUE ERROR: ${error.message}`);
    }

    const revenueThisMonth = data && data[0] ? data[0].sum : 0;
    return revenueThisMonth;
  } catch (error) {
    console.error('FETCH MONTHLY REVENUE ERROR:', error);
    return 0;
  }
};

export const fetchTotalCouponsSoldByMerchant = async (): Promise<number> => {
  try {
    const supabase = await createClient();

    // Check if the user is authenticated and has the merchant role
    const { success, message, data: user } = await fetchMerchant();

    if (!success || !user) {
      throw new Error(`FETCH TOTAL COUPONS SOLD ERROR: ${message}`);
    }

    // Fetch the total coupons sold by the merchant
    const { count, error } = await supabase
      .from('consumer_coupons')
      .select('*', { count: 'exact' })
      .eq('merchant_id', user.id);

    if (error) {
      throw new Error(`FETCH TOTAL COUPONS SOLD ERROR: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error('FETCH TOTAL COUPONS SOLD ERROR:', error);
    return 0;
  }
};

export const fetchTotalUniqueConsumersByMerchant =
  async (): Promise<number> => {
    try {
      const supabase = await createClient();

      // Check if the user is authenticated and has the merchant role
      const { success, message, data: user } = await fetchMerchant();

      if (!success || !user) {
        throw new Error(`FETCH TOTAL UNIQUE CONSUMERS ERROR: ${message}`);
      }

      // Fetch the total unique consumers by the merchant
      const { data: count, error } = await supabase.rpc(
        'count_unique_consumers',
        {
          p_merchant_id: user.id,
        }
      );

      if (error) {
        throw new Error(`FETCH TOTAL UNIQUE CONSUMERS ERROR: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      console.error('FETCH TOTAL UNIQUE CONSUMERS ERROR:', error);
      return 0;
    }
  };

type FetchTransactionRecordsResponse = {
  transactions: TransactionWithCoupon[];
  count: number;
};

export const fetchTransactionRecordsByMerchant = async (
  offset: number = 0,
  limit: number = 12
): Promise<FetchTransactionRecordsResponse> => {
  try {
    const supabase = await createClient();

    // Check if the user is authenticated and has the merchant role
    const { success, message, data: user } = await fetchMerchant();

    if (!success || !user) {
      throw new Error(`FETCH TRANSACTION RECORDS ERROR: ${message}`);
    }

    const { data: transactions, error } = await supabase
      .from('transactions_history')
      .select('*, coupons(*)')
      .eq('merchant_id', user.id)
      // .not('price', 'is', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`FETCH TRANSACTION RECORDS ERROR: ${error.message}`);
    }

    return {
      transactions: transactions || [],
      count: transactions ? transactions.length : 0,
    };
  } catch (error) {
    console.error('FETCH TRANSACTION RECORDS ERROR:', error);
    return {
      transactions: [],
      count: 0,
    };
  }
};
