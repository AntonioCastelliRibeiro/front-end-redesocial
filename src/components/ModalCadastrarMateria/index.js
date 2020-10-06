import React from 'react';
import './style.scss';

import edit from '../../image/edit/edit.svg';
import add from '../../image/add/add.svg';

import {Modal, Button, Form} from 'react-bootstrap';

import CampoPadrao from '../CampoPadrao';
import ImageEditModal from '../ImageEditModal';


class ModalCadastrarMateria extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      cd_campo:'',
      ds_campo: '',
      cadastrar: true,
      alertar: false,
      show: true,  
      ds_materia: '',
      mensagem: '',
    }

    this.handleShow = this.handleShow.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleShow(e){
    e.preventDefault();
    this.setState({ show: true });
  }

  handleCancel(){
    this.setState({ show: false, alertar: false, ds_materia: '' });
    this.props.onClose();
  }
  setarEstadoAlerta(error){
    //console.log(error.response.data);
    if (!error.response.data.success) { 
      this.setState({ alertar: true, mensagem: error.response.data.mensagem });
    }
  }
  
  validarCampo(){
    const lvDsCampo = this.state.ds_campo.trim().length;
    if (lvDsCampo === 0){ this.setState({ alertar : true, mensagem: 'Descrição Inválida' }) }
  }

  async onSubmitModal(){
    // return console.log("teste")
    (this.state.cadastrar)?(await this.cadastrarMateria()):(await this.editarMateria())    
  }

  async editarMateria(){
    this.validarCampo();
    if (this.state.alertar){return}
    try {
      const lvToken = this.props.token;
      const api = this.props.api;
      const lvRetorno = await api.put('/Materia', {
        headers: {
          'authorization': `Bearer ${lvToken}`,
          cd_materia: this.state.cd_campo,
          ds_materia: this.state.ds_campo
        },
      });
      if (lvRetorno.status ===  200){}//tratar
    } catch (error) { this.setarEstadoAlerta(error); }

    if (!this.state.alertar){
      this.handleCancel();
      this.props.onSubmitMateria();
      this.props.onRecarregarMateria();
    }
  }

  async cadastrarMateria(){
    this.validarCampo();
    if (this.state.alertar){return}
    try {
      const lvToken = this.props.token;
      const api = this.props.api;
      await api.post('/Materia', {
        headers: {
          'authorization': `Bearer ${lvToken}`,
          ds_materia: this.state.ds_materia.trim() },
      });
    } catch (error) { this.setarEstadoAlerta(error); }

    if (!this.state.alertar){
      this.handleCancel();
      this.props.onSubmitMateria();
      this.props.onRecarregarMateria();
    }
  }

  retornarCampo(){
    if (this.state.cadastrar){
      return (
        <div className="w-100">
          <CampoPadrao
            id="form-principal"
            validated={this.state.ds_campo.trim().length > 0 && !this.state.alertar}
            controlId="formUsuario"
            label="Nome da Matéria"
            type="input" 
            placeholder="Matéria" 
            value={this.state.ds_campo}
            onChange={(e)=>(this.setState({ ds_campo: e }))}
            onKeyPress={(e)=>(this.setState({ alertar: false }))} 
            isInvalid={this.state.alertar}
            alerta={this.state.alertar}
            alertaMensagem={this.state.mensagem}
          />
        </div>
      )
    } else {
      return (
        <Form.Group  controlId="formUsuario" style={{marginBottom: 2 }}>
          <Form.Label style={{marginBottom: 2 }} >Selecione para Alterar</Form.Label>
          <Form.Control   
            as="select"
            custom
            onChange={(e)=>this.setState({ds_campo: e.target.value.slice(4), cd_campo: e.target.selectedOptions[0].id, alertaCampo: false})}
          > 
            <option id="0" key="0"></option>
              {this.retornarListaSelecaoMat()}
            </Form.Control >
            <CampoPadrao
              id="form-principal"
              // validated={this.state.ds_campo.trim().length > 0 && !this.state.alertar}
              controlId="formUsuario"
              label="Nova Descrição"
              type="input" 
              placeholder="Selecione a Matéria" 
              value={this.state.ds_campo}
              onChange={(e)=>(this.setState({ ds_campo: e }))}
              onKeyPress={(e)=>(this.setState({ alertar: false }))} 
              isInvalid={this.state.alertar}
              alerta={this.state.alertar}
              alertaMensagem={this.state.mensagem}
              onSubmit={()=>this.onSubmitModal()}
            />
      </Form.Group>
      )
    }
  }

  retornarListaSelecaoMat(){
    const lvMateria = this.props.listaMateria.materia;
    if (lvMateria){
    return (
      <>
      {lvMateria.map((aData,aNumber)=>(this.retornarConteudoSelecaoMat(aData,aNumber+1)))}
      </>
      )
    }
  }

  retornarConteudoSelecaoMat(aData,aNumber){
    return ( 
      <option 
        id={aData.id}
        key={aData.id}
      >{ `${aNumber} - ${aData.ds_materia}` }</option> )
  }  

  render() {
    return (
      <>    
      <Modal size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered 
        className="modal-style"
        // className={(this.state.cadastrar)?("modal-cadastrar-effect"):("modal-effect")}
        show={this.state.show} 
        onHide={this.handleCancel} >
        <Modal.Header  className="modal-header-materia" closeButton >
          <Modal.Title style={{ fontSize:20 }}>{(this.state.cadastrar)?("Cadastrar Matéria"):("Editar Matéria")}</Modal.Title>
        </Modal.Header >
        <Modal.Body className={(this.state.cadastrar)?("modal-body-materia"):("modal-body-materia-effect")} >
          <div className="d-flex">
            {this.retornarCampo()}            
            <div className="div-img">
              <ImageEditModal 
                tooltipName={(this.state.cadastrar)?("Editar Matéria"):("Cadastrar Matéria")}
                img={(this.state.cadastrar)?(edit):(add)}
                alt="e"
                onClick={()=>this.setState({cadastrar: (this.state.cadastrar)?(false):(true)})}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer-materia">
          <Button variant="primary" block onClick={()=>this.onSubmitModal()}>
            {(this.state.cadastrar)?("Cadastrar"):("Salvar")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    );  
  }
}
export default ModalCadastrarMateria;