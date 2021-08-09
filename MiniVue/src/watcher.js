// 数据更新后 收到通知之后 调用 update 进行更新

class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    // 把观察者存放在 Dep.target
    Dep.target = this;
    // 旧数据 更新视图的时候需要比较
    // 还有一点很重要 vm[key] 这个时候会触发 get 方法
    // get 方法里面 将 Dep.target 的通过 addSub 将 Watcher 实例放进了 Dep中
    this.oldValue = vm[key];
    // Dep.target 不用存在了 销毁
    Dep.target = null;
  }
  update() {
    // 获取新值
    const newValue = this.vm[this.key];
    if (newValue === this.oldValue) return;
    this.cb(newValue);
  }
}
