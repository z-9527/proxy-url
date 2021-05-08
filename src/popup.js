const { useState, useEffect } = React;
const { Table, Button, Switch, Checkbox, ConfigProvider, locales } = antd;
const { setStorageSyncData, onStorageChange, getStorageSyncData } = Storage;
const { SettingOutlined } = icons;
function Popup() {
  const [data, setData] = useState();

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

  const onAllChange = (enable) => {
    let newData = [...data];
    newData = newData.map((item) => ({ ...item, enable }));
    setStorageSyncData({ proxyUrlList: newData });
  };

  const columns = [
    {
      title: "启用",
      dataIndex: "enable",
      width: 70,
      align: "center",
      render: (v, record) => (
        <Checkbox checked={v} onChange={(e) => onEnableChange(record, e)} />
      ),
    },
    {
      title: "名称",
      dataIndex: "name",
      width: 200,
    },
  ];
  return (
    <ConfigProvider locale={locales.zh_CN}>
      <div className="container">
        <Button
          type="link"
          href="options.html"
          style={{ marginBottom: 12 }}
          target="_blank"
        >
          <SettingOutlined />
          添加规则
        </Button>
        <Switch
          checkedChildren="全部启用"
          unCheckedChildren="全部关闭"
          onChange={onAllChange}
        />
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={false}
          size="small"
          scroll={{ y: 300 }}
        />
      </div>
    </ConfigProvider>
  );
}

ReactDOM.render(<Popup />, document.getElementById("root"));
