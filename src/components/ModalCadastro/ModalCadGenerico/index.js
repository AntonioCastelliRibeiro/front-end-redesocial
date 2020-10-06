import React from 'react';
import './style.scss';

import edit from '../../../image/edit/edit.svg';
import add from '../../../image/add/add.svg';
import deleteimg from '../../../image/delete/delete.svg';
import deletehover from '../../../image/delete/deletehover.svg';

import {Modal, Button, Form} from 'react-bootstrap';

import CampoPadrao from '../../CampoPadrao';
import ImageModal from '../../ImageModal';
import OverlayDelete from '../../OverlayDelete';

class ModalCadGenerico extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      cd_campo:'',
      ds_campo: '',
      cadastrar: true,
      alertar: false,
      show: true,  
      // ds_materia: '',
      mensagem: '',
      hover: false,
      delete: deleteimg,
      deletehover: deletehover

    }
  }

  handleCancel(){
    this.setState({ show: false, alertar: false });
    this.props.onClose();
  }

  setarEstadoAlerta(error){
    if (!error.response.data.success) { 
      this.setState({ alertar: true, mensagem: error.response.data.mensagem });
    }
  }
  
  async validarCampo(){
    const lvDsCampo = this.state.ds_campo.trim().length;
    if (lvDsCampo === 0){ this.setState({ alertar : true, mensagem: 'Descrição Inválida' }) }
  }

  async onSubmitModal(){
    await this.validarCampo();
    if (!this.state.alertar) {
    (this.state.cadastrar)?(await this.cadastrarCampo()):(await this.editarCampo())   
    }
  }

  async cadastrarCampo(){
    try {
      await this.props.onCadastrar({ds_campo: this.state.ds_campo});
    } catch (error) { this.setarEstadoAlerta(error) }
    if (!this.state.alertar) this.limparCampos();
    // this.handleCancel();
  }

  limparCampos(){
    this.setState({cd_campo: '', ds_campo: ''})
  }

  async editarCampo(){
    try {
    this.props.onEditar({cd_campo: this.state.cd_campo, ds_campo: this.state.ds_campo.trimStart().trimEnd()}) 
    } catch (error) { this.setarEstadoAlerta(error) }

  }

  retornarCampo(){
    if (this.state.cadastrar){
      return (
        <div className="w-100">
          <CampoPadrao
            id="form-principal"
            validated={this.state.ds_campo.trim().length > 0 && !this.state.alertar}
            controlId="formUsuario"
            label={this.props.labelCad}
            type="input" 
            placeholder={this.props.placeholderCad}
            value={this.state.ds_campo}
            onChange={(e)=>(this.setState({ ds_campo: e }))}
            onKeyPress={(e)=>(this.setState({ alertar: false }))} 
            isInvalid={(this.state.alertar  && this.state.ds_campo.length === 0)}
            alerta={(this.state.alertar && this.state.ds_campo.length === 0)}
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
            <option id="" key="0"></option>
              {this.retornarListaSelecao()}
            </Form.Control >
            <CampoPadrao
              id="form-principal"
              disabled={this.state.cd_campo.length === 0}
              // validated={this.state.ds_campo.trim().length > 0 && !this.state.alertar}
              controlId="formUsuario"
              label={this.props.labelEdit}
              type="input" 

              placeholder={this.props.placeholderEdit} 
              value={this.state.ds_campo}
              onChange={(e)=>(this.setState({ ds_campo: e }))}
              onKeyPress={(e)=>(this.setState({ alertar: false }))} 
              isInvalid={(this.state.alertar  && this.state.ds_campo.length === 0)}
              alerta={(this.state.alertar && this.state.ds_campo.length === 0)}
              alertaMensagem={this.state.mensagem}
              onSubmit={()=>this.onSubmitModal()}
            />
      </Form.Group>
      )
    }
  }

  retornarListaSelecao(){
    const lvLista = this.props.listaCad;
    if (lvLista){
    return (
      <>
      {lvLista.map((aData,aNumber)=>(this.props.retornarConteudoSelecao(aData,aNumber+1)))}
      </>
      )
    }
  }

  retornarConteudoSelecao(aData,aNumber){
    return ( 
      <option 
        id={aData.id}
        key={aData.id}
      >{ `${aNumber} - ${aData.ds_materia}` }</option> )
  }  

  retornarImgDelete(){
    if (this.state.cd_campo.length !== 0){
      return (this.state.hover)?(this.state.deletehover):(this.state.delete)
    }    
  }

  retornarBotaoDelete(){
    if ((!this.state.cadastrar)&&(this.state.cd_campo.length !== 0)){
    return (
      <OverlayDelete 
        className="div-edit-delete" 
        popoverTitle={this.props.popoverTitle}
        isAluno={true} 
        paddingTop={37} 
        onDeleteOverlay={()=>this.onRemover()}
      />)
    }
    return <div className="div-img" />
  }

  async onRemover(){
    await this.props.onRemover(this.state.cd_campo);
    const cd_campo = parseInt(this.state.cd_campo);
    var lvListaAux = this.props.listaCad;
    const lvIndex = lvListaAux.findIndex((e)=>e.id === cd_campo);
    if (lvIndex === -1) {
      this.limparCampos()
    }
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
        onHide={()=>this.handleCancel()} >
        <Modal.Header  className="modal-header-materia" closeButton >
          <Modal.Title  style={{ fontSize:20 }} >
            {(this.state.cadastrar)?(this.props.tituloModalCad):(this.props.tituloModalEdit)}
          </Modal.Title>
          <div className="div-img-header" >
              <ImageModal 
                tooltipName={(this.state.cadastrar)?(this.props.tituloModalEdit):(this.props.tituloModalCad)}
                img={(this.state.cadastrar)?(edit):(add)}
                alt={(this.state.cadastrar)?("E"):("A")}
                onClick={()=>this.setState({cadastrar: (this.state.cadastrar)?(false):(true), cd_campo: '', ds_campo: ''})}
              />
            </div>
        </Modal.Header >
        <Modal.Body className={(this.state.cadastrar)?("modal-body-materia"):("modal-body-materia-effect")} >
          <div className="d-flex">
            {this.retornarCampo()} 
            {this.retornarBotaoDelete()}       
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
export default ModalCadGenerico;