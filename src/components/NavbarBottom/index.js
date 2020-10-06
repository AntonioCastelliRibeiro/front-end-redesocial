import React from 'react';
import './styles.scss';

import {Navbar, Nav } from 'react-bootstrap';
import BotaoImg from '../BotaoImg';

import pinbottomimg from '../../image/pin/pinbottom.svg';
import novaperguntaimg from '../../image/navbottom/novapergunta.svg';
import todasperguntasimg from '../../image/navbottom/todasperguntas.svg';
import perguntarespondidaimg from '../../image/navbottom/perguntarespondida.svg';
import perguntanaorespondidaimg from '../../image/navbottom/perguntanaorespondida.svg';


class NavbarBottom extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      /*img*/
      pinbottom: pinbottomimg,
      novapergunta: novaperguntaimg,
      todasperguntas: todasperguntasimg,
      perguntarespondida: perguntarespondidaimg,
      perguntanaorespondida: perguntanaorespondidaimg,

      onClickTodas: true, 
      onClickNResp: false, 
      onClickResp: false,
      onClickAula: false
    }
  }

  retornarNovaPerguntaAluno(){
    if (this.props.isAluno){
      return (
        <BotaoImg 
          dica="Nova Pergunta"
          imagem={this.state.novapergunta}
          hoverBottom={true}
          stateExterno="true"
          state={this.props.modalPerguntar}
          onClick={()=>this.props.setarEstadoNovaPergunta()}
        />
      )
    }
  }

  retornarBotaoAula(){
    if (this.props.isProfessor){
      return (
        <BotaoImg 
          dica="Aula"
          imagem={this.state.pinbottom}
          stateExterno="true"
          state={this.state.onClickAula}
          hoverBottom={true}
          onClick={(e)=>this.props.onClickPin()}
        />
      )
    }
  }

  setarEstadoOnClick(e, aNome){
    this.props.setarFiltroNavBottom(aNome);
    if (aNome ==='T'){ this.setState({onClickTodas: true, onClickNResp: false, onClickResp: false, onClickAula: false})
    } else if(aNome === 'R' ){this.setState({onClickTodas: false, onClickNResp: false, onClickResp: true, onClickAula: false})
    } else if(aNome === 'N' ){ this.setState({onClickTodas: false, onClickNResp: true, onClickResp: false, onClickAula: false})
    } else if(aNome === 'A' ){ this.setState({onClickAula: true})}
  }

  retornarNavImage(){
    return(
      <Navbar 
        style={{ height: 70 }}
        className="d-flex justify-content-center"
        ref={(field) => {this.navBarToggle = field}}
        collapseOnSelect
        bg="dark"
        variant="dark"
        fixed="bottom"
      >
        <BotaoImg 
          dica="Todas as Perguntas"
          imagem={this.state.todasperguntas}
          stateExterno="true"
          state={this.state.onClickTodas}
          hoverBottom={true}
          onClick={(e)=>this.setarEstadoOnClick(e,'T')}
        />
        <BotaoImg 
          dica="Não Respondidas"
          imagem={this.state.perguntanaorespondida}
          stateExterno="true"
          state={this.state.onClickNResp}
          hoverBottom={true}
          onClick={(e)=>this.setarEstadoOnClick(e, 'N')}
        />
        <BotaoImg 
          dica="Respondidas"
          imagem={this.state.perguntarespondida}
          stateExterno="true"
          state={this.state.onClickResp}
          hoverBottom={true}
          onClick={(e)=>this.setarEstadoOnClick(e, 'R')}
        />
        {this.retornarBotaoAula()}
        <Nav>
          {this.retornarNovaPerguntaAluno()}
        </Nav>
      </Navbar>
    )
  }

  render() {
    return this.retornarNavImage()
  }
}

export default NavbarBottom;