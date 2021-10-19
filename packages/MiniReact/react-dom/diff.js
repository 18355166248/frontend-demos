export function diff (dom, vnode, container) {
  const ret = diffNode(dom, vnode)

  if (container) {
    container.appendChild(ret)
  }

  return ret
}

function diffNode (dom, vnode) {

}
