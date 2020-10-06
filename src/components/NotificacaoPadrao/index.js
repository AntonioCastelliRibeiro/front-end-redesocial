import React from 'react';
import './styles.scss';
import Toast from 'react-bootstrap/Toast';
import {CSSTransition,TransitionGroup} from 'react-transition-group';

class NotificacaoPadrao extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onClose: false
    }
  }

  onClose(e){
    // this.setState({onClose: true})
    this.props.onFecharAlerta(e.currentTarget.id)
  }

  // componentWillUpdate(){
  //   this.setState({onClose: true})
  // }

  retornarNotificacao(aData,aNum){
    return (
      <CSSTransition
        key={aNum}
        // timeout={200}
        classNames="not"
      >
        <div className={(this.state.onClose)?("div-notificacao-close"):("div-notificacao")} >
          <Toast 
            key={aNum}
            id={aNum}
            onClick={(e)=>this.onClose(e)}>
            <Toast.Header >
              <strong className="mr-auto">{aData.nameNotification}</strong>
              <small>Há {aData.sec} seg</small>
            </Toast.Header>
            <Toast.Body>{aData.message}</Toast.Body>
          </Toast>
        </div>
      </CSSTransition>
    )
  }

  retornarListaNotificacao(){
    // if (this.props.listaNotificacao && this.props.listaNotificacao.length === 0) {return false}
    // else {
      return (
        <TransitionGroup className="todo-list">
        {this.props.listaNotificacao.map((aData, aNum)=>this.retornarNotificacao(aData,aNum))}
        </TransitionGroup>
      )
    // }
  }
  
  render(){
    return(
      this.retornarListaNotificacao()
      // <div 
      //   style={{
      //     position: 'fixed',
      //     top: 60,
      //     right: 6,
      //     opacity: 90,
      //   }}
      // >
        // <Toast 
        //   onClose={this.props.onFecharAlerta}>
        //   <Toast.Header >
        //     <strong className="mr-auto">{this.props.nameNotification}</strong>
        //     <small>Há {this.props.sec} seg</small>
        //   </Toast.Header>
        //   <Toast.Body>{this.props.message}</Toast.Body>
        // </Toast>
      // </div>
    )    
  }
}

export default NotificacaoPadrao;
