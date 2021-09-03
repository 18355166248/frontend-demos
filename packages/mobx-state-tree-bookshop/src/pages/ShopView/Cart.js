import React from "react";
import { inject, observer } from "mobx-react";
import "./Cart.css";

const Cart = inject("shop")(
  observer(({ shop: { cart } }) => {
    return (
      <div>
        <h1>购物车</h1>
        <section className="Page-cart-items">
          {cart.list.map((cart) => (
            <CartEntry key={cart.book.id} cart={cart} />
          ))}
        </section>
        <p>总金额: {cart.subTotal}</p>
        {cart.hasDiscount && <p>优惠金额: {cart.discount}</p>}
        <h2>结算价: {cart.total}</h2>
        <button
          disabled={!cart.canCheckout}
          onClick={() => {
            cart.submitOrder();
          }}
        >
          下单
        </button>
      </div>
    );
  })
);

const CartEntry = inject("shop")(
  observer(({ cart, shop }) => (
    <div className="Page-cart-item">
      <p>
        <a
          href={`/book/${cart.book.id}`}
          onClick={onEntryClick.bind(cart, shop)}
        >
          {cart.book.name}
        </a>
        <button onClick={() => cart.remove()}>删除</button>
      </p>

      {!cart.book.isAvailable && (
        <p>
          <b>不可用</b>
        </p>
      )}

      <div className="Page-cart-item-details">
        <p>
          <span className="mr-5">数量:</span>
          <input
            value={cart.quantity}
            onChange={updateEntryQuantity.bind(null, cart)}
          />
          <span className="ml-5">
            <span className="mr-5">总额:</span>
            <b>{cart.price} 元</b>
          </span>
        </p>
      </div>
    </div>
  ))
);

function onEntryClick(shop, e) {
  shop.view.openBookPage(this.book);
  e.preventDefault();
  return false;
}

function updateEntryQuantity(cart, e) {
  e.target.value !== "" && cart.changeQuantity(Number(e.target.value));
}

export default Cart;
