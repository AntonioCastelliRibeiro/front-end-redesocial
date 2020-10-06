import React from 'react';
import './styles.scss';

import SpinnerPadrao from '../Spinner';

import Card from 'react-bootstrap/Card';
import AcordeaoPin from '../AcordeaoPin';

class ListaPin extends React.Component {

  componentDidMount(){
    this.carregarAtualizarListaPin();
  } 

  carregarAtualizarListaPin(){
    if (this.props.listaPin.length === 0) {
      this.props.carregarListaPin();
    } else {
      this.props.atualizarNotListaPin();
    }
  }

  retornarConteudo(){
    const lvSpinner = this.props.spinner;
    const lvListaPin = this.props.listaPin;
    if  (lvSpinner) {
      return ( < SpinnerPadrao  span="5" offset="5" /> )
    } 
    else if (this.props.alerta){
      return (
        <Card border="dark" as="li"  style={{ margin: 1 }}>
            <a className="linkPin" href={this.props.mensagem} onClick={(e)=>(e.preventDefault())} >
            <Card.Header>
                  {this.props.alerta.mensagem}
             </Card.Header>
             </a>
        </Card> 
      )
    }
    else {
      return ( 
        <ul className="ul-pin">
          {lvListaPin.map((aData, aCount)=>
            <AcordeaoPin 
              key={aData.id}
              count={aCount}
              socket={this.props.socket}
              data={aData} 
              onClickPergunta={(e)=>this.props.onClickPergunta(e)}
              verificarMensagemLista={(e)=>this.props.verificarMensagemLista(e)} />)
          } 
        </ul>
      )
    }
  }

  render() {
    return  (
      this.retornarConteudo()
    )
  }
}
export default ListaPin;
