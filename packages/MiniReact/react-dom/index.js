import Component from '../react/component'

const ReactDom = {
  render,
};

function render (vnode, container) {
  const dom = _render(vnode)
  dom && container.appendChild(dom)
}

function createComponent (comp, props) {
  let inst
  if (comp.prototype && comp.prototype.render) {
    // 如果是类组件 创建实例 返回
    inst = new comp(props)
  } else {
    // 如果是函数组件 使用类组件包裹下输出结果
    inst = new Component(props)
    inst.construcor = comp
    inst.render = function () {
      return this.construcor(props)
    }
  }
  return inst
}

function setComponentProps (comp, props) {
  if (!comp.base) { // 没有真实dom
    if (comp.componentWillMount) comp.componentWillMount()
  } else if (comp.componentWillReceiveProps) { // 有真实dom props变化
    comp.componentWillReceiveProps()
  }
  comp.props = props
  renderComponent(comp)
}

export function renderComponent (comp) {
  const renderRes = comp.render() // 生成虚拟dom
  const base = _render(renderRes)

  // 有真实dom
  if (comp.base && comp.componentwillUpdate) {
    comp.componentwillUpdate()
  }

  if (comp.base) {
    if (comp.componentDidUpdate) {
      comp.componentDidUpdate()
    }
  } else if (comp.componentDidMount) { // dom生成完成 但是没有加载 前
    comp.componentDidMount()
  }

  if (comp.base && comp.base.parentNode) {
    comp.base.parentNode.replaceChild(base, comp.base)
  }
  comp.base = base
}

function _render (vnode) {
  if (!vnode || typeof vnode === 'boolean') return;

  // 如果是number 转成字符串
  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }
  // 如果 vnode 是字符串
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  // 否则就是虚拟 Dom 对象
  const { tag, attrs, childrens } = vnode;

  // 如果tag是函数, 则渲染组件
  if (typeof tag === 'function') {
    // 1. 创建组件
    const comp = createComponent(vnode.tag, vnode.attrs)
    // 2. 设置组价的属性
    setComponentProps(comp, vnode.attrs)
    // 3. 返回组件渲染的节点

    return comp.base
  }

  // 创建节点对象
  const dom = document.createElement(tag);

  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      setAttribute(dom, key, attrs[key]);
    });
  }

  Array.isArray(childrens) && childrens.forEach(child => render(child, dom))

  return dom;
}

function setAttribute (dom, key, value) {
  if (key === "className") {
    key = "class";
  }

  // 如果是事件
  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || "";
  } else if (key === "style") {
    if (!value || typeof value === "string") {
      dom.style.cssText = value || "";
    } else if (value && typeof value === "object") {
      for (const key in value) {
        if (typeof value[key] === "number") {
          dom.style[key] = value[key] + "px";
        } else {
          dom.style[key] = value[key];
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

export default ReactDom;
