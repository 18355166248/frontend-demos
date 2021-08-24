import React from "react";
import Todo from "./Todo";
import { ConfigContext } from "../index.context";
import { store } from "../model/todo";

function App() {
  return (
    <ConfigContext.Provider value={store}>
      <Todo />
    </ConfigContext.Provider>
  );
}

export default App;
