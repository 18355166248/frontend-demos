import _Component from './component'

const React = {
  createElement,
};

function createElement (tag, attrs, ...childrens) {
  return {
    tag,
    attrs,
    childrens,
  };
}

export const Component = _Component

export default React;
