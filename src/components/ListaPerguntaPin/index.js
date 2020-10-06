import React from 'react';
import SpinnerPadrao from '../Spinner';
import Card from 'react-bootstrap/Card';
import AcordeaoPin from '../AcordeaoPin';
import AcordeaoPergunta from '../AcordeaoPergunta';

export default class ListaPerguntaPin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      targId: 0,
      onClickPin: false,
    }

  }

  componentDidMount(){
    console.log('montou');
    this.props.carregarListaPergunta();
  } 

  componentWillUnmount(){
    this.props.socket.off('resposta.aluno.pin'); 
    // é necessario limpar o socket, caso contrario continuara a enviar requisiçoes no componente estourando memoria
  }

  componentDidUpdate(){
    this.props.socket.on('resposta.aluno.pin', (e)=>(this.props.verificarAtribuirListaPergunta(e)))
  }

  retornarAcordeaoPin(){
    return(
      <AcordeaoPin  
        onSetarEstadoPin={(e)=>(this.setState({ targId: e.currentTarget.id, onClickPin: true }))}
        onClickPergunta={(e)=>(this.props.onClickPergunta(this.state.targId))}
      />
    )
  }

  retornarCardAlerta(aMensagem){
    return(
      <Card border="dark" as="li"  style={{ margin: 1 }}>
        <a className="linkPin" href={aMensagem} onClick={(e)=>(e.preventDefault())} >
          <Card.Header>
              {aMensagem}
          </Card.Header>
        </a>
      </Card> 
    )
  }

    retornarConteudo(){
    const lvSpinner = this.props.spinner;
    const lvListaPergunta = (this.props.tabName === 'Resp') ? (this.props.listaPerguntaResp) : (this.props.listaPerguntaNResp);
    if  (lvSpinner) {return < SpinnerPadrao  span="5" offset="5" /> } 
    else if (this.props.alertar){ return this.retornarCardAlerta(this.props.mensagem) }
    else {
      //if (lvListaPergunta.length === 0) { return this.retornarCardAlerta("Nenhuma pergunta encontrada") }
      return ( 
      <AcordeaoPergunta 
        tabName={this.props.tabName}
        listaPergunta={lvListaPergunta}
        onClickRespostaPergunta={(e)=>this.props.onClickRespostaPergunta(e)}
      /> )      
    }
  }

  render() {
    return  (
      this.retornarConteudo()
    )
  }
}
