export type ErrorResponse = {
  errors: {
    [field: string]: string[];
  };
};

export type MessageResponse = {
  message: string;
};

export type Pagination = {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
};

export type ListResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export type SingleResponse<T> = T;
