import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Form } from 'antd';
import React, { useState, useRef, ReactNode } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryStaffs, updateStaff, addStaff, RoleStaff } from './service';
import { TableListItem as RoleTableListItem } from '@/pages/admin/roles/List/data';
import RoleForm from './components/RoleForm'
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'umi';
import { CurrentUser } from '@/models/user';
import checkStaffAccess from '@/utils/checkAccess';

/**
 * 添加员工
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addStaff({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新员工
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await updateStaff({
      _id: fields._id,
      username: fields.username,
      password: fields.password,
    });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

/**
 * 员工分配角色
 * @param fields
 */
const handleRole = async (fields: FormValueType) => {
  const hide = message.loading('正在分配角色');
  try {
    await RoleStaff({
      _id: fields._id,
      roles: fields.roles
    });
    hide();
    message.success('分配成功');
    return true;
  } catch (error) {
    hide();
    message.error('分配失败请重试！');
    return false;
  }
};


interface Props {
  currentUser?: CurrentUser;
  children?: ReactNode;
  dispatch?: Dispatch;
}

const TableList: React.FC<{}> = (props: Props) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [roleModalVisible, handleRoleModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const { currentUser } = props;
  // Columns 标题字段和约束
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名称',
      dataIndex: 'username',
    },
    {
      title: '用户角色',
      dataIndex: 'roles',
      renderText: (roles: RoleTableListItem[]) => roles.map(role => role.desc).join(", ")
    },
    {
      title: '超级管理员',
      dataIndex: 'isSuper',
      renderText: (val: boolean) => val ? '是' : '否',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {
            checkStaffAccess(currentUser!, 'staff update') ? (
              <a
                onClick={() => {
                  handleUpdateModalVisible(true);
                  setStepFormValues(record);
                }}
              >
                修改
              </a>
            ) : null
          }

          <Divider type="vertical" />
          {
            checkStaffAccess(currentUser!, 'staff roles') ? (
              <a
                onClick={() => {
                  handleRoleModalVisible(true);
                  setStepFormValues(record);
                }}
              >分配角色</a>
            ):null
          }
        </>
      ),
    },
  ];
  // const columnsSave: ProColumns<TableListItem>[] = [
  //   {
  //     title: '用户名称',
  //     dataIndex: 'username'
  //   },
  //   {
  //     title: '密码',
  //     dataIndex: 'password'
  //   }
  // ]

  const saveButton = () => {
    if (checkStaffAccess(currentUser!, 'staff save')) {
      return (
        <Button type="primary" onClick={() => handleModalVisible(true)}>
          <PlusOutlined /> 新建
        </Button>
      )
    } else {
      return null;
    }
  }

  return (
    <PageContainer>
      {/* 员工列表 */}
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="_id"
        search={false}
        pagination={false}
        toolBarRender={() => [
          saveButton()
        ]}
        request={() => queryStaffs({})}
        columns={columns}
        rowSelection={false}
      />
      {/* 创建员工 */}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}>
        {/* <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columnsSave}
        /> */}
        <Form
          name="basic"
          style={{ marginTop: 8 }}
          onFinish={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <Form.Item
            label="用户名称"
            name="username"
            rules={[{ required: true, message: '请输入用户名称' }]}
          >
            <Input placeholder="请输入用户名称" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '至少6位数', min: 6 }]}
          >
            <Input placeholder="请输入密码" />
          </Form.Item>
          <Form.Item style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button style={{ marginLeft: 32 }}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </CreateForm>
      {/* 员工修改 */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
      {/* 员工分配角色 */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <RoleForm
          onSubmit={async (value) => {
            const success = await handleRole(value);
            if (success) {
              handleRoleModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleRoleModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={roleModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.username && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.username}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.username,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

// export default TableList;
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(TableList);