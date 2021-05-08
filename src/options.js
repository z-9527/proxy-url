const { useState, useEffect } = React;
const {
  ConfigProvider,
  Layout,
  Table,
  Button,
  Divider,
  Menu,
  Dropdown,
  Form,
  Input,
  Checkbox,
  Modal,
  locales
} = antd;
const { Header, Content, Footer } = Layout;
const { setStorageSyncData, onStorageChange, getStorageSyncData } = Storage;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          // rules={[
          //   {
          //     required: true,
          //     message: `请输入 ${title}!`,
          //   },
          // ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function Page() {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [data, setData] = useState([]);

  const isEditing = (record) => record.key === editingKey;

  useEffect(() => {
    getStorageSyncData("proxyUrlList").then((res) => {
      setData(res.proxyUrlList || []);
    });
    onStorageChange("proxyUrlList", function (res) {
      setData(res.newValue || []);
    });
  }, []);

  const onEnableChange = (record, event) => {
    const enable = event.target.checked;
    const newData = [...data];
    const index = newData.findIndex((item) => record.key === item.key);
    newData[index].enable = enable;
    setStorageSyncData({ proxyUrlList: newData });
  };

  //添加规则
  const onAdd = () => {
    onCancel();
    const newData = [...data];
    const record = {
      enable: true,
      key: Date.now(),
      name: "",
      original: "",
      replace: "",
    };
    newData.unshift(record);
    onEdit(record);
    setStorageSyncData({ proxyUrlList: newData });
  };

  // 编辑
  const onEdit = (record) => {
    form.setFieldsValue({
      enable: false,
      name: "",
      original: "",
      replace: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  // 取消
  const onCancel = () => {
    setEditingKey("");
  };

  // 保存
  const onSave = async ({ key }) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
      } else {
        newData.push(row);
      }
      setStorageSyncData({ proxyUrlList: newData });
      onCancel();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  //复制
  const onCopy = (record) => {
    const newData = [...data];
    const index = newData.findIndex((item) => record.key === item.key);
    newData.splice(index + 1, 0, {
      ...record,
      key: Date.now(),
      name: `${record.name}-副本`,
    });
    setStorageSyncData({ proxyUrlList: newData });
  };

  // 移动
  const onMove = (record, direction) => {
    const newData = [...data];
    const index = newData.findIndex((item) => record.key === item.key);
    let newIndex = index + 1 * (direction === "up" ? -1 : 1);
    newIndex = Math.min(Math.max(newIndex, 0), newData.length - 1);
    [newData[index], newData[newIndex]] = [newData[newIndex], newData[index]];
    setStorageSyncData({ proxyUrlList: newData });
  };

  // 删除
  const onDelete = ({ key }) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData.splice(index, 1);
      setStorageSyncData({ proxyUrlList: newData });
    }
    onCancel();
  };

  // 删除全部规则
  const onDeleteAll = () => {
    Modal.confirm({
      title: "提示",
      content: "是否删除全部代理url配置？",
      onOk: () => {
        setStorageSyncData({ proxyUrlList: [] });
        onCancel();
      },
    });
  };

  const columns = [
    {
      title: "启用",
      dataIndex: "enable",
      width: 150,
      render: (v, record) => (
        <Checkbox checked={v} onChange={(e) => onEnableChange(record, e)} />
      ),
    },
    {
      title: "名称",
      dataIndex: "name",
      width: 200,
      editable: true,
    },
    {
      title: "原始值",
      dataIndex: "original",
      editable: true,
    },
    {
      title: "替换值",
      dataIndex: "replace",
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 200,
      lock: "left",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button type="link" onClick={() => onSave(record)}>
              保存
            </Button>
            <Divider type="vertical" />
            <Button type="link" onClick={onCancel}>
              取消
            </Button>
          </>
        ) : (
          <div>
            <Button
              type="link"
              onClick={() => onEdit(record)}
              disabled={editingKey !== ""}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <Button type="link" onClick={() => onCopy(record)}>
                      复制
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" onClick={() => onMove(record, "up")}>
                      上移
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" onClick={() => onMove(record, "down")}>
                      下移
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" onClick={() => onDelete(record)}>
                      删除
                    </Button>
                  </Menu.Item>
                </Menu>
              }
              disabled={editingKey !== ""}
            >
              <Button type="link">更多</Button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <ConfigProvider locale={locales.zh_CN}>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <div className="description">代理url请求</div>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content">
            <Button
              type="primary"
              style={{ marginBottom: 12, marginRight: 8 }}
              onClick={onAdd}
            >
              添加规则
            </Button>
            <Button style={{ marginBottom: 12 }} onClick={onDeleteAll}>
              删除全部规则
            </Button>

            <Form form={form} component={false}>
              <Table
                columns={mergedColumns}
                dataSource={data}
                rowClassName="editable-row"
                bordered
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                pagination={false}
                size="small"
                scroll={{ y: window.innerHeight - 250 }}
              />
            </Form>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()}{" "}
          <a
            href="https://github.com/z-9527/proxy-url/tree/main"
            target="_blank"
          >
            Created by zzh
          </a>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

ReactDOM.render(<Page />, document.getElementById("root"));
