function Popup() {
  function test() {
    chrome.storage.sync.get("color", async ({
      color
    }) => {
      console.log('color33333: ', color);
    });
  }

  return /*#__PURE__*/React.createElement("div", null, "fslkjfdlaj", /*#__PURE__*/React.createElement("div", null, "color"), /*#__PURE__*/React.createElement("button", {
    onClick: test
  }, "fdasfasf"), /*#__PURE__*/React.createElement("a", {
    href: "options.html",
    target: "_blank",
    tabIndex: "-1",
    class: "btn btn-primary btn-xs"
  }, "\u7BA1\u7406\u89C4\u5219"));
}

chrome.storage.sync.get("color", ({
  color
}) => {
  console.log('color: ', color);
});
ReactDOM.render( /*#__PURE__*/React.createElement(Popup, null), document.getElementById("root"));