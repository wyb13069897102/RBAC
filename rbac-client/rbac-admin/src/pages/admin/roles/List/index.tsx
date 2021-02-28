import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Form } from 'antd';
import React, { useState, useRef, ReactNode } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRoles, updateRoles, addRoles, accessRoles } from './service';
import AccessForm from './components/AccessForm';
import { connect, Dispatch } from 'umi';
import { CurrentUser } from '@/models/user';
import { ConnectState } from '@/models/connect';
import checkStaffAccess from '@/utils/checkAccess';

/**
 * 添加角色
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRoles({ ...fields });
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
 * 更新角色
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await updateRoles({
      _id: fields._id,
      name: fields.name,
      desc: fields.desc,
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
 * 角色授权
 * @param fields
 */
const handleAccess = async (fields: FormValueType,dispatch) => {
  const hide = message.loading('正在授权');
  try {
    await accessRoles({
      _id: fields._id,
      accesss:fields.accesss
    });
    if(dispatch){
      dispatch({
        type:'user/fetchCurrent'
      })
    }
    hide();
    message.success('授权成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

interface Props{
  currentUser?: CurrentUser;
  children?: ReactNode;
  dispatch?: Dispatch;
}

const TableList: React.FC<{}> = (props:Props) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [accessModalVisible, handleAccessModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const { currentUser, dispatch } = props;
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'desc',
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
            checkStaffAccess(currentUser!, 'role update') ? (
              <a
                onClick={() => {
                  handleUpdateModalVisible(true);
                  setStepFormValues(record);
                }}
              >
                修改
              </a>
            ):null
          }
          <Divider type="vertical" />
          {
            checkStaffAccess(currentUser!, 'role access') ? (
              <a
                onClick={() => {
                  handleAccessModalVisible(true);
                  setStepFormValues(record);
                }}
              >分配权限</a>
            ) : null
          }
        </>
      ),
    },
  ];

  const saveButton = () => {
    if (checkStaffAccess(currentUser!, 'role save')) {
      return (
        <Button type="primary" onClick={() => handleModalVisible(true)}>
          <PlusOutlined /> 新建
        </Button>
      )
    } else {
      return null;
    }
  }
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
  return (
    <PageContainer>
      {/* 角色列表 */}
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="_id"
        search={false}
        pagination={false}
        toolBarRender={() => [
          saveButton()
        ]}
        request={() => queryRoles({})}
        columns={columns}
        rowSelection={false}
      />
      {/* 创建角色 */}
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
            label="角色名称"
            name="name"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称 英文" />
          </Form.Item>
          <Form.Item
            label="角色描述"
            name="desc"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input placeholder="请输入角色描述 中文" />
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
      {/* 修改角色 */}
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
      {/* 角色授权 */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <AccessForm
          onSubmit={async (value) => {
            const success = await handleAccess(value,dispatch);
            if (success) {
              handleAccessModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => { 
            handleAccessModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={accessModalVisible}
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
        {row?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
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