const {
  useState,
  useEffect
} = React;
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
const {
  Header,
  Content,
  Footer
} = Layout;
const {
  setStorageSyncData,
  onStorageChange,
  getStorageSyncData
} = Storage;
const {
  DownOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  CopyOutlined,
  DeleteOutlined
} = icons;

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
  return /*#__PURE__*/React.createElement("td", restProps, editing ? /*#__PURE__*/React.createElement(Form.Item, {
    name: dataIndex,
    style: {
      margin: 0
    } // rules={[
    //   {
    //     required: true,
    //     message: `请输入 ${title}!`,
    //   },
    // ]}

  }, /*#__PURE__*/React.createElement(Input, null)) : children);
};

function Page() {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [data, setData] = useState([]);

  const isEditing = record => record.key === editingKey;

  useEffect(() => {
    getStorageSyncData("proxyUrlList").then(res => {
      setData(res.proxyUrlList || []);
    });
    onStorageChange("proxyUrlList", function (res) {
      setData(res.newValue || []);
    });
  }, []);

  const onEnableChange = (record, event) => {
    const enable = event.target.checked;
    const newData = [...data];
    const index = newData.findIndex(item => record.key === item.key);
    newData[index].enable = enable;
    setStorageSyncData({
      proxyUrlList: newData
    });
  }; //添加规则


  const onAdd = () => {
    onCancel();
    const newData = [...data];
    const record = {
      enable: true,
      key: Date.now(),
      name: "",
      original: "",
      replace: ""
    };
    newData.unshift(record);
    onEdit(record);
    setStorageSyncData({
      proxyUrlList: newData
    });
  }; // 编辑


  const onEdit = record => {
    form.setFieldsValue({
      enable: false,
      name: "",
      original: "",
      replace: "",
      ...record
    });
    setEditingKey(record.key);
  }; // 取消


  const onCancel = () => {
    setEditingKey("");
  }; // 保存


  const onSave = async ({
    key
  }) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item,
          ...row
        });
      } else {
        newData.push(row);
      }

      setStorageSyncData({
        proxyUrlList: newData
      });
      onCancel();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  }; //复制


  const onCopy = record => {
    const newData = [...data];
    const index = newData.findIndex(item => record.key === item.key);
    newData.splice(index + 1, 0, { ...record,
      key: Date.now(),
      name: `${record.name}-副本`
    });
    setStorageSyncData({
      proxyUrlList: newData
    });
  }; // 移动


  const onMove = (record, direction) => {
    const newData = [...data];
    const index = newData.findIndex(item => record.key === item.key);
    let newIndex = index + 1 * (direction === "up" ? -1 : 1);
    newIndex = Math.min(Math.max(newIndex, 0), newData.length - 1);
    [newData[index], newData[newIndex]] = [newData[newIndex], newData[index]];
    setStorageSyncData({
      proxyUrlList: newData
    });
  }; // 删除


  const onDelete = ({
    key
  }) => {
    const newData = [...data];
    const index = newData.findIndex(item => key === item.key);

    if (index > -1) {
      newData.splice(index, 1);
      setStorageSyncData({
        proxyUrlList: newData
      });
    }

    onCancel();
  }; // 删除全部规则


  const onDeleteAll = () => {
    Modal.confirm({
      title: "提示",
      content: "是否删除全部代理url配置？",
      onOk: () => {
        setStorageSyncData({
          proxyUrlList: []
        });
        onCancel();
      }
    });
  };

  const columns = [{
    title: "启用",
    dataIndex: "enable",
    width: 150,
    render: (v, record) => /*#__PURE__*/React.createElement(Checkbox, {
      checked: v,
      onChange: e => onEnableChange(record, e)
    })
  }, {
    title: "名称",
    dataIndex: "name",
    width: 200,
    editable: true
  }, {
    title: "原始值",
    dataIndex: "original",
    editable: true
  }, {
    title: "替换值",
    dataIndex: "replace",
    editable: true
  }, {
    title: "操作",
    dataIndex: "action",
    width: 200,
    lock: "left",
    render: (_, record) => {
      const editable = isEditing(record);
      return editable ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        onClick: () => onSave(record)
      }, "\u4FDD\u5B58"), /*#__PURE__*/React.createElement(Divider, {
        type: "vertical"
      }), /*#__PURE__*/React.createElement(Button, {
        type: "link",
        onClick: onCancel
      }, "\u53D6\u6D88")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        onClick: () => onEdit(record),
        disabled: editingKey !== ""
      }, "\u7F16\u8F91"), /*#__PURE__*/React.createElement(Divider, {
        type: "vertical"
      }), /*#__PURE__*/React.createElement(Dropdown, {
        overlay: /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(Menu.Item, null, /*#__PURE__*/React.createElement(Button, {
          type: "link",
          onClick: () => onCopy(record)
        }, "\u590D\u5236", /*#__PURE__*/React.createElement(CopyOutlined, null))), /*#__PURE__*/React.createElement(Menu.Item, null, /*#__PURE__*/React.createElement(Button, {
          type: "link",
          onClick: () => onMove(record, "up")
        }, "\u4E0A\u79FB", /*#__PURE__*/React.createElement(VerticalAlignTopOutlined, null))), /*#__PURE__*/React.createElement(Menu.Item, null, /*#__PURE__*/React.createElement(Button, {
          type: "link",
          onClick: () => onMove(record, "down")
        }, "\u4E0B\u79FB", /*#__PURE__*/React.createElement(VerticalAlignBottomOutlined, null))), /*#__PURE__*/React.createElement(Menu.Item, null, /*#__PURE__*/React.createElement(Button, {
          type: "link",
          onClick: () => onDelete(record)
        }, "\u5220\u9664", /*#__PURE__*/React.createElement(DeleteOutlined, null)))),
        disabled: editingKey !== ""
      }, /*#__PURE__*/React.createElement(Button, {
        type: "link"
      }, "\u66F4\u591A", /*#__PURE__*/React.createElement(DownOutlined, null))));
    }
  }];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return { ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  return /*#__PURE__*/React.createElement(ConfigProvider, {
    locale: locales.zh_CN
  }, /*#__PURE__*/React.createElement(Layout, {
    className: "layout"
  }, /*#__PURE__*/React.createElement(Header, null, /*#__PURE__*/React.createElement("div", {
    className: "logo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "description"
  }, "\u4EE3\u7406url\u8BF7\u6C42")), /*#__PURE__*/React.createElement(Content, {
    style: {
      padding: "0 50px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-layout-content"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    style: {
      marginBottom: 12,
      marginRight: 8
    },
    onClick: onAdd
  }, "\u6DFB\u52A0\u89C4\u5219"), /*#__PURE__*/React.createElement(Button, {
    style: {
      marginBottom: 12
    },
    onClick: onDeleteAll
  }, "\u5220\u9664\u5168\u90E8\u89C4\u5219"), /*#__PURE__*/React.createElement(Form, {
    form: form,
    component: false
  }, /*#__PURE__*/React.createElement(Table, {
    columns: mergedColumns,
    dataSource: data,
    rowClassName: "editable-row",
    bordered: true,
    components: {
      body: {
        cell: EditableCell
      }
    },
    pagination: false,
    size: "small",
    scroll: {
      y: window.innerHeight - 250
    }
  })))), /*#__PURE__*/React.createElement(Footer, {
    style: {
      textAlign: "center"
    }
  }, "Ant Design \xA9", new Date().getFullYear(), " ", /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/z-9527/proxy-url/tree/main",
    target: "_blank"
  }, "Created by zzh"))));
}

ReactDOM.render( /*#__PURE__*/React.createElement(Page, null), document.getElementById("root"));