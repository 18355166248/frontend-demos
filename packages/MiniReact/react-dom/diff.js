import { setAttribute, setComponentProps } from './index'

export function diff (dom, vnode, container) {
  const ret = diffNode(dom, vnode)

  if (container) {
    container.appendChild(ret)
  }

  return ret
}

// 对比
function diffNode (dom, vnode) {
  let out = dom;
  if (!vnode || typeof vnode === 'boolean') return;

  // 如果是number 转成字符串
  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }
  // 如果 vnode 是字符串
  if (typeof vnode === "string") {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        // 更新文本内容
        dom.textContent = vnode
      }
    } else {
      out = document.createTextNode(vnode)
      if (dom && dom.parentNode) {
        // 替换文本
        dom.parentNode.replaceNode(out, dom)
      }
    }

    return out
  }

  if (typeof vnode.tag === 'function') {
    diffComponent(out, vnode)
  }

  // 非文本Dom节点
  if (!dom) {
    // 创建节点对象
    out = document.createElement(vnode.tag);
  }

  // 比较子节点
  if (vnode.childrens && vnode.childrens.length > 0 || (out.childNodes && out.childNodes.length > 0)) {
    diffChildren(out, vnode.childrens)
  }

  diffAttribute(out, vnode)

  return out
}

function unmountComonent (comp) {
  removeNode(comp.base)
}
function removeNode (dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom);
  }
}

function diffChildren (dom, vnodes) {
  const domChildren = dom.childNodes
  const children = []
  const keyd = {}

  // 将有key的节点(用对象保存) 没有key的节点(用数组保存) 分开
  if (domChildren.length > 0) {
    [...domChildren].forEach(item => {
      const key = item.key
      if (key) {
        keyd[key] = item
      } else {
        children.push(item)
      }
    })
  }

  if (vnodes && vnodes.length > 0) {
    let min = 0
    let childrenLen = children.length;
    [...vnodes].forEach((vnode, i) => {
      // 获取虚拟dom所有的key
      const key = vnode.key
      let child;
      if (key) {
        // 如果有key 找到对应key值的节点
        if (keyd[key]) {
          child = keyd[key]
          keyd[key] = undefined
        }
      } else if (childrenLen > min) {
        // 如果没有key 则优先找类型相同的节点
        for (let j = 0; j < children.length; j++) {
          let c = array[j];
          if (c) {
            child = c
            children[j] = undefined
            if (j === childrenLen - 1) childrenLen--
            if (j === min) min++
            break
          }
        }
      }

      // 对比
      child = diffNode(child, vnode)
      // 更新dom
      const f = domChildren[i]

      if (child && child !== dom && child !== f) {
        // 如果更新前对应位置的节点为空, 表示新增
        if (!f) {
          dom.appendChild(child)
        } else if (child === f.nextSibling) { // 如果更新后的节点和更新前的节点下一个节点一样 说明当期位置的节点被删除了
          removeNode(f)
        } else { // 将更新后的节点移动到正确的位置
          dom.insertBefore(child, f) // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
        }
      }
    })
  }
}

function diffAttribute (dom, vnode) {
  // 缓存之前的dom的属性
  const oldAttrs = {}
  const newAttrs = vnode.attrs || {}
  const domArrts = document.querySelector('#root').attributes;
  [...domArrts].forEach(item => {
    oldAttrs[item.name] = item.value
  })

  // 比较新老属性
  // 如果原来属性不在新属性中 则移除
  for (const key in oldAttrs) {
    if (!(key in newAttrs)) {
      setAttribute(dom, key, undefined)
    }
  }

  // 更新
  for (const key in newAttrs) {
    // 值不同 更新值
    if (oldAttrs[key] !== newAttrs[key]) {
      setAttribute(dom, key, newAttrs[key])
    }
  }
}

function diffComponent (dom, vnode) {
  const comp = dom
  // 如果组件没有变化 重新设置props
  if (comp && comp.constructor === vnode.tag) {
    // 重新设置props
    setComponentProps(comp, vnode.attrs)
    // 赋值
    dom = comp.base
  } else {
    // 组件发生变化
    if (comp) {
      unmountComonent(comp)
      comp = null
    }
  }
}
