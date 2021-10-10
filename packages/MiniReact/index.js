import React from "./react";
import ReactDom from "./react-dom";

const Home = ({ name }) => {
  return (
    <div className="active" title="测试" style={{ width: 20 }}>
      hello, <span>React -- {name}</span>
    </div>
  )
}

const App = (
  <div className="active" title="测试" style={{ width: 20 }}>
    hello, <span>React</span>
  </div>
);

ReactDom.render(<Home name="actice" />, document.getElementById("root"));
