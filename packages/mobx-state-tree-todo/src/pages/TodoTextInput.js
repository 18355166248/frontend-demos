import classNames from 'classnames'
import React, { useState } from 'react'

function TodoTextInput({ text, onSave, newTodo, placeholder, editing }) {
  const [editingText, setEditingText] = useState(text)

  const handleSubmit = (e) => {
    const text = e.target.value.trim()
    if (e.key === 'Enter') {
      onSave(text)
      if (newTodo) {
        setEditingText('')
      }
    }
  }

  const handleChange = (e) => {
    setEditingText(e.target.value)
  }

  const handleBlur = (e) => {
    if (!newTodo) {
      onSave(e.target.value)
    }
  }

  return (
    <input
      type="text"
      className={classNames({
        edit: editing,
        'new-todo': newTodo,
      })}
      placeholder={placeholder}
      autoFocus={true}
      value={editingText}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleSubmit}
    />
  )
}

export default TodoTextInput
