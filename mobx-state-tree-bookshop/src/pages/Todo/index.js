import React, { Component } from "react";
import { observer } from "mobx-react";

const TodoView = observer(({ todo }) => (
  <li>
    <input
      type="checkbox"
      checked={todo.finished}
      onChange={(value) => {
        // console.log("onchange", value);
      }}
      onClick={() => (todo.finished = !todo.finished)}
    />
    {todo.name}
  </li>
));

class Todo extends Component {
  add = () => {
    this.props.todoList.add();
  };

  render() {
    return (
      <div>
        <div>
          <button onClick={this.add}>添加</button>
        </div>
        <ul>
          {this.props.todoList.todos.map((todo) => (
            <TodoView todo={todo} key={todo.name} />
          ))}
        </ul>
        Tasks left: {this.props.todoList.unfinishedTodoCount}
      </div>
    );
  }
}

export default observer(Todo);
