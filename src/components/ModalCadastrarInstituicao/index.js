import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CampoPadrao from '../CampoPadrao';

class ModalCadastrarInstituicao extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      alertar: false,
      show: true,  
      ds_instituicao: '',
      mensagem: '',
    }

    this.handleShow = this.handleShow.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onSubmitModalInstituicao = this.onSubmitModalInstituicao.bind(this);

  }

  handleShow(e){
    e.preventDefault();
    this.setState({ show: true });
  }

  handleCancel(){
    this.setState({ show: false, alertar: false, ds_instituicao: '' });
    this.props.onClose();
  }
  
  setarEstadoAlerta(error){
    if (!error.response.data.success) { 
      this.setState({ alertar: true, mensagem: error.response.data.mensagem });
    }
  }
  
  async validarInstituicao(){
    const lvInstituicao = this.state.ds_instituicao.trim();
    if (lvInstituicao === ''){ this.setState({ alertar : true, mensagem: 'Instituição inválida', })}
  }

  async onSubmitModalInstituicao(){
    await this.validarInstituicao();
    if (this.state.alertar){return}
    try {
      const lvToken = this.props.token;
      const api = this.props.api;
      await api.post('/instituicao', {
        headers: {
          'authorization': `Bearer ${lvToken}`,
          ds_instituicao: this.state.ds_instituicao.trim() },
      });
    } catch (error) { this.setarEstadoAlerta(error) }

    if (!this.state.alertar){
      this.handleCancel();
      this.props.onSubmitInstituicao();
      this.props.onRecarregarInstituicao();
    }
  }

  render() {
    return (
      <>    
      <Modal size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered 
        show={this.state.show} 
        onHide={this.handleCancel}>
        <Modal.Header style={{ margin: 10 }} closeButton>
          <Modal.Title style={{ fontSize:20 }}>Cadastro de Instituição</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CampoPadrao
            id="form-principal"
            validated={this.state.ds_instituicao.length > 0 && !this.state.alertar}
            controlId="formUsuario"
            label="Nome da Instituição"
            type="input" 
            placeholder="Instituição" 
            value={this.state.ds_instituicao}
            onChange={(e)=>(this.setState({ ds_instituicao: e }))}
            onKeyPress={(e)=>(this.setState({ alertar: false }))} 
            isInvalid={this.state.alertar}
            alerta={this.state.alertar}
            alertaMensagem={this.state.mensagem}
            onSubmit={this.onSubmitModalInstituicao}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.onSubmitModalInstituicao}>
            Cadastrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    );  
  }
}
export default ModalCadastrarInstituicao;