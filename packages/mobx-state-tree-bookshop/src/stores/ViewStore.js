import { getParent, types } from "mobx-state-tree";
import { values } from "mobx";

export const ViewStore = types
  .model("ViewStore", {
    page: "books",
    selectBookId: "",
  })
  .views((self) => ({
    get currentUrl() {
      switch (self.page) {
        case "books":
          return "/";
        case "book":
          return "/book/" + self.selectBookId;
        case "cart":
          return "/cart";
        default:
          return "/404";
      }
    },
    get selectBook() {
      const books = values(getParent(self).bookStore.books);
      const book = books.find((book) => book.id === self.selectBookId);
      return book;
    },
  }))
  .actions((self) => ({
    openBooksPage() {
      self.page = "books";
    },
    openCartPage() {
      self.page = "cart";
    },
    openBookPageById(id) {
      self.page = "book";
      self.selectBookId = id;
    },
    openBookPage(book) {
      self.page = "book";
      self.selectBookId = book.id;
    },
  }));
