import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryRoles(params?: TableListParams) {
  return request('/admin/roles', {
    method:'GET',
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRoles(params: TableListParams) {
  return request(`/admin/roles`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRoles(params: TableListParams) {
  return request(`/admin/roles/${params._id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function accessRoles(params: TableListParams) {
  return request(`/admin/roles/${params._id}/accesss`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
