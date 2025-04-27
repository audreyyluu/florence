import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Dashboard pages to prefetch
export const DASHBOARD_PAGES = [
  '/protected',
  '/protected/alerts',
  '/protected/staffing',
  '/protected/map',
  '/protected/settings',
  '/protected/user-guide',
];

/**
 * Prefetches all dashboard pages for faster navigation
 * @param router Next.js router instance
 * @param currentPath Current path to avoid prefetching the current page
 */
export const prefetchDashboardPages = (
  router: AppRouterInstance, 
  currentPath: string
): void => {
  DASHBOARD_PAGES.forEach(page => {
    if (page !== currentPath) {
      router.prefetch(page);
    }
  });
};

/**
 * Prefetches a specific list of pages
 * @param router Next.js router instance
 * @param pages Array of page paths to prefetch
 * @param currentPath Current path to avoid prefetching the current page
 */
export const prefetchPages = (
  router: AppRouterInstance,
  pages: string[],
  currentPath: string
): void => {
  pages.forEach(page => {
    if (page !== currentPath) {
      router.prefetch(page);
    }
  });
};

/**
 * Prefetches room pages
 * @param router Next.js router instance
 * @param roomNumbers Array of room numbers to prefetch
 */
export const prefetchRoomPages = (
  router: AppRouterInstance,
  roomNumbers: number[]
): void => {
  roomNumbers.forEach(roomNumber => {
    const roomPath = `/protected/rooms/${roomNumber}`;
    router.prefetch(roomPath);
  });
};

/**
 * Loads the next set of data and prefetches corresponding pages
 * @param router Next.js router instance
 * @param currentPage Current page index
 * @param pageSize Number of items per page
 * @param totalItems Total number of items
 * @param getItemPath Function to generate the path for an item
 * @param items Array of all items
 */
export const prefetchNextPageData = <T>(
  router: AppRouterInstance,
  currentPage: number,
  pageSize: number,
  totalItems: T[],
  getItemPath: (item: T) => string
): void => {
  const totalPages = Math.ceil(totalItems.length / pageSize);
  
  if (currentPage < totalPages - 1) {
    const nextPageItems = totalItems.slice(
      (currentPage + 1) * pageSize,
      (currentPage + 2) * pageSize
    );
    
    nextPageItems.forEach(item => {
      const path = getItemPath(item);
      router.prefetch(path);
    });
  }
}; 