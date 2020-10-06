import React, {useState} from 'react';
import './styles.scss';

import {Card, Form, Image } from 'react-bootstrap';

import setacimaicon from '../../image/seta/setacima.svg';
import resposta from '../../image/resposta/resposta.svg';
import responder from '../../image/responder/responder.svg';
import responderhover from '../../image/responder/responderhover.svg';

import TextPergResp from '../TextPergResp';
import OverlayDelete from '../OverlayDelete';

export default function AcordeaoResposta(props){
  const [onResposta, setResposta] = useState('');
  const [onValidaResposta, setValidaResposta] = useState(false);
  const [onHoverResponder, setOnHoverResponder] = useState(false);

  function onClickResposta(){
    if(onResposta.trim().length === 0) {
      setValidaResposta(true)
    } else {
      setValidaResposta(false);
      props.onClickResposta({id: props.id, resposta: onResposta, professor: props.professor})
    }
  }

  function setarResposta(e){
    if (props.st_pergunta !== 'F'){
      setResposta(e);
      setValidaResposta(false);
    }
  }

  function retornarOverlayDelete(aVisible){
    if (aVisible){
      return (
        <OverlayDelete 
          isAluno={false}
          className={(props.st_pergunta === 'F')?("div-delete-resposta"):("div-delete")}
          onDeleteOverlay={()=>props.onDeleteOverlay()}
        />
      )
    }
  } 

  function retornarAlerta(){
    if(onValidaResposta){
      return  <p className="alerta-resposta" >Resposta Incorreta!</p>
    }
  }

  function retornarImageEnviar(){
    if (props.st_pergunta === 'A'){
      return (
        <div 
          className="div-enviar"
          onMouseEnter={()=>setOnHoverResponder((!onHoverResponder)?(true):(false))}
          onMouseLeave={()=>setOnHoverResponder((!onHoverResponder)?(true):(false))}
          onClick={()=>onClickResposta()}
        >      
          <Image 
            className="img-enviar"
            src={(!onHoverResponder)?(responder):(responderhover)}
        />
      </div>
      )
    }
  }

  function retornarDescricaoLabel(){
    if (props.isProfessor && props.st_pergunta === 'F'){
      return "Sua Resposta"
    } else if (props.isAluno) {
      return "Reposta"
    } else {
      return "Responder"
    }
  }

  function retornarConteudoResposta(){
    if (props.isProfessor || props.st_pergunta === 'F'){
      return(
        <>
          <Card.Header className="form-collapse card-header-style" />
          <Form >
            <Form.Label style={{ fontSize: 14, marginLeft: 7, marginBottom: 0}} >
              {retornarDescricaoLabel()}
            </Form.Label>
            <div className="d-flex div-resposta">
              <TextPergResp 
                value={(props.st_pergunta === 'F')?(props.resposta):(onResposta)}
                rows="3"
                onValidaResposta={onValidaResposta}
                correcaoOrtografica="true"
                placeholder="Digite sua resposta"
                classNameGroup="form-resposta"
                classNameControl="text-resposta"
                classNameBlur="blur-resposta"
                onChange={(e)=>setarResposta(e)}
              />
              <div className="div-resposta-button">
                {retornarImageEnviar()}            
                {retornarOverlayDelete(props.isProfessor)}
              </div>
            </div>
            {retornarAlerta()}
          </Form>
        </>
      )
    }
  }

  function retornarConteudoImagemPergunta(){
    if (props.st_pergunta === 'F') {
      return (
        <div
          className="div-resposta-expand" 
          onClick={()=>props.onClickImageAcordeao()}
        >
          <Image 
            className={(props.st_pergunta === 'A')?("image-resposta"):("img-setacima")}
            src={setacimaicon}
          />
        </div>
      )
    } else if (props.isAluno){
      return (
        <div className="" >
          <div className="div-resposta-aluno">
            <Image 
              className={(props.st_pergunta === 'A')?("image-resposta"):("img-setacima")}
              onClick={()=>props.onClickImageAcordeao()}
              src={resposta}
            />
          </div>
            {retornarOverlayDeleteAluno()}
        </div>
      )
    } else {
      return (
        <div className="" >
        <div className="div-resposta-aluno">
          <Image 
            className={(props.st_pergunta === 'A')?("image-resposta"):("img-setacima")}
            onClick={()=>props.onClickImageAcordeao()}
            src={resposta}
          />
        </div>
      </div>
      )
    }
  }

  function retornarResposta(){
    return (
      <>
        <div className="d-flex bd-highlight">
          <TextPergResp 
            value={props.pergunta}
            rows="3"
            correcaoOrtografica="false"
            classNameBlur="blur-pergunta"
            classNameControl="text-pergunta"
            onChange={false}
          />
            {retornarConteudoImagemPergunta()}
        </div>        
          {retornarConteudoResposta()}
      </>
    )
  }

  function retornarOverlayDeleteAluno(){
    if (props.cd_aluno === props.data.cd_aluno) {
      return (
        <div className="div-overlay-delete">
          <OverlayDelete 
            isAluno={false}
            onDeleteOverlay={()=>props.onDeleteOverlay()}
          />
        </div>
      )
    }
  }

  return (
    retornarResposta()
  )
}