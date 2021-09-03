import React from "react";
import { observer, inject } from "mobx-react";
import logo from "./shop.svg";
import "./index.css";
import Books from "./Books";
import Cart from "./Cart";
import BookDetail from "./BookDetail";
import NotFound from "../NotFound";

const ShopView = inject("shop")(
  observer(({ shop }) => {
    return (
      <div className="App">
        <ShopHeader />
        <AppMenu>
          <AppMenuItem
            onClick={() => {
              shop.view.openBooksPage();
            }}
          >
            书籍
          </AppMenuItem>
          <AppMenuItem
            onClick={() => {
              shop.view.openCartPage();
            }}
          >
            购物车
          </AppMenuItem>
        </AppMenu>
        <section>
          {shop.isLoading ? <h1>loading...</h1> : renderPage(shop.view)}
        </section>
      </div>
    );
  })
);

const ShopHeader = () => (
  <div className="App-Headers">
    <img src={logo} className="App-logo" alt="logo" />
    <h2>欢迎来到 Mobx 书店!</h2>
  </div>
);

// 路由显示不用组件
function renderPage(viewStore) {
  switch (viewStore.page) {
    case "books":
      return <Books />;
    case "cart":
      return <Cart />;
    case "book":
      return <BookDetail book={viewStore.selectBook} />;
    default:
      return <NotFound />;
  }
}

const AppMenu = ({ children }) => <ul className="App-menu">{children}</ul>;

const AppMenuItem = ({ onClick, children }) => (
  <li>
    <a onClick={onClick}>{children}</a>
  </li>
);

export default ShopView;
