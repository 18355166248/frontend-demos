import React from 'react'
import TodoItem from './TodoItem'
import { observer } from 'mobx-react-lite'
import Footer from './Footer'

function MainSection({ store }) {
  function renderToggleAll() {
    if (store.todos.length > 0) {
      return (
        <span>
          <input
            className="toggle-all"
            id="toggle-all"
            type="checkbox"
            checked={store.completedCount === store.todos.length}
            onChange={() => store.completeAll()}
          />
          <label htmlFor="toggle-all">反选</label>
        </span>
      )
    }
  }

  function renderFooter() {
    if (store.todos.length) {
      return <Footer store={store} />
    }
  }

  const { filterTodos } = store

  return (
    <section className="main">
      {renderToggleAll()}
      <ul className="todo-list">
        {filterTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      {renderFooter()}
    </section>
  )
}

export default observer(MainSection)
