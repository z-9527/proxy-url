function Popup(){

   function test(){
    chrome.storage.sync.get("color",async ({ color }) => {
      console.log('color33333: ', color);
    });
  }

  return (
    <div>
      fslkjfdlaj
      <div>color</div>
      <button onClick={test}>fdasfasf</button>
      <a href="options.html" target="_blank" tabIndex="-1" class="btn btn-primary btn-xs">管理规则</a>
    </div>
  )
}



chrome.storage.sync.get("color", ({ color }) => {
  console.log('color: ', color);
});

ReactDOM.render(<Popup />, document.getElementById("root"));




