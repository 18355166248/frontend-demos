import React from 'react'
import { render } from 'react-dom'
import { getSnapshot, destroy, onSnapshot } from 'mobx-state-tree'
import 'todomvc-app-css/index.css'
import { connectReduxDevtools } from 'mst-middlewares'

import App from './pages'
import TodoStore from './models/todos'

const localStorageKey = 'mst-todomvc-example'

const initialState = localStorage.getItem(localStorageKey)
  ? JSON.parse(localStorage.getItem(localStorageKey))
  : {
      todos: [
        {
          text: 'Megalo',
          completed: false,
          id: 0,
        },
      ],
    }

let store
let snapshotListenerDestroyer

function createTodoStore(snapshot) {
  // clean up snapshot listener 清理快照监听
  if (snapshotListenerDestroyer) snapshotListenerDestroyer()
  // kill old store to prevent accidental use and run clean up hooks 杀死旧数据以防止意外使用，并运行清理Hook
  if (store) destroy(store)

  // 新建
  window.store = store = TodoStore.create(snapshot)

  // connect devtools
  connectReduxDevtools(require('remotedev'), store)
  // connect local storage
  snapshotListenerDestroyer = onSnapshot(store, (snapshot) =>
    localStorage.setItem(localStorageKey, JSON.stringify(snapshot))
  )

  return store
}

function renderApp(App, store) {
  render(<App store={store} />, document.getElementById('root'))
}

// 初始化
renderApp(App, createTodoStore(initialState))

// Connect HMR
if (module.hot) {
  module.hot.accept(['./models/todos'], () => {
    // Store definition changed, recreate a new one from old state
    renderApp(App, createTodoStore(getSnapshot(store)))
  })

  module.hot.accept(['./pages'], () => {
    // Componenent definition changed, re-render app
    renderApp(App, store)
  })
}
