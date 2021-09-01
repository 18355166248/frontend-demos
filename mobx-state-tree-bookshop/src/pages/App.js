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

const fetcher = (url) => window.fetch(url).then((response) => response.json());

const shop = ShopStore.create(
  {},
  {
    fetch: fetcher,
    text: "测试环境变量文本",
  }
);

const router = createRouter({
  "/book/:bookId": ({ bookId }) => {},
  "/cart": () => {},
  "/": () => {
    console.log("/");
  },
});

window.onpopstate = function historyChange(ev) {
  if (ev.type === "popstate") router(window.location.pathname);
};

router(window.location.pathname);

const history = {
  snapshots: observable.array([], { deep: false }),
  actions: observable.array([], { deep: false }),
  patches: observable.array([], { deep: false }),
};

function App() {
  return (
    <Provider shop={shop} history={history}>
      <ShopView />
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
