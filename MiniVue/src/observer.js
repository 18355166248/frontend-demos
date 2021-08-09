// 将 data 中的属性变为响应式加载自身的身上

class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    if (!data || typeof data !== "object") return;

    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }
  defineReactive(obj, key, value) {
    const self = this;
    // 调用 walk 如果 value 是对象类型 也需要变成响应式, 不是的话会在一开始被拦截
    this.walk(value);

    // 创建 Dep 对象
    const dep = new Dep();

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 存放入 观察者 watcher
        Dep.target && dep.addSub(Dep.target);

        return value;
      },
      set(newValue) {
        if (newValue === value) return;
        value = newValue;
        // 赋值的时候 如果 newVal是对象, 它里面的对象也需要递归变成响应式
        self.walk(newValue);

        // 将对应的观察者全部更新 更新视图
        dep.notify();
      },
    });
  }
}
