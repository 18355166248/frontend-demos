import React, { Component } from "./react";
import ReactDom from "./react-dom";

const Home = ({ name }) => {
  return (
    <div className="active" title="测试" style={{ width: 20 }}>
      hello, <span>React -- {name}</span>
    </div>
  )
}

class Home1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 1
    }
  }

  componentWillMount () {
    console.log('组件将要加载')
  }
  componentWillReceiveProps (props) {
    console.log('props', props)
  }
  componentWillUpdate () {
    console.log('组件将要更新')
  }
  componentDidUpdate () {
    console.log('组件更新完成')
  }
  componentDidMount () {
    console.log('组件加载完成')
  }

  click () {
    this.setState({
      num: this.state.num + 1
    })
  }

  render () {
    console.log(this.props)
    const { name, name1 } = this.props
    const { num } = this.state
    console.log('num', num)
    return (
      <div className="active" title="测试" style={{ width: 20 }}>
        hello, <span>React -- {name}</span>
        <span>{name1}</span>
        <div>{num}</div>
        <button style={{ width: 100 }} onClick={this.click.bind(this)}>点我</button>
      </div>
    )
  }
}

const ele = (
  <div className='active' title='123'>
    hello,<span>react</span>
  </div>
)

// ReactDom.render(ele, document.getElementById("root"));
ReactDom.render(<Home1 name="11" />, document.getElementById("root"));


// const App = (
//   <div className="active" title="测试" style={{ width: 20 }}>
//     hello, <span>React</span>
//   </div>
// );
