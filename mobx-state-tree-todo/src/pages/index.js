import React from 'react'
import Header from './Header'
import MainSection from './MainSection'

const App = ({ store }) => (
  <div>
    <Header addTodo={store.addTodo}></Header>
    <MainSection store={store}></MainSection>
  </div>
)

export default App
