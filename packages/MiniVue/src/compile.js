// 对文本节点和元素指令进行编译

class Compile {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;
    this.compile(this.el);
  }
  compile(el) {
    const childNodes = [...el.childNodes];
    childNodes.forEach((node) => {
      // 根据不同节点进行编译
      // 文本类型节点
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        this.compileElement(node);
      }

      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }

  // 编译文本节点
  compileText(node) {
    // 核心就是用正则把 {{}} 去掉找到里面的变量 再去 vue 找到这个变量值赋值给node.textContent
    const reg = /\{\{(.+?)\}\}/;
    // 获取节点的文本内容
    const content = node.textContent;
    if (reg.test(content)) {
      let key = RegExp.$1.trim().split(".");
      const val = this._getValue(this.vm, key);
      // 进行替换再赋值给node
      node.textContent = content.replace(reg, val);
      // 创建观察者
      new Watcher(this.vm, key, (newVal) => {
        node.textContent = content.replace(reg, newVal);
      });
    }
  }

  // 编译元素节点这里只处理指令
  compileElement(node) {
    [...node.attributes].forEach((attr) => {
      let attrName = attr.name; // 获取属性名
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2);
        const key = attr.value;
        this.update(node, key, attrName);
      }
    });
  }

  // 添加指令方法 并且执行
  update(node, key, attrName) {
    const updateFn = this[attrName + "Updater"];
    const val = this._getValue(this.vm, key.split("."));
    updateFn && updateFn.call(this, node, key, val);
  }

  isTextNode(node) {
    return node.nodeType === 3;
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
  isDirective(attr) {
    return attr.startsWith("v-");
  }
  // v-model
  modelUpdater(node, key, value) {
    node.value = value;
    // 创建观察者
    new Watcher(this.vm, key, (newVal) => {
      node.textContent = newVal;
    });
    // 实现双向绑定 监听 input 事件修改属性值
    node.addEventListener("input", () => {
      this.vm[key] = node.value;
    });
  }
  // v-text {
  textUpdater(node, key, value) {
    node.textContent = value;
    // 创建观察者
    new Watcher(this.vm, key, (newVal) => {
      node.textContent = newVal;
    });
  }
  _getValue(obj, keyArr) {
    if (!(keyArr instanceof Array)) return obj[keyArr];

    return keyArr.reduce((target, key) => {
      return target[key] || {};
    }, obj);
  }
}
