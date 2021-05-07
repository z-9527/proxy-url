const { Table, Button, Switch, Checkbox } = antd;

const originData = [];

for (let i = 0; i < 13; i++) {
  originData.push({
    key: i.toString(),
    name: `测试测试${i + 1}`,
    original: "www.baidu.com",
    replace: "www.test.com",
  });
}

function Popup() {
  const { useState } = React;
  const [data, setData] = useState(originData);
  const columns = [
    {
      title: "启用",
      dataIndex: "enable",
      width: 70,
      align:'center',
      render: (v) => <Checkbox />,
    },
    {
      title: "名称",
      dataIndex: "name",
      width: 200,
    },
  ];
  return (
    <div className="container">
      <Button
        type="link"
        href="options.html"
        style={{ marginBottom: 12 }}
        target="_blank"
      >
        添加规则
      </Button>

      <Switch checkedChildren="全部启用" unCheckedChildren="全部关闭" />
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        size="small"
        scroll={{ y: 300 }}
      />
    </div>
  );
}

ReactDOM.render(<Popup />, document.getElementById("root"));
