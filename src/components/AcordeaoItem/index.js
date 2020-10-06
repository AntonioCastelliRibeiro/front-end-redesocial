import React, { useState } from 'react';

import {ListGroup, Accordion, Card, Form, Button} from 'react-bootstrap';

export default function AcordeaoItem(props) {
  const [resposta, setResposta] = useState('');
  const [alertar, setAlertar] = useState('');

  function retornarDescricaoAluno(AStAnonimo, ANmAluno){
    return `Aluno: ${(AStAnonimo === 'N') ? (ANmAluno) : ('Anônimo') }` 
  }

  function retornarAlertaResposta(){
    if (alertar){
      return (
        <Form.Control.Feedback type="invalid">
          Resposta Inválida
        </Form.Control.Feedback>
      )
    }
  }

  function onChangeResposta(e){
    setResposta(e.target.value);
    setAlertar(false);
  }

  function onClickResposta(e){
    e.preventDefault();
    if (resposta.trim().length === 0) {return setAlertar(true)}   
    props.onClickRespostaPergunta({resposta: resposta, id:props.id})
  }

  function retornarTextAreaBotao(){
    const lvDsResposta = (!props.resposta)?(''):(props.resposta);
    if (props.tabName === 'Resp'){
      return(
        <>
          <Form.Label  style={{marginTop: 5}} >Resposta</Form.Label>
          <Form.Control 
            disabled
            as="textarea"
            value={lvDsResposta}
            rows="3"
          />
      </>
      )
    } else {
      return (
        <>
          <Form.Label  style={{marginTop: 5}} >Resposta</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Digite a resposta"
            value={resposta}
            onChange={(e)=>onChangeResposta(e)}
            rows="3"
            isValid={resposta.trim().length > 0}
            isInvalid={alertar}
            required={resposta.trim().length > 0}
          />
          {retornarAlertaResposta()}
          <Button 
            style={{marginTop: 7}} 
            size="lg" 
            block 
            onClick={(e)=>(onClickResposta(e))}
          >Responder</Button>
        </>
      )
    }
  }

  function onSetarEstadoPergunta(e){
    e.preventDefault();
    setResposta('');
    setAlertar(false);
  }

  return( 

    <Card 
      border="dark" 
      as="li" 
      key={props.id}
      style={{ marginTop: 2 }}>
        <a 
          id={props.id}
          key={props.id}
          href={(props.anonimo === 'N') ? (props.aluno) : ('Anônimo')}
          onClick={(e)=>(onSetarEstadoPergunta(e))}
          className="linkPergunta" 
        >
          <Accordion.Toggle 
            as={ListGroup} 
            eventKey={props.id}
            style={{ backgroundColor: "rgba(192, 194, 194, 0.582)" }}
          >
            <Form.Text 
              style={{ fontSize: 15, padding: "0.75rem 1.25rem" }} 
            >
              {retornarDescricaoAluno(props.anonimo, props.aluno)}
            </Form.Text>
          </Accordion.Toggle>
        </a>
        <Accordion.Collapse eventKey={props.id}>
          <Card.Body style={{padding: '0.8rem' }}>
            <Form.Label  style={{marginTop: 5}} >Descrição</Form.Label>
            <Form.Control 
              disabled
              data-key={props.id}
              as="textarea"
             // onBeforeInputCapture={(e)=>console.log(e.target.value)}
              value={props.pergunta}
              rows="3"
            />
            {retornarTextAreaBotao()}
          </Card.Body>
        </Accordion.Collapse>  
    </Card> 
  )
}