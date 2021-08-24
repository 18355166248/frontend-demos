import React from "react";
import { observer } from "mobx-react-lite";
import { useConfigContext } from "../../index.context";

const TodoView = observer(({ todo }) => (
  <li>
    <input
      type="checkbox"
      checked={todo.finished}
      onClick={() => (todo.finished = !todo.finished)}
    />

    {todo.name}

    <span style={{ marginLeft: "20px" }}>
      选中状态: {todo.finished ? "选中" : "未选中"}
    </span>
  </li>
));

function Todo() {
  const configContext = useConfigContext();

  return (
    <div>
      <div>
        <button onClick={configContext.add}>添加</button>
      </div>
      <ul>
        {configContext.todos.map((todo) => (
          <TodoView todo={todo} key={todo.name} />
        ))}
      </ul>
      Tasks left: {configContext.unfinishedTodoCount}
    </div>
  );
}

export default observer(Todo);
