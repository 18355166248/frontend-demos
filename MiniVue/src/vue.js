class Vue {
  constructor(options) {
    this.$options = options || {};
    // 获取 el
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;
    this.$data = options.data || {};
    this._proxyData(this.$data);

    // 使用 Observer 将data数据响应式绑定在自身
    new Observer(this.$data);
    // 编译指令
    new Compile(this);
  }
  // 把 data 中的数据映射到 vue 实例上
  _proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true, // 设置可以枚举
        configurable: true, // 设置可以配置
        get() {
          return data[key];
        },
        set(newValue) {
          // 判断新值旧值是否相等 做拦截
          if (newValue === data[key]) return;
          data[key] = newValue;
        },
      });
    });
  }
}
