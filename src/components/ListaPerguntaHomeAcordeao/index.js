import React from 'react';
import './styles.scss';

import AcordeaoItemLoading from '../AcordeaoItemLoading';
import AcordeaoItemHome from '../AcordeaoItemHome';

//import io from 'socket.io-client';
//const socket = io('http://localhost:3333');
//socket.on('connect', ()=>{console.log('Conectado')});

class ListaPerguntaHomeAcordeao extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cdHref: '',
      spinner: true,
      mensagem: '',
      listaPergunta: '',
      temPergunta: true,
      mensagemAlerta: '',
      expand: ''
      // [{
      //   // numReg: '',
      // }]
    }
    this.listaPerguntaAux = [];
    
    this.verificarMensagemLista = this.verificarMensagemLista.bind(this);
  }

  async componentDidMount(){
    await this.carregarListaPergunta();
  }

  componentWillUnmount(){
    this.props.socket.off('pergunta.aluno.modal');
    this.props.socket.off('resposta.pergunta.aluno');
    this.props.socket.off('delete.pergunta.aluno');
    // this.props.socket.off('filtro.nav.bottom');
  }

  componentDidUpdate(aPrevProps, aPrevStatus){
    this.setarVerificarUrlFilter();
    this.props.socket.on('pergunta.aluno.modal', (e)=>(this.verificarMensagemLista(e)));
    this.props.socket.on('resposta.pergunta.aluno', (e)=>(this.verificarAtualizarRespostaPergunta(e)));
    this.props.socket.on('delete.pergunta.aluno', (e)=>(this.verificarRemoverPerguntaAluno(e)));
  }

  componentWillReceiveProps(aPrevProps){
    if ((this.props.filtroNavBottom === aPrevProps.filtroNavBottom) && 
         (this.props.filtroNavBottom !== 'P')) {return false}
    this.setarFiltroListaPergunta(aPrevProps.filtroNavBottom);
  }

  setarVerificarUrlFilter(){
    if (this.state.isAluno) {window.location.pathname = ''} //se for aluno zera o filtro
    const lvHref = this.verificarRetornarUrl();
    if (this.state.cdHref !== lvHref && lvHref.length === 5 ) {
      this.setState({cdHref: lvHref});
      this.setarFiltroComCodigoTipo(this.props.filtroNavBottom, lvHref);
    }
  }

  verificarRetornarUrl(){
    const lvHref = (window.location.pathname.substring(1));
    if ((lvHref.length !== 5 && lvHref.length !== 0) || isNaN(lvHref)) { window.location.pathname = '' } // zera a url se nao for valida
    return (window.location.pathname.substring(1,6));
  }

  removerItemLista(aLista, aIndex, aSetarEstado) {
    var lvLista = aLista;
    var lvSizeList = (lvLista.length);
    lvLista.splice(aIndex, 1);   
    if (lvSizeList === 1) { // se há apenas uma pergunta que será removida
      (aSetarEstado)?(this.setState({listaPergunta: lvLista, temPergunta: false})):(this.listaPerguntaAux = lvLista);
      this.props.onSetarMainInline(true);
    } else {
      (aSetarEstado)?(this.setState({listaPergunta: lvLista})):(this.listaPerguntaAux = lvLista);
    }
  }

  verificarRemoverPerguntaAluno(aData){
    const {id, cd_aluno, cd_pin, cd_professor} = aData;
    if ((this.props.isAluno && (cd_aluno !== this.props.cd_aluno || cd_pin !== this.props.pin)) ||
         (this.props.isProfessor && this.props.cd_professor !== cd_professor)) {return}

    const lvIndex = this.state.listaPergunta.findIndex((e)=>e.id === id); 
    if (lvIndex !== -1){
      console.log('setou lista acord');
      this.removerItemLista(this.listaPerguntaAux, lvIndex, true);
    } else {
      const lvIndexAux = this.listaPerguntaAux.findIndex((e)=>e.id === id); 
      if (lvIndexAux !== -1){
        console.log('setoulistaAux');
        this.removerItemLista(this.listaPerguntaAux, lvIndexAux, false);
      } 
      return false
    }
  }

  verificarAtualizarRespostaPergunta(aResposta){
    if (this.props.isProfessor && aResposta.cd_professor !== this.props.cd_professor) {return} 
    else if (this.props.isAluno && aResposta.cd_pin !== this.props.pin) {return}

    const {st_pergunta, ds_resposta, id, updated_at} = aResposta;
    this.listaPergunta = this.state.listaPergunta;

    const lvIndex = this.listaPergunta.findIndex((e)=>e.id === id); 

    if(this.listaPergunta.length !== 0) { 
      if(this.listaPergunta[lvIndex].st_pergunta === 'F') {return} // para evitar que atualize o estado varias vezes...
      this.listaPergunta[lvIndex].updated_at  = updated_at;
      this.listaPergunta[lvIndex].st_pergunta = st_pergunta; // atualiza para respondida
      this.listaPergunta[lvIndex].ds_resposta = ds_resposta; // atualiza resposta
      console.log(ds_resposta)
      this.setState({listaPergunta: this.listaPergunta}); // para atualizar o estado dos componentes....
    }
  }

  async verificarMensagemLista(aMensagem){
    if (this.listaPerguntaAux.length !== 0) { // se nao tem pergunta ainda nao verifica
      const lvIndex = this.listaPerguntaAux.findIndex((e)=>(e.id === aMensagem.id));
      if (lvIndex !== -1) {return false} // se nao houver a pergunta adiciona
    }
    console.log(aMensagem)
    console.log(this.props.isProfessor, aMensagem.cd_professor, this.props.cd_professor, this.props.pin, aMensagem.cd_pin)

    if ((this.props.isProfessor && aMensagem.cd_professor === this.props.cd_professor) || 
         (this.props.pin === aMensagem.cd_pin)){
  

      if (this.props.filtroNavBottom !== 'R') {
        if(this.state.spinner || this.state.temPergunta){ // seta a pergunta somente para o professor
          this.setState({listaPergunta: [aMensagem,...this.state.listaPergunta]})
        } else {
          this.setState({listaPergunta: [aMensagem,...this.state.listaPergunta], spinner: false, temPergunta: true})
        }
      }
      this.listaPerguntaAux.unshift(aMensagem);
      if (!this.state.listaPergunta.length !== 0) this.props.onSetarMainInline(false);
    } 
  }

  async carregarListaPergunta(){
    console.log('carregando..')
    const lvToken = this.props.token.session.token;
    const lvApi = this.props.api;
    try {
      const lvPergunta = await lvApi.get('/perguntaHome', { 
        headers: { 'authorization': `Bearer ${lvToken}`,
        cd_pin: this.props.pin,
      },});
      this.props.onSetarMainInline(false);
      this.setarEstadoListaPergunta(lvPergunta.data.listaPergunta)
    } catch (error) {
      this.props.onSetarMainInline(true);
      this.setState({ spinner: false, temPergunta: false, mensagemAlerta: error.response.data.mensagem })
    }

  }

  setarEstadoListaPergunta(aListaProfessor){
    this.setState({ listaPergunta: aListaProfessor, spinner: false, temPergunta: true, mensagemAlerta: '' });
    this.listaPerguntaAux = aListaProfessor;
    // console.log(aListaProfessor)
  } 

  // componentWillUpdate(aProps, aStateAnt){
  //   if (this.props.filtroNavBottom === aProps.filtroNavBottom) {return false}
  //   this.setarFiltroListaPergunta(aProps.filtroNavBottom);
  //   console.log('filtro')
  // }

  setarFiltroComCodigo(cCdFiltro){
      // const lvListaFilter = this.listaPerguntaAux.filter((e)=>e.cd_pin === cCdFiltro);
      const lvListaFilter = this.state.listaPergunta.filter((e)=>e.cd_pin === cCdFiltro);

      this.setState({
        listaPergunta: lvListaFilter, 
        temPergunta: (lvListaFilter.length > 0)?(true):(false), 
        mensagemAlerta: "Nenhuma pergunta encontrada"
      }); 
      // console.log(this.state.listaPergunta)
      // if (this.state.listaPergunta)
      // this.props.onSetarMainInline(lvListaFilter.length === 0);
  }

  retornarFiltro(e, AItem, AHref){
    // console.log(e, AItem, AHref);
    if (AItem === 'T' ){
      if (AHref.length !== ''){  // filtro com codigo
        return ((e.st_pergunta === 'A' && e.cd_pin === AHref ) || (e.st_pergunta === 'F' && e.cd_pin === AHref));
      } else { // filtro sem codigo
        return (e.st_pergunta === 'A' || e.st_pergunta === 'F');
      }
    } else {
      const lvItem = (AItem === 'R')?('F'):('A');
      if (AHref.length !== ''){ // filtro com codigo
        return (e.st_pergunta === lvItem && e.cd_pin === AHref );
      } else { // filtro sem codigo
        return (e.st_pergunta === lvItem);
      }
    }
  }

  setarFiltroComCodigoTipo(AItem, AHref){
    if (this.listaPerguntaAux.length === 0) {
      if (this.state.listaPergunta.length === 0) return false // se a lista estiver vazia 
      this.listaPerguntaAux = this.state.listaPergunta
    }
    const lvListaFilter = this.listaPerguntaAux.filter((e)=>this.retornarFiltro(e, AItem, AHref));
    this.setState({
      listaPergunta: lvListaFilter, 
      temPergunta: (lvListaFilter.length > 0)?(true):(false), 
      mensagemAlerta: "Nenhuma pergunta encontrada"
    });
    console.log(lvListaFilter.length)
    this.props.onSetarMainInline((lvListaFilter.length === 0));
  }

  setarFiltroListaPergunta(aItem){
    const lvHref = this.verificarRetornarUrl();
    if (lvHref.length === 5) {
      this.setarFiltroComCodigoTipo(aItem, lvHref);
      return
    }

    if(aItem === "T"){
      const lvListaFilter = this.listaPerguntaAux.filter((e)=>{return (e.st_pergunta === 'A' || e.st_pergunta === 'F')});
      this.setState({
        listaPergunta: lvListaFilter, 
        temPergunta: (lvListaFilter.length > 0)?(true):(false), 
        mensagemAlerta: "Nenhuma pergunta encontrada"
      });
      this.props.onSetarMainInline((lvListaFilter.length === 0));
      console.log('T')
    } else if (aItem === "R") {
      const lvListaFilter =  this.listaPerguntaAux.filter((e)=>{ return (e.st_pergunta === 'F')});
        this.setState({
          listaPergunta: lvListaFilter, 
          temPergunta: (lvListaFilter.length > 0)?(true):(false), 
          mensagemAlerta: "Nenhuma pergunta encontrada" 
        });
        this.props.onSetarMainInline((lvListaFilter.length === 0));
        console.log('R');
    } else if (aItem === "N"){
      const lvListaFilter = this.listaPerguntaAux.filter((e)=>{return (e.st_pergunta === 'A')});
        this.setState({
          listaPergunta: lvListaFilter,
          temPergunta: (lvListaFilter.length > 0)?(true):(false), 
          mensagemAlerta: "Nenhuma pergunta encontrada" 
        });
        this.props.onSetarMainInline((lvListaFilter.length === 0));
        console.log('N')
      }

  }

  removerPerguntaLista(aId, aIndex){
    this.listaPerguntaDelete = this.state.listaPergunta;
    if (aIndex === -1){return false}
    this.listaPerguntaDelete.splice(aIndex, 1);

    if (this.listaPerguntaDelete.length === 0){
      this.setState({
        listaPergunta: this.listaPerguntaDelete, 
        temPergunta: false, 
        mensagemAlerta: "Nenhuma pergunta encontrada" 
      });
    } else { this.setState({ listaPergunta: this.listaPerguntaDelete, temPergunta: true}) }

    this.props.onSetarMainInline(this.listaPerguntaDelete.length === 0);

    /* Remove o item da lista responsavel pelo filtro Navbottom */
    const lvIndex = this.listaPerguntaAux.findIndex((e)=>e.id === aId); 
    if (lvIndex === -1){return false}

    // console.log(lvIndex);
    this.listaPerguntaAux.splice(lvIndex, 1);
    // console.log(this.listaPerguntaAux)
  }

  enviarSocketDelete(aData){
    this.props.socket.emit('delete.pergunta.aluno', aData);
  }

  async onDeleteAcordeaoItemHome(aData){
    const {id} = aData;
    const lvIndex = this.state.listaPergunta.findIndex((e)=>e.id === id); 
    if (lvIndex === -1){return false}
    try {
      const lvApi = this.props.api;
      const lvToken = this.props.token.session.token;
      const lvMensagem = await lvApi.delete('/perguntaDelete', { 
        headers: { 'authorization': `Bearer ${lvToken}`,
        cd_pergunta: id,
      },});
      this.removerPerguntaLista(id, lvIndex);
      this.enviarSocketDelete(aData);
      this.props.onSetarNotificacao(lvMensagem.data.mensagem);
    } catch (error) {
      this.setState({ spinner: false, temPergunta: false, mensagemAlerta: error.response.data.mensagem })
    }
  }

  async onClickResposta(aData){
    const {id, resposta, professor} = aData;
    try {
      const lvApi = this.props.api;
      const lvToken = this.props.token.session.token;
      const lvRespostaPergunta = await lvApi.put('/atualizarRespostaPergunta', { 
        headers: { 'authorization': `Bearer ${lvToken}`,
        cd_professor: professor,
        cd_pergunta: id,
        ds_resposta: resposta
      },});
        this.emitirRespostaPergunta(lvRespostaPergunta.data.dadosPergunta)
        this.props.onSetarNotificacao(lvRespostaPergunta.data.mensagem);
    } catch (error) {
      this.setState({ spinner: false, temPergunta: false, mensagemAlerta: error.response.data.mensagem })
    }
  }

  emitirRespostaPergunta(aData){
    this.props.socket.emit('resposta.pergunta.aluno', aData);
  }

  onExpandAcordeaoItemHome(aExpand, aCount){
    // console.log(this.state.listaPergunta[aCount]);
    const lvCount = aCount +1;
    if (this.state.expand === 0) {
      this.setState({expand: lvCount})
    } else {
      var lvExpand = this.state.expand;
      if (!aExpand){ // se nao estiver expandido remove da lista
        const lvIndex = lvExpand.findIndex((e)=>e === aCount); 
        lvExpand.splice(lvIndex, 1);   
        this.setState({expand: lvExpand});
      } else {
        this.setState({ expand: [lvCount, ...lvExpand] })
      }
    }
  }
  

  retornarConteudo(aData, aCount){
    return(
      <AcordeaoItemHome 
        recordCount={this.state.listaPergunta.indexOf().toString}
        listaPergunta={this.state.listaPergunta}
        expandList={this.state.expand}
        count={aCount}
        key={aData.id}
        data={aData} 
        isAluno={this.props.isAluno}
        cd_aluno={this.props.cd_aluno}
        isProfessor={this.props.isProfessor}
        onDelete={(e)=>this.onDeleteAcordeaoItemHome(e)}
        onClickResposta={(e)=>this.onClickResposta(e)}
        onExpand={(aExpand, aCount)=>this.onExpandAcordeaoItemHome(aExpand, aCount)}
        />
    )
  }

  retornarListaPergunta(){
    if (!this.state.temPergunta) {
      return <p className="text-alerta">{this.state.mensagemAlerta}</p>
    }
    else if (this.state.spinner) {
      return (
        <>
          <AcordeaoItemLoading key={1} />
          <AcordeaoItemLoading key={2} />
          <AcordeaoItemLoading key={3} />
          <AcordeaoItemLoading key={4} />
          <AcordeaoItemLoading key={5} />
          <AcordeaoItemLoading key={6} />
          <AcordeaoItemLoading key={7} />
          <AcordeaoItemLoading key={8} />
          <AcordeaoItemLoading key={9} />
          <AcordeaoItemLoading key={10} />
          <AcordeaoItemLoading key={11} />
          <AcordeaoItemLoading key={12} />
          <AcordeaoItemLoading key={13} />
          <AcordeaoItemLoading key={14} />
          <AcordeaoItemLoading key={15} />
          <AcordeaoItemLoading key={16} />
          <AcordeaoItemLoading key={17} />
          <AcordeaoItemLoading key={18} />
          <AcordeaoItemLoading key={19} />
          <AcordeaoItemLoading key={20} />
          <AcordeaoItemLoading key={21} />
        </>
      )
    } 
    else {
      return( 
        this.state.listaPergunta.map((aData, aCount)=>(this.retornarConteudo(aData, aCount)))
      )
    }
  }

  render(){
    return ( this.retornarListaPergunta())
  } 

}

  export default ListaPerguntaHomeAcordeao;

