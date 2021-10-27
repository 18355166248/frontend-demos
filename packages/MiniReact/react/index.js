import _Component from './component'

const React = {
  createElement,
};

function createElement (tag, attrs, ...childrens) {
  return {
    tag,
    attrs,
    childrens,
    key: attrs ? attrs.key : null
  };
}

export const Component = _Component

export default React;
