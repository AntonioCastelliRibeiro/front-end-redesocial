import React from 'react';
import './style.scss';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import CampoPadrao from '../CampoPadrao';

class ModalConfigProfessor extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      chkStateAtivo: false,
      show: true,  
      nm_professor: '',
      ds_senha: '',
      ds_senhaNova: '',
      ds_senhaNovaRepeat: '',
      mensagem: '',
    //  alertar: false,
      campo: '',

      /* Alerta */
      alertaUsuario: { alertar: false, mensagem: '' },
      alertaSenhaAtual:  { alertar: false, mensagem: '' },
      alertaNovaSenha: { alertar: false, mensagem: '' },
      alertaNovaSenhaRepeat: { alertar: false, mensagem: '' },

    }

    this.validarDados = this.validarDados.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.onSubmitModalConfig = this.onSubmitModalConfig.bind(this);
  }

  componentDidMount(){
    this.setState({ nm_professor: this.props.name })
  }

  handleCancel(){
    this.setState({
      show: false,
      alertar: false,
      nm_professor: this.props.name,
      ds_senha: '',
      ds_senhaNova: '',
      ds_senhaNovaRepeat: ''
    });
    this.props.onCloseModalConfig();
  }
  
  setarEstadoAlerta(error){
    const lvCampo = error.response.data.campo;
    const lvMensagem = error.response.data.mensagem;
    if (lvCampo === 'SenhaAtual') { this.setState( {alertaSenhaAtual: { alertar: true, mensagem: lvMensagem}})} 
    if (lvCampo === 'Senha') { this.setState( {alertaNovaSenha: { alertar: true, mensagem: lvMensagem}})}
  }
  
  validarDados(){
    const {nm_professor, ds_senha, ds_senhaNova, ds_senhaNovaRepeat} = this.state;
    var lvAlertou = false;
    if (nm_professor === ''){this.setState({alertaUsuario: {alertar: true, mensagem: 'Nome de Usuário Inválido'}}); lvAlertou = true}
    if (ds_senha === ''){ this.setState({alertaSenhaAtual: {alertar: true, mensagem:  'Senha inválida'}}); lvAlertou = true}
    if (this.state.chkStateAtivo){
      if (ds_senhaNova ===''){this.setState({alertaNovaSenha: {alertar: true, mensagem:  'Senha inválida'}}); lvAlertou = true} 
      if (ds_senhaNovaRepeat === ''){this.setState({alertaNovaSenhaRepeat: {alertar: true, mensagem:  'Senha inválida'}}); lvAlertou = true} 
    }
    return lvAlertou;
  }

  async onSubmitModalConfig() {
    if (this.validarDados()) {return}
    const { nm_professor, ds_senha, ds_senhaNova, ds_senhaNovaRepeat } = this.state;
    const lvToken = this.props.token;
    const lvApi = this.props.api;
    try {
      var teacher  = await lvApi.put('/teacher', {
        headers: {
          'authorization': `Bearer ${lvToken}`,
          isAltearSenha: this.state.chkStateAtivo,
          isProfessor: this.props.isProfessor,
          nm_professor: nm_professor,
          ds_senha: ds_senha,
          ds_senhaNova: ds_senhaNova,
          ds_senhaNovaRepeat: ds_senhaNovaRepeat }
        });
      this.props.onSubmitModalConfig(teacher.data.nm_professor);
      this.handleCancel();
    } catch (error) { this.setarEstadoAlerta(error) }
  }

  render() {
    return (
      <>      
      <Modal size="lg"
        scrollable={true}
        aria-labelledby="contained-modal-title-vcenter"
        centered 
        show={this.state.show} 
        onHide={this.handleCancel}>
        <Modal.Header  closeButton>
          <Modal.Title>Configurações</Modal.Title>
        </Modal.Header>
        <Modal.Body >
        <CampoPadrao
          id="form-usuario"
          validated={((!this.state.alertaUsuario.alertar) && this.state.nm_professor.length > 0)} 
          controlId="formUsuario"
          label="Trocar Nome de Usuário"
          type="input" 
          placeholder="Nome" 
          value={this.state.nm_professor}
          onChange={(e)=>(this.setState({ nm_professor: e }))}
          onKeyPress={(e)=>(this.setState({ alertaUsuario: false }))}  
          onSubmit={this.onSubmitModalConfig}
          isInvalid={this.state.alertaUsuario.alertar}
          alerta={this.state.alertaUsuario.alertar}
          alertaMensagem={this.state.alertaUsuario.mensagem}
        />
        <CampoPadrao
          id="form-senhaAtual"
          validated={((!this.state.alertaSenhaAtual.alertar) && this.state.ds_senha.length > 0)} 
          controlId="formTrocarSenha"
          label="Senha Atual"
          type="password" 
          placeholder="Senha Atual" 
          value={this.state.ds_senha}
          onChange={(e)=>(this.setState({ ds_senha: e }))}
          onKeyPress={(e)=>(this.setState({ alertaSenhaAtual: false }))} 
          onSubmit={this.onSubmitModalConfig}
          isInvalid={this.state.alertaSenhaAtual.alertar}
          alerta={this.state.alertaSenhaAtual.alertar}
          alertaMensagem={this.state.alertaSenhaAtual.mensagem}
        />
        <Form.Group controlId="chkAlterar">
          <Form.Check 
          tabIndex={(!this.state.chkStateAtivo) ? ("") : ("-1")}
          type="checkbox" 
          label="Alterar Senha" 
          defaultChecked={this.state.chkStateAtivo}
          onClick={(e)=>(
            this.setState({ 
              chkStateAtivo: (this.state.chkStateAtivo) ? (false) : (true), 
              alertaNovaSenha: false,  
              alertaNovaSenhaRepeat: false}))}/>
        </Form.Group>
        <div className="div-novasenha">
          <CampoPadrao
            disabled={!this.state.chkStateAtivo}
            id="form-novaSenha" 
            validated={((!this.state.alertaNovaSenha.alertar) && this.state.ds_senhaNova.length > 0)}
            controlId="formTrocarSenhaNova"
            label="Nova Senha"
            type="password" 
            placeholder="Nova Senha" 
            value={this.state.ds_senhaNova}
            onChange={(e)=>(this.setState({ ds_senhaNova: e }))}
            onKeyPress={(e)=>(this.setState( { alertaNovaSenha: false }))} 
            onSubmit={this.onSubmitModalConfig}
            isInvalid={this.state.alertaNovaSenha.alertar}
            alerta={this.state.alertaNovaSenha.alertar}
            alertaMensagem={this.state.alertaNovaSenha.mensagem}
          />
        </div>
        <div className="div-repitasenha">
          <CampoPadrao
            disabled={!this.state.chkStateAtivo}
            id="form-novaSenhaRepeat" 
            validated={((!this.state.alertaNovaSenhaRepeat.alertar) && this.state.ds_senhaNovaRepeat.length > 0)}
            controlId="formTrocarSenhaNovaRepeat"
            type="password" 
            placeholder="Repita a Senha"
            value={this.state.ds_senhaNovaRepeat}
            onChange={(e)=>(this.setState({ ds_senhaNovaRepeat: e }))} 
            onKeyPress={(e)=>(this.setState({ alertaNovaSenhaRepeat: false }))} 
            onSubmit={this.onSubmitModalConfig}
            isInvalid={this.state.alertaNovaSenhaRepeat.alertar}
            alerta={this.state.alertaNovaSenhaRepeat.alertar}
            alertaMensagem={this.state.alertaNovaSenhaRepeat.mensagem} 
          />
        </div>
        </Modal.Body>
        <Modal.Footer style={{padding: 5}}>
          {/* <Button tabIndex="-1" variant="secondary" onClick={this.handleCancel}>
            Cancelar
          </Button> */}
          <Button size="lg" variant="dark" block onClick={this.onSubmitModalConfig}>
            Salvar Configurações
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    );  
  }
}
export default ModalConfigProfessor;