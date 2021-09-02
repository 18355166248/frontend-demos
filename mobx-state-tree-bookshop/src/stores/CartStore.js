import { reaction, when } from "mobx";
import {
  applySnapshot,
  getParent,
  getSnapshot,
  types,
  destroy,
} from "mobx-state-tree";
import { Book } from "./BookStore";

const CartEntry = types
  .model("CartEntry", {
    quantity: 0,
    book: types.reference(Book),
  })
  .views((self) => ({
    get price() {
      return self.book.price * self.quantity;
    },
    get isAvailable() {
      return self.book.isAvailable;
    },
  }))
  .actions((self) => ({
    increaseQuantity(number) {
      self.quantity += number;
    },
    changeQuantity(number) {
      self.quantity = number;
    },
    remove() {
      getParent(self, 2).remove(self);
    },
  }));

export const CartStore = types
  .model("CartStore", {
    list: types.array(CartEntry),
  })
  .views((self) => ({
    get shop() {
      return getParent(self);
    },
    // 原价
    get subTotal() {
      return self.list.reduce((sum, book) => (sum += book.price), 0);
    },
    // 是否有折扣
    get hasDiscount() {
      return self.subTotal > 100;
    },
    // 折扣
    get discount() {
      return self.subTotal * (self.hasDiscount ? 0.1 : 0);
    },
    // 折扣后总价
    get total() {
      return self.subTotal - self.discount;
    },
    // 是否可以提交
    get canCheckout() {
      return (
        self.list.length > 0 &&
        self.list.every((book) => book.quantity > 0 && book.isAvailable)
      );
    },
  }))
  .actions((self) => ({
    // list 数据变化 触发 afterAttach 生命周期
    afterAttach() {
      if (typeof window !== "undefined" && window.localStorage) {
        when(
          () => !self.shop.isLoading,
          () => {
            console.log("初始化完成");
            self.readCartFromStorage();

            reaction(
              () => getSnapshot(self),
              (json) => {
                localStorage.setItem("cart", JSON.stringify(json));
              }
            );
          }
        );
      }
    },
    addBook(book, quantity = 1, notify = true) {
      let entry = self.list.find((entry) => entry.book === book);
      if (!entry) {
        self.list.push({ book });
        entry = self.list[self.list.length - 1];
      }
      entry.increaseQuantity(quantity);
      if (notify) self.shop.alert(`添加 ${book.name} 到购物车`);
    },
    readCartFromStorage() {
      const json = window.localStorage.getItem("cart");
      json && applySnapshot(self, JSON.parse(json));
    },
    // 下单
    submitOrder() {
      self.shop.alert(`下单金额${self.total}!`);
      self.clear();
    },
    clear() {
      self.list.clear();
    },
    remove(book) {
      destroy(book);
    },
  }));
