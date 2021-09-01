import React from "react";
import { inject, observer } from "mobx-react";

const Books = inject("shop")(
  observer(({ shop }) => {
    return (
      <div>
        <h1>可用书籍</h1>
        <ol className="Books">
          {shop.sortedAvailableBooks.map((book) => (
            <BookEntry book={book} key={book.id} />
          ))}
        </ol>
      </div>
    );
  })
);

const BookEntry = inject("shop")(
  observer(({ book, shop: { view } }) => (
    <li>
      <a
        onClick={(e) => {
          e.preventDefault();
          console.log(view, book.id);
          view.openBookPageById(book.id);
        }}
      >
        {book.name}
      </a>
    </li>
  ))
);

export default Books;
