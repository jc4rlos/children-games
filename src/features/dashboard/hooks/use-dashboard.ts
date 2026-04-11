import { useQuery } from '@tanstack/react-query'
import {
  getActiveSessions,
  getClassesToday,
  getDailyKpis,
  getLowStockProducts,
  getLoyaltySummary,
  getMonthTopChildren,
  getMonthTopProducts,
  getWeekStats,
} from '../data/dashboard-service'

const MINUTE = 60_000

export const useDailyKpis = () =>
  useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: getDailyKpis,
    refetchInterval: MINUTE,
  })

export const useActiveSessions = () =>
  useQuery({
    queryKey: ['dashboard', 'active-sessions'],
    queryFn: getActiveSessions,
    refetchInterval: 30_000,
  })

export const useWeekStats = () =>
  useQuery({
    queryKey: ['dashboard', 'week-stats'],
    queryFn: getWeekStats,
    staleTime: 5 * MINUTE,
  })

export const useMonthTopChildren = () =>
  useQuery({
    queryKey: ['dashboard', 'top-children'],
    queryFn: getMonthTopChildren,
    staleTime: 5 * MINUTE,
  })

export const useMonthTopProducts = () =>
  useQuery({
    queryKey: ['dashboard', 'top-products'],
    queryFn: getMonthTopProducts,
    staleTime: 5 * MINUTE,
  })

export const useClassesToday = () =>
  useQuery({
    queryKey: ['dashboard', 'classes-today'],
    queryFn: getClassesToday,
    staleTime: 5 * MINUTE,
  })

export const useLowStockProducts = () =>
  useQuery({
    queryKey: ['dashboard', 'low-stock'],
    queryFn: getLowStockProducts,
    staleTime: 5 * MINUTE,
  })

export const useLoyaltySummary = () =>
  useQuery({
    queryKey: ['dashboard', 'loyalty'],
    queryFn: getLoyaltySummary,
    refetchInterval: MINUTE,
  })
