import { types, getParent, flow } from "mobx-state-tree";
import { values } from "mobx";

export const Book = types.model("Book", {
  id: types.identifier,
  name: types.string,
  author: types.string,
  price: types.number,
  isAvailable: true,
  series_t: types.optional(types.string, ""),
  sequence_i: types.number,
  genre_s: types.string,
  pages_i: types.number,
});

export const BookStore = types
  .model("BookStore", {
    isLoading: true,
    books: types.map(Book),
  })
  .views((self) => ({
    get shop() {
      return getParent(self);
    },
    get sortedAvailableBooks() {
      return sortBooks(values(self.books));
    },
  }))
  .actions((self) => {
    function toogleLoading(loading) {
      self.isLoading = loading;
    }

    function updateBooks(json) {
      values(self.books).forEach((book) => (book.isAvailable = false));

      json.forEach((bookJson) => {
        self.books.put(bookJson);
        self.books.get(bookJson.id).isAvailable = true;
      });
    }

    const getBooks = flow(function* () {
      try {
        const json = yield self.shop.fetch("/books.json");
        console.log(json);
        updateBooks(json);
        toogleLoading(false);
      } catch (error) {
        console.log("加载书籍错误, ", error);
      }
    });

    return {
      getBooks,
    };
  });

function sortBooks(books) {
  return books
    .filter((book) => book.isAvailable)
    .sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? 0 : -1));
}
