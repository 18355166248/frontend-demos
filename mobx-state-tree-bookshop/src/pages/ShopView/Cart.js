import React from "react";
import { inject, observer } from "mobx-react";
import "./Cart.css";

const Cart = inject("shop")(
  observer(({ shop: { cart } }) => {
    return (
      <div>
        <h1>购物车</h1>
        <section className="Page-cart-items"></section>
      </div>
    );
  })
);

export default Cart;
