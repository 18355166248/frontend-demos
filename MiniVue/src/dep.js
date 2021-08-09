// 相当于响应式属性的发布者, 当我们对响应式属性在 setter 中进行更新的时候, 会调用 Dep 中notify 方法通知更新

class Dep {
  constructor() {
    // 存储观察者
    this.subs = [];
  }
  // 添加观察者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub);
    }
  }
  // 通知
  notify() {
    this.subs.forEach((sub) => sub.update());
  }
}
