import React from 'react';
import api from './services/api';
import connection from './services/connection';
import './styles.scss';

import './global.css';
import './App.css';import './Sidebar.css';
import './Main.css';

/* Componentes*/
import ImageNovaPergunta from './components/ImageNovaPergunta';
import FormCadastroLogin from './components/FormCadastroLogin';

//import ListaPerguntaHome from './components/ListaPerguntaHome';
import ListaPerguntaHomeAcordeao from './components/ListaPerguntaHomeAcordeao';


import ModalAula from './components/ModalAula';
import ModalSair from './components/ModalSair';    
import ModalConfigProfessor from './components/ModalConfigProfessor';
import ModalNovoPin from './components/ModalNovoPin';
import ModalPerguntar from './components/ModalPerguntar';
import ModalPinList from './components/ModalPinList';

//import SocketTeste from './components/SocketTeste';

import NotificacaoPadrao from './components/NotificacaoPadrao';
import NavBarLogged from './components/NavBarLogged';
import NavbarBottom from './components/NavbarBottom';

import Contador from './components/Contador';

import TokenObj from './class/Token';

import io from 'socket.io-client';

const socket = io(connection);


//const socket = io('http://25.105.184.74:3333');

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLogin: false,
      isProfessor: false,
      spinnerLogin: true,
      
      isEntrar: false,
      isLogged: false, 
      isAluno: false,

      data: '',

      id: '',
      cd_pin: '',
      nm_usuario: '',
      ds_email: '',
      ds_senha: '',
      ds_senhaRepeat: '',
      ds_conteudo: '',
      ds_instituicao: '',
      ds_materia: '',
      nm_professor: '',
      cd_professor: '',
      st_pin:  '',

      /* Alerta Comp */
      alertaPerguntaAluno: false,

      /* Modal */
      modalAula: false,
      modalSair: false,
      modalConfig: false,
      modalPin: false,
      onAtualizarListaPin: '',
      modalPerguntar: false,
      modalPinList: false,

      Token: new TokenObj(), 

      listaNotificacao: [],

      /*Alerta form cad*/
      alerta: {
        mensagem: '',
        alertar: false,
      },

      /* Filtro Nav Bottom */
      filtroNavBottom: 'T',
      cd_pinFiltro: '',

      /* backgroundcollornight */
      backgroundNight: false
    }

    this.setarMainInline = this.setarMainInline.bind(this);

    this.realizarLoginUsuario =  this.realizarLoginUsuario.bind(this);
    this.carregarDadosUsuario = this.carregarDadosUsuario.bind(this);

    this.onSubmitModalConfig = this.onSubmitModalConfig.bind(this);
    this.onSair = this.onSair.bind(this);
    this.onSubmitAula = this.onSubmitAula.bind(this);

  }

  componentDidMount(){
    (this.state.Token.session.token !== null) ? (this.carregarDadosUsuario()) :
    (this.setState({ isProfessor: true, isAluno: false, isEntrar: true, isLogin: true, isLogged: false, spinnerLogin: false }));
  }

  componentDidUpdate(){
    // se n estiver logado ou for aluno e tentar setar algum link limpa
    if ((window.location.pathname.substring(1,20).length !== 0 && 
       ((!this.state.isLogged) ||  (this.state.isAluno)) )) {
      window.location.pathname = '';
    }
  }

  setarEstadoLogado(aData, aIsProfessor){
    this.setState({ 
      id: aData.id, 
      cd_pin: aData.cd_pin, 
      nm_usuario: aData.nm_usuario, 
      ds_conteudo: aData.ds_conteudo,
      ds_email: aData.ds_email,
      ds_instituicao: aData.ds_instituicao,
      ds_materia: aData.ds_materia,
      nm_professor: aData.nm_professor,
      cd_professor: aData.cd_professor,
      st_pin: aData.st_pin,
      spinnerLogin: false,
      isProfessor: aIsProfessor, 
      isAluno: (!aIsProfessor),
      isLogged: true, 
    });
  }

  limparEstadoSession(){
    console.log('Limpei')
    this.state.Token.limparSessionToken();
    this.setState({ spinnerLogin: false, isEntrar: true, isLogin: true, isLogged: false, isProfessor: true, isAluno: false})
  }

  async verificarOrigemTpUser(aToken){
    try {
      return await api.post('/token', { headers: { 'authorization': `Bearer ${ aToken }` }});
    } catch (error) {
      this.limparEstadoSession()
    }      
  }

  async setarDadosProfessor(aToken){
    const lvProfessorEmail = await api.get('/teacher', {
      headers: { 'authorization': `Bearer ${aToken}` }});
    (lvProfessorEmail.data.success) ? (this.setarEstadoLogado(lvProfessorEmail.data, true)) : (this.limparEstadoSession())
  }

  async setarDadosAluno(aToken){
    const lvAluno = await api.get('/alunoTodosRelac', {
      headers: { 'authorization': `Bearer ${aToken}` }});
    (lvAluno.data.success) ? (this.setarEstadoLogado(lvAluno.data.alunoPin, false)) : (this.limparEstadoSession())
  }

  async carregarDadosUsuario(){
    const lvToken = this.state.Token.session.token;
    const lvDataToken =  await this.verificarOrigemTpUser(lvToken);
    if (!this.state.Token.session.gerado) {return}
    if (!lvDataToken.data.success) { return this.limparEstadoSession() }
    if (lvDataToken.data.token.tp_user === 'P'){ await this.setarDadosProfessor(lvToken);
    } else if (lvDataToken.data.token.tp_user === 'A'){ await this.setarDadosAluno(lvToken);}
  }

  onSubmitModalConfig(aNmUsuario){
    this.setState({ alertaConfig: true, nm_usuario: aNmUsuario});
    this.adicionarNotificacaoPadrao({
      nameNotification: "Configuração", 
      message: "Suas configurações foram salvas",
      sec: "2"
    });
  }

  onFecharAlerta(aId){
    this.listaNotificacaoAux = this.state.listaNotificacao;
    this.listaNotificacaoAux.splice(aId,1); // remove pelo index da lista
    if (this.listaNotificacaoAux.length === 0) {this.setState({listaNotificacao: []})} // zera a lista caso seja o unico item a remov.
    else {this.setState({listaNotificacao: this.listaNotificacaoAux})}
  }

  retornarNotificacaoItem(){
    return (
      <NotificacaoPadrao 
        listaNotificacao={this.state.listaNotificacao}
        onFecharAlerta={(e)=>this.onFecharAlerta(e)}
      />
    )
  }

  adicionarNotificacaoPadrao(aNotificacao){
    this.setState({listaNotificacao: [aNotificacao, ...this.state.listaNotificacao]});
  }
  

  retornarNotificacaoPadrao(){
    if (this.state.listaNotificacao && this.state.listaNotificacao.length === 0) {return false}
    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          minHeight: '200px',
          zIndex: 999999
        }}
      >
        <div
            style={{
            position: 'fixed',
            top: 73,
            right: 20,
            // zIndex: 999999
          }}
        >
          {this.retornarNotificacaoItem()}
        </div>
      </div>
      )
  }

  onSair(){
    this.state.Token.limparSessionToken();
    this.setState({ isLogin: true, modalSair: false });
    window.location.reload();
  }

  retornarNav(){
    return (
      <NavBarLogged 
        api={api}
        token={this.state.Token}
        ref={this.navBarCollapseRef}
        name={this.state.nm_usuario} 
        email={this.state.ds_email}
        isLogged={this.state.isLogged}
        isLogin={this.state.isLogin}
        isProfessor={this.state.isProfessor}
        isAluno={this.state.isAluno}
        isEntrar={this.state.isEntrar}

        modalAula={this.state.modalAula}
        modalPin={this.state.modalPin}
        modalConfig={this.state.modalConfig}
        modalSair={this.state.modalSair}

        onChangeLogin={(e)=>(this.setState({ isEntrar: (!this.state.isEntrar && this.state.isProfessor) }))}
        onChangeNavLinkProfessor={(e)=>(this.setState({ isProfessor: true, isAluno: false }))}
        onChangeNavLinkAluno={(e)=>(this.setState({ isProfessor: false, isAluno: true }))}

        onClickModalAula={(e)=>(this.setState({ modalAula: true }))}
        onClickModalConfig={()=>(this.setState({ modalConfig: true }))}
        onClickModalPin={()=>(this.setState({ modalPin: true }))}
        onClickModalPerguntar={()=>(this.setState({ modalPerguntar: true }))}

        onSair={(e)=>(this.setState({ modalSair: true }))}

      />
    )
  }

  setarFiltroNavBottom(aItem){
    this.setState({filtroNavBottom: aItem})
    // socket.emit('filtro.nav.bottom', {
    //   item: aItem, 
    //   isProfessor: this.state.isProfessor, 
    //   cd_professor: this.state.cd_professor,
    //   isAluno: this.state.isAluno,
    //   cd_aluno: this.state.id
    // });
  }

  retornarForm(){
      if (this.state.isLogged){ 
        return (
          <ListaPerguntaHomeAcordeao
            pin={this.state.cd_pin}
            cd_professor={this.state.cd_professor}
            cd_aluno={this.state.id}
            isProfessor={this.state.isProfessor}
            isAluno={this.state.isAluno}
            socket={socket}
            logged={this.state.isLogged}
            api={api} 
            token={this.state.Token} 
            filtroNavBottom={this.state.filtroNavBottom}
            // setarFiltroNavBottom={this.setarFiltroNavBottom}
            onSetarMainInline={(e)=>this.setarMainInline(e)}
            cd_pinFiltro={this.state.cd_pinFiltro}
            onSetarNotificacao={(e)=>this.adicionarNotificacaoPadrao({ nameNotification: "Notificação", message: e, sec: "2" })} 
          />
          )
      } else if (this.state.isLogin) {
          return (
            <FormCadastroLogin 
              isEntrar={this.state.isEntrar}
              isProfessor={this.state.isProfessor}
              api={api}
              onSubmit={(aData, aIsProfessor)=>(this.realizarLoginUsuario(aData, aIsProfessor))}
            />
          )
      }
  }

  realizarLoginUsuario(aData, aIsProfessor){
    this.state.Token.gerarToken(true, aData.token, aIsProfessor);
    (aIsProfessor) ?
    (this.setState({ nm_usuario: aData.nm_usuario, cd_professor: aData.id, isLogged: true, isLogin: false })) :
    (this.setarEstadoLoginUsuarioAluno(aData.dadosAluno))
  }

  setarEstadoLoginUsuarioAluno(aData){
    this.setState({
      isLogged: true,
      isLogin: false,
      id: aData.id, 
      cd_pin: aData.cd_pin, 
      nm_usuario: aData.nm_usuario, 
      ds_conteudo: aData.ds_conteudo,
      ds_email: aData.ds_email,
      ds_instituicao: aData.ds_instituicao,
      ds_materia: aData.ds_materia,
      nm_professor: aData.nm_professor,
      cd_professor: aData.cd_professor,
      st_pin: aData.st_pin
    });
  }

  onSubmitAula(data){
    this.setState({ alertaPerguntaAluno: true });
    this.adicionarNotificacaoPadrao({
      nameNotification: "Notificação", 
      message: "Pergunta enviada com sucesso",
      sec: "2"
    });
    socket.emit('pergunta.aluno.modal', data
    /*{
      ALUNO: {
        nm_aluno: "teste"
      },
      ds_pergunta: "oh myyyy",
      id: 9999,
      st_anonimo: "N",
      st_pergunta: "A",       
      }*/
    )
  }

  setarFiltroModalPin(aTipo, AId){
    // this.setState({filtroNavBottom: aTipo, cd_pinFiltro: AId});
  }

  async onSubmitPergunta(e){
    const { ds_duvida, st_anonimo } = e;
    const cd_pin = this.state.cd_pin;
    const lvToken = this.state.Token.session.token;
    try {
      const lvPergunta = await api.post('/pergunta', {
        headers: {
          'authorization': `Bearer ${lvToken}`,
          cd_pin: cd_pin,    
          cd_professor: this.state.cd_professor,
          ds_duvida: ds_duvida,
          st_anonimo: st_anonimo
        },
      });
      // this.limparCamposDuvida();
      this.onSubmitAula(lvPergunta.data.pergunta);
      this.setState({modalPerguntar: false})
      // this.setarNovaPergunta(lvPergunta.data.pergunta);
    } catch (error) { 
      console.log(error);
    }   
  }

  retornarModal(){
    if (this.state.modalAula){
      return(
        <ModalAula
          cd_aluno={this.state.id}
          socket={socket}
          pin={this.state.cd_pin} 
          professor={this.state.nm_professor}
          cd_professor={this.state.cd_professor}
          conteudo={this.state.ds_conteudo}
          materia={this.state.ds_materia}
          mAula={this.state.modalAula}
          mPerguntar={this.state.modalPerguntar}
          api={api}
          token={this.state.Token.session.token}
          onClose={(e)=>(this.setState({ modalAula: false, modalPerguntar: false }))}
          onSubmitAula={this.onSubmitAula}
        />
      )
    }
    if (this.state.modalPerguntar){
      return(
        <ModalPerguntar 
          materia={this.state.ds_materia}
          onClose={()=>this.setState({modalPerguntar: false})}
          onSubmitPergunta={(e)=>this.onSubmitPergunta(e)}
        />
      )
    }
    if (this.state.modalSair){
      return(
        <ModalSair 
          onClick={this.onSair} 
          onCancel={(e)=>(this.setState({ modalSair: false }))}
        />
      )
    }
    if (this.state.modalConfig){
      return (
        <>
          <ModalConfigProfessor
            api={api} 
            token={this.state.Token.session.token}
            isProfessor={this.state.isProfessor}
            name={this.state.nm_usuario}
            onCloseModalConfig={(e)=>(this.setState({ modalConfig: false }))}
            onSubmitModalConfig={this.onSubmitModalConfig}/>
        </>
      )
    }
    if (this.state.modalPin) {
      return (
        <>
          <ModalNovoPin 
            api={api}
            socket={socket}
            cd_professor={this.state.cd_professor}
            token={this.state.Token.session.token}
            onClose={(e)=>(this.setState({ modalPin: false }))}
            onSetarNotificacao={(e)=>this.adicionarNotificacaoPadrao({ nameNotification: "Notificação", message: e, sec: "2" })}
            onAtualizarListaPin={(e)=>this.setState({onAtualizarListaPin: e})}
            onAdicionarNotificacao={()=>this.adicionarNotificacaoPadrao({ nameNotification: "Notificação", message: "Pin gerado com sucesso", sec: "2"})}
          />
        </>
      )
    }
    if (this.state.isProfessor) {
      return (
        <ModalPinList 
          api={api}
          socket={socket}
          cd_professor={this.state.cd_professor}
          token={this.state.Token.session.token}
          modal={this.state.modalPinList}
          onClose={(e)=>(this.setState({ modalPinList: false }))}
          onClickPin={(e, aId)=>this.setarFiltroModalPin(e, aId)}
          onAtualizarListaPin={this.state.onAtualizarListaPin}
          onAtualizarListaPinClear={()=>this.setState({onAtualizarListaPin: ''})}
        />
      )
    } 
  }

  setarMainInline(aSetarInline){
    // somente atualiza se for diferente
    // console.log(this.RefMain.style.display, aSetarInline);
    // if ((this.RefMain.style.display === 'grid' && aSetarInline === false) || 
    //     (this.RefMain.style.display === 'inline' && aSetarInline === true)) {return false} 
    // this.RefMain.style.display = (aSetarInline) ?  ("inline") : ("grid");
  }

  retornarNovaPerguntaAluno(){
    if (this.state.isAluno && this.state.isLogged) {
      return (
        <ImageNovaPergunta 
          onClickPergunta={()=>this.setState({ modalPerguntar: true })}
        />
      )
    }
  }

  retornarInfoAula(){
    if (this.state.isAluno && this.state.isLogged){
      return (
        <div className="" style={{position: "absolute", width: "100%", backgroundColor: "#343a40"}}> <p>{this.state.nm_professor}</p> </div>
      )
    }
  }

  retornarNavBottom(){
    if (this.state.isLogged){
      return( 
      <NavbarBottom
        isProfessor={this.state.isProfessor}
        isAluno={this.state.isAluno}
        modalPerguntar={this.state.modalPerguntar}
        setarEstadoNovaPergunta={()=>this.setState({ modalPerguntar: true })}
        setarFiltroNavBottom={(e)=>this.setarFiltroNavBottom(e)} 
        onClickPin={()=>this.setState({modalPinList: true})}
      />)
    }
  }

  setarBackGround(){
    this.setState({backgroundNight: true});
    document.getElementsByTagName("body")[0].style = ( "background-color: #1b1b1b93")
  }

  retornarContador(){
    if (!this.state.backgroundNight) {
      return (
        <Contador 
        state={this.state.backgroundNight}
        setarBackGround={()=>this.setarBackGround()}/>
      )
    }
  }

  // teste(){
  //   let os=require('os');
  //   let ifaces=os.networkInterfaces();
  //   console.log(ifaces)
  //   for (let dev in ifaces) {
  //     let alias=0;
  //     ifaces[dev].forEach((details)=>{
  //       if (details.family==='IPv4') {
  //         console.log(dev+(alias?':'+alias:''),details.address);
  //         ++alias;
  //       }
  //     });
  //   };
  //   // return false

  // }

  render() {
      return (
        <>
        {this.retornarModal()}      
          <div>
            <header >
              {/* {this.retornarInfoAula()} */}
              {/* {this.retornarContador()} */}
              {this.retornarNav()}
              {this.retornarNavBottom()}
              {/* {this.teste()} */}
            </header>
              {this.retornarNotificacaoPadrao()}
          </div>
          <div className="app" id="app" >
            {/* {<h1 class>teste</h1>} */}
            <main ref={(field) => {this.RefMain = field}}  >
              {this.retornarForm()}
            </main>
            {/* {this.retornarNovaPerguntaAluno()} */}
          </div>
        </>
    )};
  }

export default App;
