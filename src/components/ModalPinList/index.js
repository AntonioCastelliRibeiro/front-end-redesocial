import React from 'react';
import './styles.scss';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import ListaPin from '../ListaPin';

class ModalPinList extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      spinner: true,
      show: false, 
      listaPin: '', //[{}],
      alertar: false,
      mensagem: ''
    }
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount(){
  }

  componentWillReceiveProps(aProps){
    if (this.props.modal === aProps.modal) {return false} // so atualiza o show se houver troca
    if (aProps.modal === true) this.setState({show: true});
    // if(this.props.onAtualizarListaPin.length !== 0) this.verificarAtualizarListaPin();

  }

  componentDidUpdate(){
    // this.props.socket.on('pergunta.aluno.modal', (e)=>this.verificarNecessidadeAtt(e));
  }

  componentWillUnmount(){
    // this.props.socket.off('pergunta.aluno.modal');
  }


  verificarNecessidadeAtt(e){
    if (!this.state.show) this.verificarMensagemLista(e);
  }

  verificarMensagemLista(aPerg){
    console.log('passssssss')
    const lvCdPin = aPerg.cd_pin;
    const lvCdProfessor = aPerg.cd_professor;
    if (this.props.cd_professor !== lvCdProfessor) return false; // somente atualiza a lista se for o professor
    this.listaPinAux = this.state.listaPin;

    const lvIndex =  this.listaPinAux.findIndex((e)=>e.id === lvCdPin);
    const lvNrPerg = parseInt(this.listaPinAux[lvIndex].nr_pergunta);

    this.listaPinAux[lvIndex].nr_pergunta = lvNrPerg +1; // atualiza o nr de perguntas
    this.setState({listaPin: this.listaPinAux});
  }

  setarListaPin(aListaPin){
    this.setState({listaPin: aListaPin});
    this.setState({spinner: false});
  } 

  handleCancel(){
    this.setState({show: false});
    this.props.onClose();
  }

  async carregarListaPin(){
    const lvToken = this.props.token;
    const lvApi = this.props.api;
    try {
      const lvListaPin = await lvApi.get('/pinLista', {  
        headers: { 
          'authorization': `Bearer ${lvToken}`,
      }});
      if (lvListaPin.data.success) {this.setarListaPin(lvListaPin.data.listaPin)}
      else {this.setarAlerta(lvListaPin.data.mensagem)}
    } catch (error) {
      console.log(error)
      this.setarAlerta(error.response.data);
    }  
  }

  setarAlerta(aMensagem){
    console.log(aMensagem)
    this.setState({ spinner: false, alertar: true, mensagem: aMensagem });
  }

  retornarListaPin(){
    return (
      <ListaPin 
        api={this.props.api}
        token={this.props.token}
        socket={this.props.socket}
        listaPin={this.state.listaPin}
        alerta={this.state.alerta}
        spinner={this.state.spinner}
        carregarListaPin={()=>this.carregarListaPin()}
        onClickPergunta={(e)=>this.onClickPergunta(e)}
        verificarMensagemLista={(e)=>this.verificarMensagemLista(e)}
        atualizarNotListaPin={()=>this.atualizarNotListaPin()}
        onAtualizarListaPin={this.props.onAtualizarListaPin}
      />
    )
  }

  async atualizarNotListaPin(){
    await this.atualizarNrNot();
    await this.verificarAtualizarListaPin();
  }

  async verificarAtualizarListaPin(){
    if (this.state.listaPin.length === 0) return false
    const { id } = this.props.onAtualizarListaPin;
    var lvListaAux = this.state.listaPin;
    const lvIndex =  lvListaAux.findIndex((e)=>e.id === id);
    if (lvIndex === -1) return false

    lvListaAux.push(this.props.onAtualizarListaPin);
    this.setState({listaPin: lvListaAux});
    this.props.onAtualizarListaPinClear();
  }

  async atualizarNrNot(){
    const lvToken = this.props.token;
    const lvApi = this.props.api;
    try {
      const lvListaPin = await lvApi.get('/pinAtualizarNrNot', {  
        headers: { 
          'authorization': `Bearer ${lvToken}`,
      }});
      if (lvListaPin.data.success) await this.atualizarNrNotLista(lvListaPin.data.listaPin)
      else {this.setarAlerta(lvListaPin.data.mensagem)}
    } catch (error) {
      console.log(error)
      this.setarAlerta(error.response.data);
    }
  }  

  async atualizarNrNotLista(aLista){
    this.listaPinAux = this.state.listaPin;

    aLista.map((aData)=>{
      const lvCdPin = aData.id;
      var lvNovasAtt = false;
      const lvIndex =  this.listaPinAux.findIndex((e)=>e.id === lvCdPin);
      if (aLista.nr_pergunta !== this.listaPinAux[lvIndex].nr_pergunta){ // somente atualiza se houver novas not.
        this.listaPinAux[lvIndex].nr_pergunta = aData.nr_pergunta;
        lvNovasAtt = true;
      }
      if (lvNovasAtt) this.setState({listaPin: this.listaPinAux});
    })
  }

  onClickPergunta(e){
    this.handleCancel(); 
  }

  retornarComponenteListaPin(){
    return (
      <div className="col div-listapin">
        {this.retornarListaPin()}
      </div>
    )
  }

  render() {
    const ListaPin = this.retornarComponenteListaPin();
    return (
      <>      
      <Modal
        size="lg"        
        scrollable={true}
        aria-labelledby="contained-modal-title-vcenter"
        show={this.state.show} 
        onHide={this.handleCancel}
      >
        <Modal.Body className="modal-body-style" >
        <Modal.Header className="modal-header-style" closeButton>
          <Modal.Title className="modal-title-style" >Seleção de Pin</Modal.Title>
        </Modal.Header>
          {ListaPin} 
        </Modal.Body>
        <Modal.Footer className="modal-footer-style">
          <Button tabIndex="-1" variant="secondary" onClick={this.handleCancel}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    );  
  }
}

export default ModalPinList;