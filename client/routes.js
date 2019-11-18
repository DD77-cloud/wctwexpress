import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {AuthForm, GetSegments} from './components'

class Routes extends Component {
  componentDidMount() {}

  render() {
    return (
      <Switch>
        <Route path="/getallsegments" component={GetSegments} />
        <Route path="/" component={AuthForm} />
      </Switch>
    )
  }
}

export default withRouter(Routes)
