import React from 'react'
import TodoTextInput from './TodoTextInput'

function Header({ addTodo }) {
  function handleSave(text) {
    console.log(text)
    addTodo(text)
  }
  return (
    <header className="header">
      <h1>Todos</h1>
      <TodoTextInput
        newTodo
        onSave={handleSave}
        placeholder="What needs to be done?"
      />
    </header>
  )
}

export default Header
