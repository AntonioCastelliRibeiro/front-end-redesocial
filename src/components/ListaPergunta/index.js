import React from 'react';
import './styles.scss';

import SpinnerPadrao from '../Spinner';

import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

class ListaPergunta extends React.Component {

  componentDidMount(){
   // this.props.carregarListaPergunta();
  } 

  componentDidUpdate(aProps, aState){
    if(aProps.listaPergunta !== this.props.listaPergunta){return};
    this.props.socket.on('resposta.pergunta.aluno',(e)=>this.props.verificarAtribuirRespostaPergunta(e));
    this.props.socket.on('delete.pergunta.aluno', (e)=>(this.props.verificarRemoverPerguntaAluno(e)));
  }

  componentWillUnmount(){
    this.props.socket.off('resposta.pergunta.aluno');
    this.props.socket.off('delete.pergunta.aluno');
  }



  retornarResposta(aData){
    if(aData.st_pergunta === 'F'){
      return(
        <>
          <Form.Label>Resposta</Form.Label>
            <Form.Control 
              disabled
              as="textarea"
              value={aData.ds_resposta}
              rows="5"
            />
        </>
      )
    }
  }

  retornarConteudo(aData, aCont){
    return ( 
      <Card border="dark" as="li" key={aData.id}  style={{ margin: 2 }}>
        <a className="linkPergunta" href={`Pergunta ${aCont+1}`} onClick={(e)=>(e.preventDefault())}>
          <Accordion.Toggle 
            as={ListGroup} 
            eventKey={aData.id} 
          >
            <Form.Text  style={{ fontSize: 15, padding: "0.75rem 1.25rem" }}>
              {`Pergunta: ${aCont+1} - ${(aData.st_pergunta === 'A')? ('Não Respondida') : ('Respondida')}`}
            </Form.Text>
          </Accordion.Toggle>
      </a>
        <Accordion.Collapse eventKey={aData.id}>
          <Card.Body style={{padding: '0.8rem' }}>
            <Form.Label>Descrição</Form.Label>
            <Form.Control 
              disabled
              as="textarea"
              value={aData.ds_pergunta}
              rows="5"
            />
            {this.retornarResposta(aData)}
          </Card.Body>
        </Accordion.Collapse>  
      </Card> 

    )
}

  retornarListaPergunta(){
    const lvSpinner = this.props.alerta.spinnerListaPergunta;
    const lvListaPergunta = this.props.listaPergunta;
    const lvAlerta = this.props.alerta;
    if  (lvSpinner) {
      return (
        < SpinnerPadrao  span="5" offset="5" />      
      )
    } 
    else if (lvAlerta.alertar){
      return (
        <Card border="dark" as="li"  style={{ margin: 1 }}>
            <a className="linkPergunta" href={lvAlerta.mensagem} onClick={(e)=>(e.preventDefault())} >
            <Card.Header>
                  {lvAlerta.mensagem}
             </Card.Header>
             </a>
        </Card> 
      )
    }
    else {
      return (
          <Accordion >
            <Form.Group>
              {lvListaPergunta.map((aData, aCont)=>(this.retornarConteudo(aData, aCont)))}
            </Form.Group>
          </Accordion>
      )
    }    
  }

  render() {
    return  (
      this.retornarListaPergunta()
    )
  }
}
export default ListaPergunta;
