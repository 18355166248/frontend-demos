import React from "react";
import { inject, observer } from "mobx-react";

const BookDetail = inject("shop")(
  observer(({ book, shop: { cart } }) => (
    <div>
      <h2>{book.name}</h2>
      <p>
        <i>By: {book.author}</i>
      </p>
      <p>类型: {book.genre_s}</p>
      <div>{book.series_t}</div>
      <p>章数: {book.pages_i}章</p>
      <p>价格: {book.price}元</p>
      <button
        onClick={() => {
          cart.addBook(book);
        }}
      >
        加入购物车
      </button>
    </div>
  ))
);

export default BookDetail;
