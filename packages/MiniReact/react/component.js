import { renderComponent } from '../react-dom'

class Component {
  constructor(props = {}) {
    this.props = props
    this.state = {}
  }
  setState (stateChange) {
    this.state = Object.assign(this.state, stateChange)

    // 渲染组件
    renderComponent(this)
  }
}

export default Component
