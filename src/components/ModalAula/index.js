import React from 'react';

import {Modal, Button, Form, Tab} from 'react-bootstrap';

import CampoPadrao from '../CampoPadrao';
import AlertaPadrao from '../AlertaPadrao';
import ListaPergunta from '../ListaPergunta';

class ModalAula extends React.Component {  
  constructor(props){
    super(props)
    this.state ={
      show: false,

      cd_pin: '',
      ds_conteudo: '',
      ds_email: '',
      ds_instituicao: '',
      ds_materia: '',
      nm_aluno: '',
      nm_professor: '',
      cd_professor: '',
      st_pin: '',

      tabName: '',

      ds_duvida: '',
      st_anonimo: false,

      alertaDuvida: false,
      mensagem: '',
    }

    this.alerta = {
      spinnerListaPergunta: true,
      alertar: false,
      mensagem: '',
    }

    this.listaPergunta =[];/* [{
      id: '',
      ds_pergunta: '',
      ds_resposta: '',
      st_anonimo: '',
      st_pergunta: ''
    }]*/

    this.fecharModal = this.fecharModal.bind(this);
    this.onSubmitPergunta = this.onSubmitPergunta.bind(this);
    this.carregarListaPergunta = this.carregarListaPergunta.bind(this);
  }  

  componentDidMount(){
    this.setState({show: true});
    //this.carregarDadosAula();
  }

  fecharModal(){
    this.props.onClose();
  }

  validarDados(){
    const lvDuvida = this.state.ds_duvida.trim();
    if (lvDuvida.length === 0) {
      this.setState({ alertaDuvida: true, mensagem: 'Pergunta inválida!' })
      return true;
    }
  }

  limparCamposDuvida(){
    this.setState({
      ds_duvida: '',
      st_anonimo: false,
    });
  }

  async onSubmitPergunta(e){
    e.preventDefault();
    if (this.validarDados()) {return}
    const { ds_duvida, st_anonimo } = this.state;
    const cd_pin = this.props.pin;
    const lvToken = this.props.token;
    const lvApi = this.props.api;
    try {
      const lvPergunta = await lvApi.post('/pergunta', {
        headers: {
          'authorization': `Bearer ${lvToken}`,
          cd_pin: cd_pin,    
          cd_professor: this.props.cd_professor,
          ds_duvida: ds_duvida,
          st_anonimo: st_anonimo
        },
      });
      this.limparCamposDuvida();
      this.props.onSubmitAula(lvPergunta.data.pergunta);
      this.setarNovaPergunta(lvPergunta.data.pergunta);
    } catch (error) { 
      console.log(error);
    }   
  }

  setarNovaPergunta(aPergunta){
    if (this.listaPergunta.length === 0) {return} // só atualizara a lista se ela ja estiver carregada
    this.setState(this.listaPergunta = [{
      id: aPergunta.id,
      ds_pergunta: aPergunta.ds_pergunta,
      st_anonimo: aPergunta.st_anonimo,
      st_pergunta: aPergunta.st_pergunta
      }, ...this.listaPergunta]);
  }

   retornarAlerta(){
    if (this.state.alertaDuvida) {
      return <AlertaPadrao mensagem={this.state.mensagem}/>
    }
  }

  setarAlerta(aData){
    this.setState(this.alerta = {
      spinnerListaPergunta: false,
      alertar: true,
      mensagem: aData.mensagem
    })
  }

  setarListaPergunta(aListaPergunta){
    this.setState(this.listaPergunta = aListaPergunta);
    this.setState(this.alerta = { spinnerListaPergunta: false});
  }

  async carregarListaPergunta(){
    if(this.listaPergunta.length !== 0){return} // só recarregará se nao houver lista montada
    const lvToken = this.props.token;
    const lvApi = this.props.api;
    try {
      const lvPerguntaLista = await lvApi.get('/perguntaLista', {  
        headers: { 
          'authorization': `Bearer ${lvToken}`,
          cd_pin: this.props.pin  
      }});
      if (lvPerguntaLista.data) {this.setarListaPergunta(lvPerguntaLista.data.listaPergunta)}
    } catch (error) {
      this.setarAlerta(error.response.data);
    }  
  }

    
  retornarPerguntaConvertida(aResposta){
    return {
      id: aResposta.id,
      ds_pergunta: aResposta.ds_pergunta,
      ds_resposta: aResposta.ds_resposta,
      st_anonimo: aResposta.st_anonimo,
      st_pergunta: aResposta.st_pergunta
    }
  }

  verificarAtribuirRespostaPergunta(aResposta){
    if (aResposta.cd_aluno !== this.props.cd_aluno || aResposta.cd_pin !== this.props.pin) {return}
    const {st_pergunta, ds_resposta, id} = aResposta;
    const lvIndex = this.listaPergunta.findIndex((e)=>e.id === id); 

    if(this.listaPergunta.length !== 0) { 
      if(this.listaPergunta[lvIndex].st_pergunta === 'F') {return} // para evitar que atualize o estado varias vezes...
      var lvListaAux = this.listaPergunta;
      lvListaAux[lvIndex].st_pergunta = st_pergunta; // atualiza para respondida
      lvListaAux[lvIndex].ds_resposta = ds_resposta; // atualiza resposta
      this.setState(this.listaPergunta =  lvListaAux); // para atualizar o estado dos componentes....
    }
  }

  retornarListaPergunta(){
    return ( 
      <ListaPergunta 
        api={this.props.api}
        alerta={this.alerta}
        socket={this.props.socket}
        listaPergunta={this.listaPergunta}
        carregarListaPergunta={this.carregarListaPergunta}
        verificarAtribuirRespostaPergunta={(e)=>this.verificarAtribuirRespostaPergunta(e)}
        verificarRemoverPerguntaAluno={(e)=>this.verificarRemoverPerguntaAluno(e)}
      />
    )
  }

  verificarRemoverPerguntaAluno(aData){
    const {id, cd_aluno, cd_pin} = aData;
    if (cd_aluno !== this.props.cd_aluno || cd_pin !== this.props.pin) {return}

    this.listaPergunta = this.state.listaPergunta;
    const lvIndex = this.listaPergunta.findIndex((e)=>e.id === id); 
    console.log(lvIndex)
    if (lvIndex === -1){return false}
    this.listaPergunta.splice(lvIndex, 1);
    this.setState({listaPergunta: this.listaPergunta});
  } 

  onChangeTab(e){
    this.setState({ tabName: e });
    if (e === 'perguntas') {this.carregarListaPergunta()}
  }

  retornarConteudoTabAulaPergunta(){
    const { conteudo, professor, pin, mAula } = this.props;
    if (!mAula) {return false}
    return (
      <>
      <Tab style={{ margin: 10 }} key="a" eventKey="aula" title="Aula" >
        <Form.Group style={{ marginTop: 10 }} controlId="formBasicCheckbox">
        <CampoPadrao retornarForm="false"  disabled label="Professor" value={professor} />
        <CampoPadrao  retornarForm="false" disabled label="Pin" value={pin} />
        <Form.Label>Conteúdo</Form.Label>
        <Form.Control as="textarea" rows="6" disabled value={conteudo}/>
        </Form.Group>
      </Tab>
      <Tab style={{ margin: 10 }} key="p" eventKey="perguntas" title="Perguntas">
        {this.retornarListaPergunta()}
      </Tab>
      </>
    )
  }

  render() {
    const { materia, conteudo, professor, pin } = this.props;
    return (
      <>      
      <Modal size="lg"
        scrollable={true}
        aria-labelledby="contained-modal-title-vcenter"
        centered 
        show={this.state.show} 
        onHide={this.fecharModal}>
       
        <Modal.Body style={{padding: "5px 10px 10px 10px"}}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: 20 }}>{`Aula de ${materia}`}</Modal.Title>
          </Modal.Header>
          <Form validated={(!this.state.alertaDuvida) && (this.state.tabName === 'perguntar') && (this.state.ds_duvida.length > 0)} >
            {/* <Tabs 
              onSelect={(e)=>this.onChangeTab(e)} 
              style={{ marginTop: 15 }} 
              defaultActiveKey={(mAula?('aula'):('perguntar'))} 
              transition={false} 
              id="noanim-tab-example"
            > */}
              {/* <Tab style={{ margin: 10 }} key="a" eventKey="aula" title="Aula" disabled={!mAula} > */}
                <Form.Group style={{ marginTop: 10 }} controlId="formBasicCheckbox">
                <CampoPadrao retornarForm="false"  disabled label="Professor" value={professor} />
                <CampoPadrao  retornarForm="false" disabled label="Pin" value={pin} />
                <Form.Label>Conteúdo</Form.Label>
                <Form.Control as="textarea" rows="6" disabled value={conteudo}/>
                </Form.Group>
              {/* </Tab>
              <Tab style={{ margin: 10 }} key="p" eventKey="perguntas" title="Perguntas" disabled={!mAula} >
                {this.retornarListaPergunta()}
              </Tab> */}
              {/* <Tab style={{ margin: 10 }} key="n" eventKey="perguntar" title="Perguntar"> */}
                {/* <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label style={{ marginTop:10 }} >Descreva sua dúvida</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows="6" 
                    placeholder="Qual é a sua dúvida?" 
                    value={this.state.ds_duvida}
                    onChange={(e)=>(this.setState({ alertaDuvida: false, ds_duvida: e.target.value }))}
                    isInvalid={this.state.alertaDuvida} 
                    />
                    {this.retornarAlerta()}
                </Form.Group>
                <Form.Group style={{ marginTop: 10 }} controlId="formBasicCheckbox">
                  <OverlayTrigger
                    key="Over"
                    placement="bottom-start"
                    overlay={
                      <Tooltip id="bottom">
                        <strong> Seu nome não será exposto</strong>.
                      </Tooltip>
                    }
                  >
                  <Form.Check 
                    type="checkbox" 
                    label="Pergunta Anônima" 
                    checked={this.state.st_anonimo}
                    value={this.state.st_anonimo}
                    onChange={(e)=>(this.setState({ st_anonimo: (this.state.st_anonimo === false) ? (true) : (false)}))}
                    />
                  </OverlayTrigger>{' '}
                </Form.Group>
                <Form.Group>
                    <Button size="lg" onClick={this.onSubmitPergunta} block> Perguntar </Button>
                </Form.Group>       */}
              {/* </Tab>
            </Tabs>         */}
          </Form>
        </Modal.Body>
        <Modal.Footer >
          <Button tabIndex="-1" variant="secondary" onClick={this.fecharModal}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    );  
  }
}
export default ModalAula;