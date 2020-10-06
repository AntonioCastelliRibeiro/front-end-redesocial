import React from 'react';
import './styles.scss';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ListaPin from '../ListaPin';

import ModalCadastro from '../ModalCadastro';
// import ModalCadastrarInstituicao from '../ModalCadastrarInstituicao';
// import ModalCadastrarMateria from '../ModalCadastrarMateria';
// import ModalPergunta from '../ModalPergunta';

import NotificacaoPadrao from '../NotificacaoPadrao';

class ModalNovoPin extends React.Component {  
  constructor(props){
    super(props)
    this.state = {

      /* Modal */
      modalPergunta: false,
      mCd_pin: '',
      modalInstituicao: false,
      modalMateria: false,

      listaMateria: '',
      listaInstituicao: '',

      /* Tela Atual */
      show: true,  

      /* Conteúdo Campos */
      ds_conteudo: '',
      cd_instituicao: '',
      ds_instituicao: '',
      cd_materia: '',
      ds_materia: '',
      mensagem: '',

      /* Alerta */
      alertar: false,
      campoConteudo: false,
      campoMateria: false,
      campoInstituicao: false,

      /* Notificacao */
      listaNotificacao: []
      // {
      // notIns: true,
      // notPin: true,
      // notiMat: false,
      // mensagem
      // }
    }

    /* Listas de Conteúdo */
    // this.listaInstituicao = [{
    //   id: '',
    //   ds_instituicao: ''
    // }]

    // this.listaMateria = [{
    //   id: '',
    //   ds_materia: ''
    // }]

    /* Lista Pin */
    this.listaPin =''; 
    // [{
    //   id:  '',
    //   ds_conteudo: '', 
    //   st_pin: '',
    //   ds_instituicao: '',
    //   ds_materia: '',
    // }]

    this.alerta = {
      spinner: true,
      alertar: false,
      mensagem: '',
    }
    
    this.handleCancel = this.handleCancel.bind(this);
    
    this.onCadastrarInstituicao = this.onCadastrarInstituicao.bind(this);
    this.onCadastrarMateria = this.onCadastrarMateria.bind(this);
    this.retornarConteudoSelecaoInst = this.retornarConteudoSelecaoInst.bind(this);
    this.retornarConteudoSelecaoMat = this.retornarConteudoSelecaoMat.bind(this);

    this.carregarInstituicao = this.carregarInstituicao.bind(this);
    this.retornarListaSelecaoInst = this.retornarListaSelecaoInst.bind(this);
    this.retornarListaSelecaoMat = this.retornarListaSelecaoMat.bind(this);

    this.carregarListaPin = this.carregarListaPin.bind(this);
  }

  componentDidMount(){
    this.carregarInstituicao();
    this.carregarMateria();
  }

  limparDadosPgPin(){
    this.setState({  cd_materia: '', ds_materia: '', cd_instituicao: '', ds_instituicao: '', ds_conteudo: '' });
  }

  handleCancel(){
    this.limparDadosPgPin();
    this.props.onClose();
  }
  
  setarEstadoAlerta(error){
    var lvMensagem, lvCampo = '';
    if (error.response.data.nomeUsuario) {lvMensagem = error.response.data.nomeUsuario; lvCampo = 'nomeUsuario';
    } else if (error.response.data.senhaAtual) {lvMensagem = error.response.data.senhaAtual; lvCampo = 'senhaAtual';
    } else if (error.response.data.senhaNova) {lvMensagem = error.response.data.senhaNova; lvCampo = 'senhaNova';}
    this.setState({  alertar: true, mensagem: lvMensagem, campo: lvCampo });
  }
  
  validarDadosPin(){
    const nm_materia = this.state.ds_materia;
    const ds_instituicao = this.state.ds_instituicao;
    const ds_conteudo = this.state.ds_conteudo;
    var lvAlertou = false;
    if (nm_materia.trim() === '') { this.setState({ alertar: true, campoMateria: true }); lvAlertou = true}
    if (ds_instituicao.trim() === '' ) { this.setState({ alertar: true, campoInstituicao: true }); lvAlertou = true }
    if (ds_conteudo.trim() === '') { this.setState({ alertar: true, campoConteudo: true }); lvAlertou = true }
    return lvAlertou; 
  }

  setarEstadoPin(aData){
    this.setState({ notPin: true });
    if (this.listaPin.length === 0 && !this.alerta.alertar) {return} // só atualizara a lista se ela estiver carregada
    this.setState(this.listaPin = [{
      id:  aData.id,
      ds_conteudo: aData.ds_conteudo, 
      st_pin: aData.st_pin,
      ds_instituicao: this.state.ds_instituicao,
      ds_materia: this.state.ds_materia,
      }, ...this.listaPin]);
      this.setState(this.alerta = {alertar: false, mensagem: '', spinner: false})
  }

  async onSubmitModalPin(){
    if (this.validarDadosPin()) {return}
    const { cd_instituicao, cd_materia, ds_conteudo} = this.state;
    const lvToken = this.props.token;
    const lvApi = this.props.api;
    try {
      const lvPin = await lvApi.post('/pin', {
        headers: {
          'authorization': `Bearer ${lvToken}`,
          cd_instituicao: cd_instituicao,    
          cd_materia: cd_materia,
          ds_conteudo: ds_conteudo,
        },
      });
      if (lvPin.status === 200) {
        this.props.onAtualizarListaPin(lvPin.data.dadosPin);
        this.props.onAdicionarNotificacao();
        this.limparDadosPgPin();
      }
    } catch (error) { 
      this.setarEstadoAlerta(error);
    }   
  }

  onCadastrarInstituicao(e){
    e.preventDefault();
    this.setState({ modalInstituicao: true });
  }

  retornarConteudoSelecaoInst(aData, aNumber){
    return ( 
      <option 
        id={aData.id}
        key={aData.id}
      >{`${aNumber} - ${aData.ds_instituicao}` }</option> )
  }

  async carregarInstituicao(){
    const lvToken = this.props.token;
    const api = this.props.api;
    var lvInstituicao = await api.get('/instituicao', {
      headers: { 'authorization': `Bearer ${lvToken}` },
    });
    if (lvInstituicao.data.success){
      this.setState({listaInstituicao: lvInstituicao.data.instituicao});
    }
  }

  async carregarMateria(){
    const lvToken = this.props.token;
    const api = this.props.api;
    var lvMateria = await api.get('/materia', {
      headers: { 'authorization': `Bearer ${lvToken}` },
    });
    if (lvMateria.data.success){
      this.setState({listaMateria: lvMateria.data.materia});
    } 
  }

  retornarListaSelecaoInst(){
    const lvInstituicao = this.state.listaInstituicao;
    if (lvInstituicao){
    return (
      <>
      {lvInstituicao.map((aData,aNumber)=>(this.retornarConteudoSelecaoInst(aData,aNumber+1)))}
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

  retornarListaSelecaoMat(){
    const lvMateria = this.state.listaMateria;
    if (lvMateria){
    return (
      <>
      {lvMateria.map((aData,aNumber)=>(this.retornarConteudoSelecaoMat(aData,aNumber+1)))}
      </>
      )
    }
  }

  retornarModal(){
    if (this.state.modalInstituicao || this.state.modalMateria){
      return (
        <ModalCadastro
          api={this.props.api}
          token={this.props.token}
          isMateria={this.state.modalMateria}
          listaMateria={this.state.listaMateria}
          isInstituicao={this.state.modalInstituicao}
          listaInstituicao={this.state.listaInstituicao}
          atualizarListaMateria={(e)=>this.atualizarListaMateria(e)}
          adicionarMateriaLista={(e)=>this.adicionarMateriaLista(e)}
          adicionarInstituicaoLista={(e)=>this.adicionarInstituicaoLista(e)}
          atualizarListaInstituicao={(e)=>this.atualizarListaInstituicao(e)}
          onClose={()=>this.setState({modalInstituicao: false, modalMateria: false})}
          atualizarListaMatRemov={(e)=>this.atualizarListaMatRemov(e)}
          atualizarListaInstRemov={(e)=>this.atualizarListaInstRemov(e)}

         />
      )
    }
    // return false;
    // if (this.state.modalInstituicao){
    //   return (
    //     <ModalCadastrarInstituicao 
    //       api={this.props.api}
    //       token={this.props.token}
    //       // onSubmitInstituicao={(e)=>(this.setState({ notIns: true }))}
    //       onSubmitInstituicao={(e)=>(
    //         this.adicionarNotificacaoPadrao({
    //           nameNotification: "Instituicao", 
    //           message: "Instituição cadastrada com sucesso",
    //           sec: "2"
    //         }))}
    //       onRecarregarInstituicao={(e)=>(this.carregarInstituicao())}
    //       onClose={(e)=>(this.setState({ modalInstituicao: false }))}
    //     />
    //   )
    // } else if (this.state.modalMateria){
    //   return (
    //     <ModalCadastrarMateria 
    //       api={this.props.api}
    //       token={this.props.token}
    //       listaMateria={this.listaMateria}
    //       onSubmitMateria={(e)=>(this.setState({ notMat: true }))}
    //       onRecarregarMateria={(e)=>(this.carregarMateria())}
    //       onClose={(e)=>(this.setState({ modalMateria: false }))}
    //     />
    //   )
    // } else if (this.state.modalPergunta){
    //   return(
    //     <ModalPergunta 
    //       api={this.props.api}
    //       socket={this.props.socket}
    //       token={this.props.token}
    //       pin={this.state.mCd_pin}
    //       cd_professor={this.props.cd_professor}
    //       onLimparPin={()=>this.setState({mCd_pin: ''})}
    //       onClosePergunta={()=>{this.setState({ modalPergunta: false })}}
    //     />
    //   )
    // } 
  }

  async adicionarMateriaLista(aData){
    const {cd_materia, ds_materia} = aData;
    var lvListaAux = this.state.listaMateria;
    lvListaAux.push({id: cd_materia, ds_materia: ds_materia});
    this.setState({listaMateria: lvListaAux})
    this.props.onSetarNotificacao("Matéria cadastrada");
  }

  async atualizarListaMateria(aData){
    const lvCdMateria = parseInt(aData.cd_campo);
    const lvDsMateria = aData.ds_campo;
    var lvListaAux = this.state.listaMateria;

    const lvIndex = lvListaAux.findIndex((e)=>e.id === lvCdMateria)
    if (lvIndex === -1) return false

    lvListaAux[lvIndex].ds_materia = lvDsMateria;
    this.setState({listaMateria: lvListaAux})
    this.props.onSetarNotificacao("Matéria atualizada");
  }

  async atualizarListaInstRemov(aData){
    const lvCdInst = parseInt(aData);
    var lvListaAux = this.state.listaInstituicao;
    const lvIndex = lvListaAux.findIndex((e)=>e.id === lvCdInst)
    if (lvIndex === -1) return false
    lvListaAux.splice(lvIndex, 1);
    this.setState({listaInstituicao: lvListaAux})
    this.props.onSetarNotificacao("Instituição removida");
  }

  async atualizarListaMatRemov(aData){
    const lvCdMateria = parseInt(aData);
    var lvListaAux = this.state.listaMateria;
    console.log(aData)
    const lvIndex = lvListaAux.findIndex((e)=>e.id === lvCdMateria)
    if (lvIndex === -1) return false
    lvListaAux.splice(lvIndex, 1);
    this.setState({listaMateria: lvListaAux})
    this.props.onSetarNotificacao("Matéria removida");
  }

  async adicionarInstituicaoLista(aData){
    const {cd_instituicao, ds_instituicao} = aData;
    var lvListaAux = this.state.listaInstituicao;
    lvListaAux.push({id: cd_instituicao, ds_instituicao: ds_instituicao});
    this.setState({listaInstituicao: lvListaAux})
    this.props.onSetarNotificacao("Instituição cadastrada");
  }

  async atualizarListaInstituicao(aData){
    const lvCdInst = parseInt(aData.cd_campo);
    const lvDsInst = aData.ds_campo;
    var lvListaAux = this.state.listaInstituicao;

    const lvIndex = lvListaAux.findIndex((e)=>e.id === lvCdInst)
    if (lvIndex === -1) return false

    lvListaAux[lvIndex].ds_instituicao = lvDsInst;
    this.setState({listaInstituicao: lvListaAux})
    this.props.onSetarNotificacao("Instituição atualizada");
  }

  retornarAlertaConteudo(){
    if (this.state.campoConteudo){
      return (
          <Form.Control.Feedback type="invalid">
            Conteúdo Inválido
          </Form.Control.Feedback>
      )
    }
  }

  retornarAlertaInstituicao(){
    if (this.state.campoInstituicao){
      return (
        <Form.Control.Feedback type="invalid">
          Instituição Inválida
        </Form.Control.Feedback>
      )
    }
  }

  retornarAlertaMateria(){
    if (this.state.campoMateria){
      return (
        <Form.Control.Feedback type="invalid">
          Matéria Inválida
        </Form.Control.Feedback>
      )
    }
  }

  onCadastrarMateria(e){
    e.preventDefault();
    this.setState({ modalMateria: true });
  }

  setarListaPin(aListaPin){
    this.setState(this.listaPin = aListaPin);
    this.setState(this.alerta = {alertar: false, spinner: false });
  }

  setarAlerta(aMensagem){
    this.setState(this.alerta = {
      spinner: false,
      alertar: true,
      mensagem: aMensagem
    })
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
      this.setarAlerta(error.response.data);
    }  
  }

  retornarListaPin(){
    if (this.state.tabName ==='pinGerado') {
      return (
        <ListaPin 
          api={this.props.api}
          token={this.props.token}
          listaPin={this.listaPin}
          carregarListaPin={this.carregarListaPin}
          alerta={this.alerta}
          onClickPergunta={(e)=>{this.setState({ modalPergunta: true, mCd_pin: e })}}
        />
      )
    }
  }

  retornarStyleModalPin(){
    if (this.state.modalPergunta || this.state.modalInstituicao || this.state.modalMateria){
    return ({ opacity: 0 }) }
  }

  adicionarNotificacaoPadrao(aNotificacao){
    this.setState({listaNotificacao: [aNotificacao, ...this.state.listaNotificacao]});
  }
  
  onFecharAlerta(aId){
    this.listaNotificacaoAux = this.state.listaNotificacao;
    this.listaNotificacaoAux.splice(aId,1); // remove pelo index da lista
    if (this.listaNotificacaoAux.length === 0) {this.setState({listaNotificacao: []})} // zera a lista caso seja o unico item a remov.
    else {this.setState({listaNotificacao: this.listaNotificacaoAux})}
  }

  retornarNotificacaoItem(){
    if (this.state.notIns){
      return (
        <NotificacaoPadrao 
          nameNotification="Notificação"
          message="Instituição cadastrada com sucesso"
          sec="2"
          listaNotificacao={this.state.listaNotificacao}
          onFecharAlerta={(e)=>this.onFecharAlerta(e)}
          />
      )
    }
    if (this.state.notPin){
      return (
        <NotificacaoPadrao 
          nameNotification="Notificação"
          message="Pin gerado com sucesso"
          sec="2"
          listaNotificacao={this.state.listaNotificacao}
          onFecharAlerta={(e)=>this.onFecharAlerta(e)}
        />
      )
    }
    if (this.state.notMat){
      return (
        <NotificacaoPadrao 
        nameNotification="Notificação"
        message="Matéria gerada com sucesso"
        sec="2"
        listaNotificacao={this.state.listaNotificacao}
        onFecharAlerta={(e)=>this.onFecharAlerta(e)}
      />
      )
    }
  }
  
  retornarNotificacaoPadrao(){
    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
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

  render() {
    return (
      <>      
      <Modal
        style={this.retornarStyleModalPin()} 
        size="lg"        
        scrollable={true}
        aria-labelledby="contained-modal-title-vcenter"
        centered 
        show={this.state.show} 
        onHide={this.handleCancel}>
          {this.retornarNotificacaoPadrao()}
        <Modal.Body>
        <Modal.Header className="modal-header-pin" closeButton>
          <Modal.Title>Pin</Modal.Title>
        </Modal.Header>
          {/* <Tabs 
            transition={false} 
            style={{ margin: 0, marginTop: 10, marginBottom: 10 }} 
            onSelect={(e)=>(this.setState({ tabName: e }))} 
            defaultActiveKey="Cad"  > */}
            {/* <Tab 
              title="Cadastro de Pin" 
              eventKey="Cad" 
            > */}
                <Form 
                  validated={ this.state.campoMateria || this.state.campoInstituicao || this.state.campoConteudo} 
                  id="form-principal"  >
                  <Form.Group  controlId="formUsuario" style={{marginBottom: 2 }}>
                    <Form.Label style={{marginBottom: 2 }} >Seleção de Matéria</Form.Label>
                    <Form.Control   
                      as="select"
                      custom
                      isInvalid={this.state.cd_materia === 0 && this.state.campoMateria}
                      isValid={this.state.ds_materia.trim() !== '' && !this.state.campoMateria }
                      required={this.state.campoMateria}
                      value={this.state.ds_materia}
                      onChange={(e)=>(this.setState({
                        cd_materia: e.target.selectedOptions[0].id,
                        ds_materia: e.target.value,
                        campoMateria: false,
                        }))}
                    > 
                      <option id="0" key="0"></option>
                        {this.retornarListaSelecaoMat()}
                      </Form.Control >
                        {this.retornarAlertaMateria()}
                        <Button 
                        style={{display:"contents"}}
                        variant="link" 
                        tabIndex="-1"
                        href="Cadastrar Matéria" 
                        onClick={this.onCadastrarMateria}>Cadastrar/Editar Matéria
                      </Button>
                  </Form.Group>

                  <Form.Group style={{marginBottom: 2 }} controlId="formTrocarSenha">
                    <Form.Label style={{marginBottom: 2 }} >Seleção de Instituição</Form.Label>
                      <Form.Control 
                        as="select"
                        custom
                        isInvalid={this.state.ds_instituicao.trim() === '' && this.state.campoMateria}
                        isValid={this.state.ds_instituicao.trim() !== '' && !this.state.campoMateria}
                        required={this.state.campoMateria}
                        value={this.state.ds_instituicao}
                        onChange={(e)=>(this.setState({
                          cd_instituicao: e.target.selectedOptions[0].id,
                          ds_instituicao: e.target.value,
                          campoInstituicao: false
                          }))}
                        >
                        <option id="0" key="0"></option>
                        {this.retornarListaSelecaoInst()}
                      </Form.Control>
                      {this.retornarAlertaInstituicao()}
                      <Button 
                        style={{display:"contents"}}
                        variant="link" 
                        tabIndex="-1"
                        href="Cadastrar Insituição"                 
                        onClick={this.onCadastrarInstituicao}>Cadastrar/Editar Instituição
                      </Button>
                  </Form.Group>
                      
                  <Form.Group style={{marginBottom: 9 }} controlId="exampleForm.ControlTextarea1">
                    <Form.Label style={{marginBottom: 2 }}>Conteúdo</Form.Label>
                    <Form.Control 
                      placeholder="Conteúdo da aula"
                      as="textarea" 
                      rows="3" 
                      value={this.state.ds_conteudo}
                      onChange={(e)=>(this.setState({ ds_conteudo: e.target.value }))}
                      onKeyPress={(e)=>(this.setState({ campoConteudo: false }))} 
                      isValid={this.state.ds_conteudo.trim() !== '' && !this.state.campoConteudo}
                      isInvalid={this.state.ds_conteudo.trim() === '' && this.state.campoConteudo}
                      required={this.state.campoConteudo}
                      />
                      {this.retornarAlertaConteudo()}
                  </Form.Group>
                </Form>
            {/* </Tab> */}
              {/* <Tab transition={false} style={{ margin: 10 }} key="p" eventKey="pinGerado" title="Pins Gerados">
                {this.retornarListaPin()}
              </Tab> */}
          {/* </Tabs> */}
        </Modal.Body>
        <Modal.Footer style={{padding:5}} >
          {/* <Button tabIndex="-1" variant="secondary" onClick={this.handleCancel}>
            Cancelar
          </Button> */}
          <Button size="lg" variant="dark" onClick={()=>this.onSubmitModalPin()} block>
            Gerar Pin
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        {this.retornarModal()}
      </div>
    </>

    );  
  }
}
export default ModalNovoPin;