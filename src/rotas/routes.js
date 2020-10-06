import React from 'react';
import App from '../App';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

class Routes extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        isAuthenticated: false
      }
      this.retornarPrivateRoute = this.retornarPrivateRoute.bind(this);
      this.alterarState = this.alterarState.bind(this);
    }

    alterarState(e){
      this.setState({isAuthenticated: e});
      console.log('state' + this.state.isAuthenticated);
    }

    retornarPrivateRoute(e){
      if (this.state.isAuthenticated) {
      console.log('func' + this.state.isAuthenticated);
        return (
          <App path="/app" props={(e)=>(this.alterarState(e))} />
        ) 
      } else {
        return (
          <Redirect to={{ pathname: '/'}} /> 
        )
      }
    }

  render(){
    return (
      <BrowserRouter>
        <Switch> 
          <Route exact path="/" component={()=>(<App props={(e)=>(this.alterarState(e))} />)} />
          {this.retornarPrivateRoute()}
          
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Routes;
