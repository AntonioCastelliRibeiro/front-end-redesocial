import React from 'react';

import AcordeaoItem from '../AcordeaoItem';

import {Accordion, Form} from 'react-bootstrap';

export default function AcordeaoPergunta(props) {

  function retornarConteudo(aData){
    const lvId = aData.id;
    const lvDsPergunta = aData.ds_pergunta;
    const lvDsResposta = aData.ds_resposta;
    const lvStAnonimo = aData.st_anonimo;
    const lvNmAluno = aData.ALUNO.nm_aluno;
    return (
      <AcordeaoItem 
        key={lvId}
        id={lvId}
        pergunta={lvDsPergunta}
        resposta={lvDsResposta}
        tabName={props.tabName}
        anonimo={lvStAnonimo}
        aluno={lvNmAluno}
        onClickRespostaPergunta={(e)=>props.onClickRespostaPergunta(e)}
      />)
  }

    return(
      <Accordion >
        <Form.Group>
          {props.listaPergunta.map((aData)=>(retornarConteudo(aData)))}
        </Form.Group>
      </Accordion>      
    )
}