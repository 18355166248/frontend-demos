import React from "./react";
import ReactDom from "./react-dom";

const App = (
  <div className="active" title="测试" style={{ width: 20 }}>
    hello, <span>React</span>
  </div>
);

ReactDom.render(App, document.getElementById("root"));

console.log(App);
