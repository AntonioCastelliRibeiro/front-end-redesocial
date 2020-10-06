import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import ListaPerguntaPin from '../ListaPerguntaPin';

class ModalPergunta extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      spinner: true,
      alertar: false,
      mensagem: '',
      show: true, 
      tabName: 'NResp' 
    }

    this.listaPerguntaResp = []; 
    this.listaPerguntaNResp = []; /*[{
      id:  '',
      ds_pergunta: '', 
      st_anonimo: '',
      nm_aluno: '' // ALUNO.nm_aluno
    }]*/

    this.handleCancel = this.handleCancel.bind(this);
    this.setarAlerta = this.setarAlerta.bind(this);
    this.carregarListaPergunta = this.carregarListaPergunta.bind(this);
    this.verificarAtribuirListaPergunta = this.verificarAtribuirListaPergunta.bind(this);

  }

  handleCancel(){
    this.setState({ show: false, cd_materia: '', ds_materia: '' });
    this.props.onClosePergunta();
  }
  
  setarListaPergunta(aListaPergunta, aTabName){
    if (aTabName=== 'Resp') { this.setState(this.listaPerguntaResp = aListaPergunta) }
    else { this.setState(this.listaPerguntaNResp = aListaPergunta)}
    this.setState({ spinner: false });
  }

  setarAlerta(aData){
    this.setState({
      spinner: false,
      alertar: true,
      mensagem: aData.mensagem
    })
  }

  retornarPerguntaConvertida(aPergunta){
    return (
      {
        ALUNO: { nm_aluno: aPergunta.nm_aluno },
        ds_pergunta: aPergunta.ds_pergunta,
        id: aPergunta.id,
        st_pergunta: aPergunta.st_pergunta,
        st_anonimo: aPergunta.st_anonimo
      }
    )
  }

  verificarAtribuirListaPergunta(aPergunta){
    if (aPergunta.cd_pin !== this.props.pin) {return}
      const lvExistePergunta = this.listaPerguntaNResp.find((e)=>aPergunta.id === e.id);
      if(!lvExistePergunta) {
        if (this.listaPerguntaNResp.length === 0 ) {this.setState({ alertar: false, mensagem: '' })}
        this.setState(this.listaPerguntaNResp = [this.retornarPerguntaConvertida(aPergunta),...this.listaPerguntaNResp]);
      }
  }

  verificarNecessidadeSetarLista(aTabName){
    const lvListaPergunta = (aTabName=== 'Resp') ? (this.listaPerguntaResp) : (this.listaPerguntaNResp);
    if (lvListaPergunta.length !== 0) {
      this.setState({ spinner: false });
      return false
    } else { return true }
  }

  async carregarListaPergunta(aTabName){ //tabName so vem do change do tab
    const lvToken = this.props.token;
    const lvApi = this.props.api;
    const lvTabName = (aTabName)? (aTabName) : (this.state.tabName);
    if (!this.verificarNecessidadeSetarLista(lvTabName)) {return}
    try {
      const lvListaPergunta = await lvApi.get('/perguntaListaPin', {  
        headers: { 
          'authorization': `Bearer ${lvToken}`,
          cd_pin: this.props.pin,
          tab_name: lvTabName
      }});
      if (lvListaPergunta.data.success) {this.setarListaPergunta(lvListaPergunta.data.listaPergunta, lvTabName)}
    } catch (error) {
      this.setarAlerta(error.response.data);
    }  
  }

  atualizarListaPergunta(aData){
    const {resposta, id} = aData;
    const lvIndex = this.listaPerguntaNResp.findIndex((e)=>e.id === id); // busca elemento da lista de perguntas n resp.
    
    if(this.listaPerguntaResp.length !== 0) { // somente atualizará a lista de perg resp caso ela esteja montada
      this.listaPerguntaNResp[lvIndex].st_pergunta = 'F'; // atualiza para respondida
      this.listaPerguntaNResp[lvIndex].ds_resposta = resposta; // atualiza resposta
      this.listaPerguntaResp.unshift(this.listaPerguntaNResp[lvIndex]); // adiciona elemento pelo index da lista de perg resp.
      this.setState(this.listaPerguntaResp =  this.listaPerguntaResp); // para atualizar o estado dos componentes....
    }
    
    this.listaPerguntaNResp.splice(lvIndex, 1); // remove elemento da lista de perg resp pelo index
    this.setState(this.listaPerguntaNResp =  this.listaPerguntaNResp); // para atualizar o estado dos componentes....
    if (this.listaPerguntaNResp.length === 0) { this.setarAlerta({mensagem: "Nenhuma pergunta recebida"})}
  }

  emitirSocketResposta(aData){
    this.props.socket.emit('resposta.pergunta.aluno', aData);
  }

  async onClickRespostaPergunta(aResposta){
    const lvToken = this.props.token;
    const lvApi = this.props.api;
    const {resposta, id} = aResposta;
    try {
      const lvRespostaPergunta = await lvApi.put('/atualizarRespostaPergunta', {  
        headers: { 
          'authorization': `Bearer ${lvToken}`,
          cd_pergunta: id,
          cd_professor: this.props.cd_professor,
          ds_resposta: resposta
      }});
      if (lvRespostaPergunta.data.success) {this.atualizarListaPergunta(aResposta)}
      this.emitirSocketResposta(lvRespostaPergunta.data.dadosPergunta);
    } catch (error) {
      console.log(error.response.data);
    }  
  }

  retornarPergunta(){
    return (
      <ListaPerguntaPin 
        api={this.props.api}
        alertar={this.state.alertar}
        mensagem={this.state.mensagem}
        pin={this.props.pin}
        token={this.props.token}
        socket={this.props.socket}
        spinner={this.state.spinner}
        tabName={this.state.tabName}
        listaPerguntaNResp={this.listaPerguntaNResp}
        listaPerguntaResp={this.listaPerguntaResp}
        setarAlerta={this.setarAlerta}
        carregarListaPergunta={this.carregarListaPergunta}
        verificarAtribuirListaPergunta={this.verificarAtribuirListaPergunta}
        onClickRespostaPergunta={(e)=>this.onClickRespostaPergunta(e)}
      />
    )
  }

  async setarEstadoTab(e){
    this.setState({ tabName: e, spinner: true, alertar: false });
    await this.carregarListaPergunta(e);
  }

  render() {
    return (
      <>  
      <Modal
        size="lg"      
        scrollable={true}
        aria-labelledby="contained-modal-title-vcenter"         
        show={this.state.show} 
        onHide={this.handleCancel}>
        <Modal.Body>
        <Modal.Header  closeButton>
          <Modal.Title>{`Pin: ${this.props.pin}`}</Modal.Title>
        </Modal.Header>
          <Tabs 
            transition={false} 
            style={{ margin: 0, marginTop: 10, marginBottom: 10 }} 
            onSelect={(e)=>this.setarEstadoTab(e)}
            defaultActiveKey="NResp" >
            <Tab 
              style={{ margin: 10 }} 
              transition={false} 
              key="NResp" 
              title="Não Respondidas" 
              eventKey="NResp" 
            >
            </Tab>
              <Tab 
                transition={false} 
                style={{ margin: 10 }} 
                key="Resp" 
                eventKey="Resp" 
                title="Respondidas"
              >
              </Tab>
          </Tabs>
          {this.retornarPergunta()}
        </Modal.Body>
        <Modal.Footer>
          <Button tabIndex="-1" variant="secondary" onClick={this.handleCancel}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    );  
  }
}
export default ModalPergunta;