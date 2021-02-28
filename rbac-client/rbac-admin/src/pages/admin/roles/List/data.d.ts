export interface TableListItem {
  name: string;
  desc: string;
  accesss: any[];
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
  name?: string;
  desc?: string;
  accesss?: any[];
  updatedAt?: Date;
  createdAt?: Date;
}
