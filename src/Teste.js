import React from 'react';

  class LoginControl extends React.Component {
    constructor(props){
      super(props);
      this.handleLoginClick = this.handleLoginClick.bind(this);
      this.handleLogountClick = this.handleLogountClick.bind(this);

      this.state = {isLoggedIn: false}
    }

    handleLoginClick(){
      this.setState({
        isLoggedIn: true
      })
    }

    handleLogountClick(){
      this.setState({
        isLoggedIn: false
      })
    }

    render(){
      const isLoggedIn = this.state.isLoggedIn;
      let button;
      if (isLoggedIn){
        button = <LogoutButton onClick={this.handleLogountClick} />;
      } else {
        button = <LoginButton onClick={this.handleLoginClick} />;
      }


      return (
        <div>
        
          {button}
        </div>
      );
    }

  }
  function LoginButton(props) {
    return (
      <button onClick={props.onClick}>
        Login
      </button>
    );
  }
  
  function LogoutButton(props) {
    return (
      <button onClick={props.onClick}>
        Logout
      </button>
    );
  }
  export default LoginControl;


/*
  class Teste extends React.Component{

    constructor(props){
      super(props);
        this.state = {date: new Date()};
      }
      
      componentDidMount(){
        this.timerID = setInterval(()=>this.tick(), 1000);
      }

      componentWillUnmount(){ // quando o componente nao é montado, nao continua a executar
        clearInterval(this.timerID);
      }

      tick() {
        this.setState({
          date: new Date()
        });
      }
      render(){
        return ( 
          <div> 
            <h1>teste seu: {this.state.date.toLocaleTimeString()}</h1> 
          </div>
          );
      }      
    }*/

//export default Teste;