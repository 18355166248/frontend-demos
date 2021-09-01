import { types, getEnv } from "mobx-state-tree";
import { BookStore } from "./BookStore";
import { ViewStore } from "./ViewStore";

export const ShopStore = types
  .model("ShopStore", {
    bookStore: types.optional(BookStore, {
      books: {},
    }),
    view: types.optional(ViewStore, {}),
  })
  .views((self) => ({
    get fetch() {
      return getEnv(self).fetch;
    },
    get isLoading() {
      return self.bookStore.isLoading;
    },
    get books() {
      return self.bookStore.books;
    },
    get sortedAvailableBooks() {
      return self.bookStore.sortedAvailableBooks;
    },
  }))
  .actions((self) => ({
    afterCreate() {
      console.log("afterCreate");
      self.bookStore.getBooks();
    },
    beforeDestroy() {
      console.log("beforeDestroy");
    },
  }));
