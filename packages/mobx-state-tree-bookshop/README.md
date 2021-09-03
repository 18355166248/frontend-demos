# 学习 mobx mobx-react mobx-state-tree demo

## 预览图

![购物车](https://raw.githubusercontent.com/18355166248/frontend-demos/main/mobx-state-tree-bookshop/src/assets/preview1.jpg)

![首页](https://raw.githubusercontent.com/18355166248/frontend-demos/main/mobx-state-tree-bookshop/src/assets/preview2.jpg)

## API

### 初始化

1. 使用 mobx-react 的 Provider 包裹下, 相当于 react 的 Context
   再使用 inject 配合在子组件中拿到 全局绑定的数据
   官方在推荐使用 React.createContext

2. mobx 的 reaction 相当于对某条数据做监听, 如果值有变化就触发第二个函数, 我们这里的用法就是改变了当期的路由 path, 然后也要同步的修改 history 的记录, 动态修改 url 地址栏数据

3. mobx 的 observer 相当于对某条数据做了监听, 如果这条数据有变化就会触发更新

4. onSnapshot,
   onAction,
   onPatch,
   applySnapshot,
   applyAction,
   applyPatch,
   getSnapshot

onSnapshot: 监听 store 的 snapshot
onAction: 监听 store 的 action
onPatch: 监听 store 的 patch
applySnapshot: 写入到 MST 的 snapshot 中
applyAction: 写入到 MST 的 action 中
applyPatch: 写入到 MST 的 patch 中
getSnapshot: 获取快照

5. types

声明一个 store
链式的可以声明 views( 就是 get ), actions ( 修改 store 数据的方法 )

看文档: https://mobx-state-tree.js.org/API/#onpatch

types.optional 可用于创建有默认值的属性
types.map 数据是 Map 类型
types.array 数据是 Array 类型
types.reference 引用类型

6. flow (mobx-state-tree) 异步在 acitons 中修改 store

7. getParent (mobx-state-tree) 获取父级, 第二个参数表示网上走几步

8. getEnv (mobx-state-tree) 获取全局环境变量的数据, 也可以自定义声明, 也就是在 store.create 的时候, 第二个参数为对象 可以声明 env 变量

9. mobx-state-tree 声明周期

afterCreate 在创建实例并应用初始值之后立即

afterAttach 监听父元素变化触发

beforeDetach 一旦节点从直接父节点中移除，但前提是节点没有被销毁。换句话说，当使用 detach(node) 时

beforeDestroy 在节点被销毁之前调用，作为调用 destroy 的结果，或者通过从树中删除或替换节点。子析构函数会在父母之前开火

preProcessSnapshot 创建实例或将快照应用于现有实例之前

postProcessSnapshot 每次生成新快照时都会调用此回调

注: preProcessSnapshot 和 postProcessSnapshot 跟 model view actions 同级, 其他的都必须在 actions 中声明

#### types.array 和 types.map 的声明周期

```js
{
  books: types.map(Book).hooks((self) => ({
    afterCreate() {
      console.log("map.hooks.afterCreate", self);
    },
    afterAttach() {
      console.log("map.hooks.afterAttach", self);
    },
    beforeDetach() {
      console.log("map.hooks.beforeDetach", self);
    },
    beforeDestroy() {
      console.log("map.hooks.beforeDestroy", self);
    },
  }));
}
```
