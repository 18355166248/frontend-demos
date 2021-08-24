import React from "react";
import ReactDom from "react-dom";
import App from "./pages/App";
import {
  onSnapshot,
  onAction,
  onPatch,
  applySnapshot,
  applyAction,
  applyPatch,
  getSnapshot,
} from "mobx-state-tree";
import createRouter from "./utils/router";

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

ReactDom.render(<App />, document.getElementById("root"));
