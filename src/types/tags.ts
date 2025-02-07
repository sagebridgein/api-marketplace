export interface Tag {
    value: string;
    count: number;
  }
  
  export interface Pagination {
    offset: number;
    limit: number;
    total: number;
    next: string;
    previous: string;
  }
  
  export interface TagsResponse {
    count: number;
    list: Tag[];
    pagination: Pagination;
  }