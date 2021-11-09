// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"react-dom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.diffNode = diffNode;

var _index = require("./index");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function diff(dom, vnode, container) {
  var ret = diffNode(dom, vnode);

  if (container) {
    container.appendChild(ret);
  }

  return ret;
} // 对比


function diffNode(dom, vnode) {
  var out = dom;
  if (!vnode || typeof vnode === 'boolean') return; // 如果是number 转成字符串

  if (typeof vnode === 'number') {
    vnode = String(vnode);
  } // 如果 vnode 是字符串


  if (typeof vnode === "string") {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        // 更新文本内容
        dom.textContent = vnode;
      }
    } else {
      out = document.createTextNode(vnode);

      if (dom && dom.parentNode) {
        // 替换文本
        dom.parentNode.replaceNode(out, dom);
      }
    }

    return out;
  }

  if (typeof vnode.tag === 'function') {
    return diffComponent(out, vnode);
  } // 非文本Dom节点


  if (!dom) {
    // 创建节点对象
    out = document.createElement(vnode.tag);
  } // 比较子节点


  if (vnode.childrens && vnode.childrens.length > 0 || out.childNodes && out.childNodes.length > 0) {
    diffChildren(out, vnode.childrens);
  }

  diffAttribute(out, vnode);
  return out;
}

function unmountComonent(comp) {
  removeNode(comp.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom);
  }
}

function diffChildren(dom, vnodes) {
  var domChildren = dom.childNodes;
  var children = [];
  var keyd = {}; // 将有key的节点(用对象保存) 没有key的节点(用数组保存) 分开

  if (domChildren.length > 0) {
    _toConsumableArray(domChildren).forEach(function (item) {
      var key = item.key;

      if (key) {
        keyd[key] = item;
      } else {
        children.push(item);
      }
    });
  }

  if (vnodes && vnodes.length > 0) {
    var min = 0;
    var childrenLen = children.length;

    _toConsumableArray(vnodes).forEach(function (vnode, i) {
      // 获取虚拟dom所有的key
      console.log(vnode);
      var key = vnode && vnode.key;
      var child;

      if (key) {
        // 如果有key 找到对应key值的节点
        if (keyd[key]) {
          child = keyd[key];
          keyd[key] = undefined;
        }
      } else if (childrenLen > min) {
        // 如果没有key 则优先找类型相同的节点
        for (var j = 0; j < children.length; j++) {
          var c = children[j];

          if (c) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      } // 对比


      child = diffNode(child, vnode); // 更新dom

      var f = domChildren[i];

      if (child && child !== dom && child !== f) {
        // 如果更新前对应位置的节点为空, 表示新增
        if (!f) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          // 如果更新后的节点和更新前的节点下一个节点一样 说明当期位置的节点被删除了
          removeNode(f);
        } else {
          // 将更新后的节点移动到正确的位置
          dom.insertBefore(child, f); // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
        }
      }
    });
  }
}

function diffAttribute(dom, vnode) {
  // 缓存之前的dom的属性
  var oldAttrs = {};
  var newAttrs = vnode.attrs || {};
  var domArrts = document.querySelector('#root').attributes;

  _toConsumableArray(domArrts).forEach(function (item) {
    oldAttrs[item.name] = item.value;
  }); // 比较新老属性
  // 如果原来属性不在新属性中 则移除


  for (var key in oldAttrs) {
    if (!(key in newAttrs)) {
      (0, _index.setAttribute)(dom, key, undefined);
    }
  } // 更新


  for (var _key in newAttrs) {
    // 值不同 更新值
    if (oldAttrs[_key] !== newAttrs[_key]) {
      (0, _index.setAttribute)(dom, _key, newAttrs[_key]);
    }
  }
}

function diffComponent(dom, vnode) {
  var comp = dom; // 如果组件没有变化 重新设置props

  if (comp && comp.constructor === vnode.tag) {
    // 重新设置props
    (0, _index.setComponentProps)(comp, vnode.attrs); // 赋值

    dom = comp.base;
  } else {
    // 组件发生变化
    if (comp) {
      unmountComonent(comp);
      comp = null;
    } // 1. 创建新组件


    comp = (0, _index.createComponent)(vnode.tag, vnode.attrs); // 2. 设置组件属性

    (0, _index.setComponentProps)(comp, vnode.attrs); // 3. 给当期挂载base

    dom = comp.base;
  }

  return dom;
}
},{"./index":"react-dom/index.js"}],"react-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComponent = createComponent;
exports.setComponentProps = setComponentProps;
exports.renderComponent = renderComponent;
exports.setAttribute = setAttribute;
exports.default = void 0;

var _component = _interopRequireDefault(require("../react/component"));

var _diff = require("./diff");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ReactDom = {
  render: render
};

function render(vnode, container, dom) {
  return (0, _diff.diff)(dom, vnode, container); // const dom = _render(vnode)
  // dom && container.appendChild(dom)
}

function createComponent(comp, props) {
  var inst;

  if (comp.prototype && comp.prototype.render) {
    // 如果是类组件 创建实例 返回
    inst = new comp(props);
  } else {
    // 如果是函数组件 使用类组件包裹下输出结果
    inst = new _component.default(props);
    inst.construcor = comp;

    inst.render = function () {
      return this.construcor(props);
    };
  }

  return inst;
}

function setComponentProps(comp, props) {
  if (!comp.base) {
    // 没有真实dom
    if (comp.componentWillMount) comp.componentWillMount();
  } else if (comp.componentWillReceiveProps) {
    // 有真实dom props变化
    comp.componentWillReceiveProps();
  }

  comp.props = props;
  renderComponent(comp);
}

function renderComponent(comp) {
  var base;
  var renderRes = comp.render(); // 生成虚拟dom
  // const base = _render(renderRes)

  base = (0, _diff.diffNode)(comp.base, renderRes); // 有真实dom

  if (comp.base && comp.componentwillUpdate) {
    comp.componentwillUpdate();
  }

  if (comp.base) {
    if (comp.componentDidUpdate) {
      comp.componentDidUpdate();
    }
  } else if (comp.componentDidMount) {
    // dom生成完成 但是没有加载 前
    comp.componentDidMount();
  } // 节点替换  diff后不需要了
  // if (comp.base && comp.base.parentNode) {
  //   comp.base.parentNode.replaceChild(base, comp.base)
  // }


  comp.base = base;
}

function _render(vnode) {
  if (!vnode || typeof vnode === 'boolean') return; // 如果是number 转成字符串

  if (typeof vnode === 'number') {
    vnode = String(vnode);
  } // 如果 vnode 是字符串


  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  } // 否则就是虚拟 Dom 对象


  var _vnode = vnode,
      tag = _vnode.tag,
      attrs = _vnode.attrs,
      childrens = _vnode.childrens; // 如果tag是函数, 则渲染组件

  if (typeof tag === 'function') {
    // 1. 创建组件
    var comp = createComponent(vnode.tag, vnode.attrs); // 2. 设置组价的属性

    setComponentProps(comp, vnode.attrs); // 3. 返回组件渲染的节点

    return comp.base;
  } // 创建节点对象


  var dom = document.createElement(tag);

  if (attrs) {
    Object.keys(attrs).forEach(function (key) {
      setAttribute(dom, key, attrs[key]);
    });
  }

  Array.isArray(childrens) && childrens.forEach(function (child) {
    return render(child, dom);
  });
  return dom;
}

function setAttribute(dom, key, value) {
  if (key === "className") {
    key = "class";
  } // 如果是事件


  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || "";
  } else if (key === "style") {
    if (!value || typeof value === "string") {
      dom.style.cssText = value || "";
    } else if (value && _typeof(value) === "object") {
      for (var _key in value) {
        if (typeof value[_key] === "number") {
          dom.style[_key] = value[_key] + "px";
        } else {
          dom.style[_key] = value[_key];
        }
      }
    }
  } else {
    if (key in dom) {
      dom[key] = value || "";
    }

    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  }
}

var _default = ReactDom;
exports.default = _default;
},{"../react/component":"react/component.js","./diff":"react-dom/diff.js"}],"react/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactDom = require("../react-dom");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component = /*#__PURE__*/function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.props = props;
    this.state = {};
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(stateChange) {
      this.state = Object.assign(this.state, stateChange); // 渲染组件

      (0, _reactDom.renderComponent)(this);
    }
  }]);

  return Component;
}();

var _default = Component;
exports.default = _default;
},{"../react-dom":"react-dom/index.js"}],"react/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Component = void 0;

var _component = _interopRequireDefault(require("./component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = {
  createElement: createElement
};

function createElement(tag, attrs) {
  for (var _len = arguments.length, childrens = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    childrens[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: attrs,
    childrens: childrens,
    key: attrs ? attrs.key : null
  };
}

var Component = _component.default;
exports.Component = Component;
var _default = React;
exports.default = _default;
},{"./component":"react/component.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireWildcard(require("./react"));

var _reactDom = _interopRequireDefault(require("./react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Home = function Home(_ref) {
  var name = _ref.name;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "active",
    title: "\u6D4B\u8BD5",
    style: {
      width: 20
    }
  }, "hello, ", /*#__PURE__*/_react.default.createElement("span", null, "React -- ", name));
};

var Home1 = /*#__PURE__*/function (_Component) {
  _inherits(Home1, _Component);

  var _super = _createSuper(Home1);

  function Home1(props) {
    var _this;

    _classCallCheck(this, Home1);

    _this = _super.call(this, props);
    _this.state = {
      num: 1
    };
    return _this;
  }

  _createClass(Home1, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      console.log('组件将要加载');
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      console.log('props', props);
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      console.log('组件将要更新');
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      console.log('组件更新完成');
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log('组件加载完成');
    }
  }, {
    key: "click",
    value: function click() {
      this.setState({
        num: this.state.num + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      console.log(this.props);
      var _this$props = this.props,
          name = _this$props.name,
          name1 = _this$props.name1;
      var num = this.state.num;
      console.log('num', num);
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "active",
        title: "\u6D4B\u8BD5",
        style: {
          width: 20
        }
      }, "hello, ", /*#__PURE__*/_react.default.createElement("span", null, "React -- ", name), /*#__PURE__*/_react.default.createElement("span", null, name1), /*#__PURE__*/_react.default.createElement("div", null, num), /*#__PURE__*/_react.default.createElement("button", {
        style: {
          width: 100
        },
        onClick: this.click.bind(this)
      }, "\u70B9\u6211"));
    }
  }]);

  return Home1;
}(_react.Component);

var ele = /*#__PURE__*/_react.default.createElement("div", {
  className: "active",
  title: "123"
}, "hello,", /*#__PURE__*/_react.default.createElement("span", null, "react")); // ReactDom.render(ele, document.getElementById("root"));


_reactDom.default.render( /*#__PURE__*/_react.default.createElement(Home1, {
  name: "11"
}), document.getElementById("root")); // const App = (
//   <div className="active" title="测试" style={{ width: 20 }}>
//     hello, <span>React</span>
//   </div>
// );
},{"./react":"react/index.js","./react-dom":"react-dom/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "2917" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/MiniReact.e31bb0bc.js.map