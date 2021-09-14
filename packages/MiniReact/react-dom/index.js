const ReactDom = {
  render,
};

function render(vnode, container) {
  if (!vnode) return;

  // 如果 vnode 是字符串
  if (typeof vnode === "string") {
    const textNode = document.createTextNode(vnode);
    console.log(container);
    return container.appendChild(textNode);
  }

  // 否则就是虚拟 Dom 对象
  const { tag, attrs, children } = vnode;

  // 创建节点对象
  const dom = document.createElement(tag);

  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      setAttribute(dom, key, attrs[key]);
    });
  }

  return container.appendChild(dom);
}

function setAttribute(dom, key, value) {
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
    console.log(key in dom, value);
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
