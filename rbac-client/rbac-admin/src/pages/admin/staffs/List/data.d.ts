export interface TableListItem {
  username: string;
  password: string;
  isSuper: boolean;
  roles: any[];
  updatedAt: Date;
  createdAt: Date;
  _id: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  _id?: string;
  username?: string;
  password?: string;
  isSuper?: boolean;
  roles?: any[];
  updatedAt?: Date;
  createdAt?: Date;
}
