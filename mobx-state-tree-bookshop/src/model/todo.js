import { makeAutoObservable } from "mobx";

class TodoList {
  todos = [];

  constructor() {
    makeAutoObservable(this);
  }

  add() {
    this.todos.push({
      name: Math.random() * 1000 + Date.now(),
      finished: false,
    });
  }

  get unfinishedTodoCount() {
    return this.todos.length;
  }
}

export const store = new TodoList();
