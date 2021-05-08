const { useState, useEffect, useRef } = React;
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
  message,
} = antd;
const { setStorageSyncData, onStorageChange, getStorageSyncData } = Storage;
const { getCurTabCookies, setCookies } = Cookies;
const { SettingOutlined, CopyOutlined, ImportOutlined } = icons;

function Popup() {
  const [data, setData] = useState();
  const [activeKey, setActiveKey] = useState();
  const textValue = useRef();

  useEffect(() => {
    getStorageSyncData().then((res) => {
      setData(res.proxyUrlList || []);
      setActiveKey(res.activeTabKey || "url");
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
  const onTabChange = (key) => {
    setActiveKey(key);
    setStorageSyncData({ activeTabKey: key });
  };

  const onCopy = async () => {
    const res = await getCurTabCookies({});
    copyToClip(JSON.stringify(res));
    message.success("已复制到剪切板");
  };

  const onCopyLocalhost = async () => {
    let res = await getCurTabCookies({});
    res = res.map((item) => ({ ...item, domain: "localhost" }));
    copyToClip(JSON.stringify(res));
    message.success("已复制到剪切板");
  };

  const onImport = async () => {
    if (!textValue.current) {
      return;
    }
    await setCookies(JSON.parse(textValue.current));
    message.success("导入成功");
  };

  return (
    <ConfigProvider locale={locales.zh_CN}>
      <div className="container">
        <Tabs activeKey={activeKey} onChange={onTabChange}>
          <Tabs.TabPane tab="代理url" key="url">
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
          </Tabs.TabPane>
          <Tabs.TabPane tab="cookie" key="cookie">
            <div style={{ marginBottom: 10 }}>
              <Button size="small" onClick={onCopy}>
                <CopyOutlined />
                复制
              </Button>
              <Divider type="vertical" />
              <Button size="small" onClick={onCopyLocalhost}>
                <CopyOutlined />
                复制并转localhost
              </Button>
              <Divider type="vertical" />
            </div>
            <div>
              <Input.TextArea
                rows={14}
                onChange={(e) => (textValue.current = e.target.value)}
              />
              <div style={{ textAlign: "right", marginTop: 8 }}>
                <Button size="small" type="primary" onClick={onImport}>
                  <ImportOutlined />
                  导入
                </Button>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </ConfigProvider>
  );
}

ReactDOM.render(<Popup />, document.getElementById("root"));
