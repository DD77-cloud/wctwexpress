import React, {Component} from 'react'
import Routes from './routes'
import {Navbar} from './components'
class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Routes />
      </div>
    )
  }
}

export default App
