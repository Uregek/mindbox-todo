export const filters = ['All', 'Active', 'Completed'] as const;
export type Filter = typeof filters[number];
