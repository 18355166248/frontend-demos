import React from "react";
import { store } from "../model/todo";
import Todo from "./Todo";

function App(params) {
  return (
    <div>
      <Todo todoList={store} />
    </div>
  );
}

export default App;
