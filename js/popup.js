const {
  useState,
  useEffect
} = React;
const {
  Table,
  Button,
  Switch,
  Checkbox,
  ConfigProvider,
  locales
} = antd;
const {
  setStorageSyncData,
  onStorageChange,
  getStorageSyncData
} = Storage;
const {
  SettingOutlined
} = icons;

function Popup() {
  const [data, setData] = useState();
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
  return /*#__PURE__*/React.createElement(ConfigProvider, {
    locale: locales.zh_CN
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
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
  })));
}

ReactDOM.render( /*#__PURE__*/React.createElement(Popup, null), document.getElementById("root"));