import React from 'react';
import './styles.scss';

import NavBar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavItemPadrao from '../NavItemPadrao';
import BotaoImg from '../BotaoImg';
import sair from '../../image/sair/sair.svg';
import configuracao from '../../image/configuracao/configuracao.svg';
import pin from '../../image/pin/pin.svg';
import info from '../../image/info/info.svg';
import logohover from '../../image/logo/logohover.svg';

import NotificacaoPadrao from '../NotificacaoPadrao';

class NavBarLogged extends React.Component {  
  constructor(props){
    super(props);
    this.state={
      navProfessor: true,
      onHoverLogo: false
    }
    
    this.onClickNavLinkAluno = this.onClickNavLinkAluno.bind(this);
    this.trocarFormulario = this.trocarFormulario.bind(this);

  }

  ajustarDescricaoNavLink(){
    return (this.props.isProfessor && !this.props.isEntrar)?('Entrar'):('Cadastrar');
  }

  /*Login */
  onClickNavLinkProfessor(e){
    // this.RefEntrar.disabled = true;
    this.setState({navProfessor: true});
    this.props.onChangeNavLinkProfessor();
  }

  onClickNavLinkAluno(e){
    // this.RefEntrar.disabled = false;
    this.setState({navProfessor: false});
    this.props.onChangeNavLinkAluno();
  }

/* Logado */ 
  trocarFormulario(e){
    e.preventDefault();
    this.props.onChangeLogin(); 
  }

  retornarNotificacaoItem(){
    if (this.props.alertaConfig){
      return (
        <NotificacaoPadrao 
          nameNotification="Notificação"
          message="Suas configurações foram salvas"
          sec="2"
          onFecharAlerta={(e)=>(this.setState({alertaConfig: false}))}/>
      )
    }
    if (this.props.alertaPerguntaAluno){
      return (
        <NotificacaoPadrao 
          nameNotification="Notificação"
          message="Pergunta realizada com sucesso"
          sec="2"
          onFecharAlerta={(e)=>(this.setState({alertaPerguntaAluno: false}))}/>
      )
    }
  }

  retornarNotificacaoPadrao(){
    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'ablsolute',
          minHeight: '200px',
        }}
      >
        <div
            style={{
            position: 'fixed',
            top: 65,
            right: 10,
          }}
        >
          {this.retornarNotificacaoItem()}
        </div>
      </div>
    )
  }

  navContent(){
    const lvLogged = this.props.isLogged;
    const lvLogin = this.props.isLogin;
    const lvProfessor = this.props.isProfessor;
    const lvAluno = this.props.isAluno;
    if (lvLogged && lvProfessor) {
      return (
        <>
          <Nav  className="mr-auto" defaultActiveKey="#nl-1">
            <BotaoImg 
              dica="Pin"
              imagem={pin}
              posicao="bottom"
              stateExterno="true"
              state={this.props.modalPin}
              hoverBottom={false}
              onClick={(e)=>this.props.onClickModalPin()}
            />
            {/* <NavItemPadrao 
              nav="false"
              name="Pin"
              eventKey="#nl-2"
              href="Pin"
              onClick={this.props.onClickModalPin}
            /> */}
          </Nav>
          <BotaoImg 
              dica="Configurações"
              posicao="bottom"
              imagem={configuracao}
              stateExterno="true"
              state={this.props.modalConfig}
              hoverBottom={false}
              onClick={()=>this.props.onClickModalConfig()}
            />
            <BotaoImg 
              dica="Sair"
              posicao="bottom"
              imagem={sair}
              stateExterno="true"
              state={this.props.modalSair}
              hoverBottom={false}
              onClick={()=>this.props.onSair()}
            />
        </>
      )
    }else if (lvAluno && lvLogged){
      return (
        <>
          <Nav  className="mr-auto">
            <BotaoImg 
              dica="Aula"
              imagem={info}
              posicao="bottom"
              stateExterno="true"
              state={this.props.modalAula}
              hoverBottom={false}
              onClick={(e)=>this.props.onClickModalAula()}
            />
          </Nav>
          <BotaoImg 
            dica="Sair"
            posicao="bottom"
            imagem={sair}
            stateExterno="true"
            state={this.props.modalSair}
            hoverBottom={false}
            onClick={()=>this.props.onSair()}
          />
        </>
      )
    } else if (lvLogin){
      return (
      <>
        <Nav className="mr-auto" defaultActiveKey="#nl-1">
          <NavItemPadrao 
            nav="false"
            name={(this.state.navProfessor)?("Aluno"):("Professor")}
            eventKey="#nl-1"
            href={(this.state.navProfessor)?("Aluno"):("Professor")}
            onClick={()=>(!this.state.navProfessor)?(this.onClickNavLinkProfessor()):(this.onClickNavLinkAluno())}
          /> 
          {/* <NavItemPadrao 
            nav="false"
            name="Aluno"
            eventKey="#nl-2"
            href="Aluno"
            onClick={this.onClickNavLinkAluno}
          />           */}
        </Nav>
        {this.retornarNavCad()}
      </>      
      );
    }
  }

  retornarNavCad(){
    if (this.state.navProfessor){
    return (
      <Nav className="justigy-content-end" >
        <Nav.Item>
          <Nav.Link  
            id="nv-linkEntrar"
            href="#nl-3"
            ref={(field) => {this.RefEntrar = field}} 
            onClick={this.trocarFormulario} >
              {this.ajustarDescricaoNavLink()}
          </Nav.Link>
        </Nav.Item>
      </Nav>
    )
  }
  }
  
  navBarLogged(){
      return (
        <>
          <NavBar.Toggle/>
          <NavBar.Collapse >
          {this.navContent()}
          </NavBar.Collapse>
        </>
      )
  }

  render() {
    return (
      <>
        <NavBar 
          className="navTop"
          style={{ zIndex: 999997 }}
          ref={(field) => {this.navBarToggle = field}}
          // collapseOnSelect
          // expand="lg"
          bg="dark"
          variant="dark">
          <NavBar.Brand 
            onMouseOver={()=>this.setState({onHoverLogo: true})}
            onMouseOut={()=>this.setState({onHoverLogo: false})}
            className="nav-brand-logo" href="/"
          >
            <img
                // src="https://react-bootstrap.github.io/logo.svg"


                // src={(this.state.onHoverLogo)?(logohover):(logo)}
                src={logohover}
                className="d-inline-block align-top img-logo"
                alt=""   
            /> { '  ' }  <span className="span-logo">Pergunta aí</span>
            </NavBar.Brand>
            {this.navContent()}
            {/* {this.navBarLogged()} */}
        </NavBar> 
      </>
    )
  }

}
export default NavBarLogged;