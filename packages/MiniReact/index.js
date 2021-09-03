const React = {
  createElement,
};

function createElement(tag, attrs, ...childrens) {
  return {
    tag,
    attrs,
    childrens,
  };
}

const App = (
  <div className="active" title="测试">
    hello, <span>React</span>
  </div>
);

console.log(App);
