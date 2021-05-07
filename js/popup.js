const {
  Table,
  Button,
  Switch,
  Checkbox
} = antd;
const originData = [];

for (let i = 0; i < 13; i++) {
  originData.push({
    key: i.toString(),
    name: `测试测试${i + 1}`,
    original: "www.baidu.com",
    replace: "www.test.com"
  });
}

function Popup() {
  const {
    useState
  } = React;
  const [data, setData] = useState(originData);
  const columns = [{
    title: "启用",
    dataIndex: "enable",
    width: 70,
    align: 'center',
    render: v => /*#__PURE__*/React.createElement(Checkbox, null)
  }, {
    title: "名称",
    dataIndex: "name",
    width: 200
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "link",
    href: "options.html",
    style: {
      marginBottom: 12
    },
    target: "_blank"
  }, "\u6DFB\u52A0\u89C4\u5219"), /*#__PURE__*/React.createElement(Switch, {
    checkedChildren: "\u5168\u90E8\u542F\u7528",
    unCheckedChildren: "\u5168\u90E8\u5173\u95ED"
  }), /*#__PURE__*/React.createElement(Table, {
    columns: columns,
    dataSource: data,
    bordered: true,
    pagination: false,
    size: "small",
    scroll: {
      y: 300
    }
  }));
}

ReactDOM.render( /*#__PURE__*/React.createElement(Popup, null), document.getElementById("root"));