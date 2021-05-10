const {
  useState,
  useEffect,
  useRef
} = React;
const {
  Table,
  Button,
  Switch,
  Checkbox,
  ConfigProvider,
  locales,
  Tabs,
  Radio,
  Divider,
  Input,
  message
} = antd;
const {
  setStorageSyncData,
  onStorageChange,
  getStorageSyncData
} = Storage;
const {
  getCurTabCookies,
  setCookies
} = Cookies;
const {
  SettingOutlined,
  CopyOutlined,
  ImportOutlined
} = icons;

function Popup() {
  const [data, setData] = useState();
  const [activeKey, setActiveKey] = useState();
  const textValue = useRef();
  useEffect(() => {
    getStorageSyncData().then(res => {
      setData(res.proxyUrlList || []);
      setActiveKey(res.activeTabKey || "url");
    });
    onStorageChange("proxyUrlList", function (res) {
      setData(res.newValue || []);
      Request.changeRules(res.newValue);
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
  };

  const onAllChange = enable => {
    let newData = [...data];
    newData = newData.map(item => ({ ...item,
      enable
    }));
    setStorageSyncData({
      proxyUrlList: newData
    });
  };

  const columns = [{
    title: "启用",
    dataIndex: "enable",
    width: 70,
    align: "center",
    render: (v, record) => /*#__PURE__*/React.createElement(Checkbox, {
      checked: v,
      onChange: e => onEnableChange(record, e)
    })
  }, {
    title: "名称",
    dataIndex: "name",
    width: 200
  }];

  const onTabChange = key => {
    setActiveKey(key);
    setStorageSyncData({
      activeTabKey: key
    });
  };

  const onCopy = async () => {
    const res = await getCurTabCookies({});
    copyToClip(JSON.stringify(res));
    message.success("已复制到剪切板");
  };

  const onCopyLocalhost = async () => {
    let res = await getCurTabCookies({});
    res = res.map(item => ({ ...item,
      domain: "localhost"
    }));
    copyToClip(JSON.stringify(res));
    message.success("已复制到剪切板");
  };

  const onImport = async text => {
    if (!text) {
      return;
    }

    try {
      await setCookies(JSON.parse(text));
      message.success("导入成功");
    } catch (error) {
      message.error("请导入正确的格式");
    }
  };

  const onImportPlate = async () => {
    const text = getClipboard();
    onImport(text);
  };

  return /*#__PURE__*/React.createElement(ConfigProvider, {
    locale: locales.zh_CN
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(Tabs, {
    activeKey: activeKey,
    onChange: onTabChange
  }, /*#__PURE__*/React.createElement(Tabs.TabPane, {
    tab: "\u4EE3\u7406url",
    key: "url"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "link",
    href: "options.html",
    style: {
      marginBottom: 12
    },
    target: "_blank"
  }, /*#__PURE__*/React.createElement(SettingOutlined, null), "\u6DFB\u52A0\u89C4\u5219"), /*#__PURE__*/React.createElement(Switch, {
    checkedChildren: "\u5168\u90E8\u542F\u7528",
    unCheckedChildren: "\u5168\u90E8\u5173\u95ED",
    onChange: onAllChange
  }), /*#__PURE__*/React.createElement(Table, {
    columns: columns,
    dataSource: data,
    bordered: true,
    pagination: false,
    size: "small",
    scroll: {
      y: 300
    }
  })), /*#__PURE__*/React.createElement(Tabs.TabPane, {
    tab: "cookie",
    key: "cookie"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    onClick: onCopy
  }, /*#__PURE__*/React.createElement(CopyOutlined, null), "\u590D\u5236"), /*#__PURE__*/React.createElement(Divider, {
    type: "vertical"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "small",
    onClick: onCopyLocalhost
  }, /*#__PURE__*/React.createElement(CopyOutlined, null), "\u590D\u5236\u5E76\u8F6Clocalhost"), /*#__PURE__*/React.createElement(Divider, {
    type: "vertical"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "small",
    onClick: onImportPlate
  }, /*#__PURE__*/React.createElement(ImportOutlined, null), "\u5BFC\u5165\u526A\u5207\u677F")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Input.TextArea, {
    rows: 14,
    onChange: e => textValue.current = e.target.value
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    type: "primary",
    onClick: () => onImport(textValue.current)
  }, /*#__PURE__*/React.createElement(ImportOutlined, null), "\u5BFC\u5165")))))));
}

ReactDOM.render( /*#__PURE__*/React.createElement(Popup, null), document.getElementById("root"));