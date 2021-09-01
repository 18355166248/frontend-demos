import { types } from "mobx-state-tree";

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
  }));
