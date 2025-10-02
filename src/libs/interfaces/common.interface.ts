interface PaginationParams {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface IPagination<T> {
  data: T[];
  pagination: PaginationParams;
}

export interface ListParams {
  page?: number;
  limit?: number;
  content?: number;
  status?: number;
  startTime?: string;
  endTime?: string;
  sort?: string;

  //Match any key if fields are not defined
  [key: string]: string | number | undefined;
}

export interface ParamsCommonGetDetail {
  conditions: {
    [key: string]: string;
  };
  overwriteConditions?: {
    [key: string]: string;
  };
  select?: string[];
}

export interface TokenModel {
  id: string;
  role: string;
  [key: string]: any;
}
