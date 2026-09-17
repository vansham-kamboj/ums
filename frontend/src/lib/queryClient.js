import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default stale time for static/setup resources
      gcTime: 10 * 60 * 1000,    // 10 minutes cache persistence in memory
      refetchOnWindowFocus: false, // Avoid unexpected UI jumps during active user edits
      retry: 1,
    },
  },
});
