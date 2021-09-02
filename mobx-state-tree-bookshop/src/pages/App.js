import React from "react";
import {
  onSnapshot,
  onAction,
  onPatch,
  applySnapshot,
  applyAction,
  applyPatch,
  getSnapshot,
} from "mobx-state-tree";
import { Provider } from "mobx-react";
import createRouter from "../utils/router";
import { observable, reaction } from "mobx";
import { ShopStore } from "../stores/ShopStore.js";
import ShopView from "./ShopView";
import DevTools from "./ShopView/DevTools";

const fetcher = (url) => window.fetch(url).then((response) => response.json());

const shop = ShopStore.create(
  {},
  {
    fetch: fetcher,
    alert: (txt) => {
      console.log(txt);
    },
  }
);

// 路由处理 start
const router = createRouter({
  "/book/:bookId": ({ bookId }) => shop.view.openBookPageById(bookId),
  "/cart": () => shop.view.openCartPage(),
  "/": () => shop.view.openBooksPage(),
});

window.onpopstate = function historyChange(ev) {
  if (ev.type === "popstate") router(window.location.pathname);
};

router(window.location.pathname);
// 路由处理 end

const history = {
  snapshots: observable.array([], { deep: false }),
  actions: observable.array([], { deep: false }),
  patches: observable.array([], { deep: false }),
};

function App() {
  return (
    <Provider shop={shop} history={history}>
      <ShopView />
      <DevTools />
    </Provider>
  );
}

// 监听数值变化 改变地址栏名称 不会影响页面刷新
reaction(
  () => shop.view.currentUrl,
  (path) => {
    if (window.location.pathname !== path)
      window.history.pushState(null, null, path);
  }
);

export default App;

let recording = true; // 重放的时候禁止记录历史记录

onSnapshot(
  shop,
  (s) =>
    recording &&
    history.snapshots.unshift({
      data: s,
      replay() {
        recording = false;
        applySnapshot(shop, this.data);
        recording = true;
      },
    })
);

onPatch(
  shop,
  (s) =>
    recording &&
    history.patches.unshift({
      data: s,
      replay() {
        recording = false;
        applyPatch(shop, this.data);
        recording = true;
      },
    })
);

onAction(
  shop,
  (s) =>
    recording &&
    history.actions.unshift({
      data: s,
      replay() {
        recording = false;
        applyAction(shop, s);
        recording = true;
      },
    })
);

// 初始化添加
history.snapshots.push({
  data: getSnapshot(shop),
  replay() {
    recording = false;
    applySnapshot(shop, this.data);
    recording = true;
  },
});
