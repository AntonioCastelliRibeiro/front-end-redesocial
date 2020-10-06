import React, { useState, useRef, useEffect } from 'react';
import './styles.scss';

import Funcoes from '../../class/Funcoes';
import setabaixoimg from '../../image/seta/setabaixo.svg';
// import setabaixo from '../../image/seta/setabaixo.svg';


import AcordeaoItemLoading from '../AcordeaoItemLoading';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import { Form } from 'react-bootstrap';

export default function AcordeaoPin(props) {
  const FuncoesObj = new Funcoes();
  const [setabaixo, onSetarSetaBaixo] = useState(false);
  const [onNomeRouter, setOnNomeRouter] = useState(''); 

  useEffect(()=>{
      props.socket.on('pergunta.aluno.modal', (e)=>verificarMensagemLista(e));
      return ()=>props.socket.off('pergunta.aluno.modal');
  },[]);

  function verificarMensagemLista(aData){
    if(aData.cd_pin !== props.data.id) return false // somente atualizará o componente atual
    props.verificarMensagemLista(aData);
  }

  function onClickPergunta(AId){
    props.onClickPergunta(AId);
  }

  function onSetarEstadoPin(e){
    e.preventDefault();
    onSetarSetaBaixo(()=>(!setabaixo)?(true):(false));
  }

  function retornarClassSeta(){
    if (setabaixo){
      return ("img-seta-baixo");
    } else{
      return ("img-seta-cima");
    }
  }

  function retornarDescricaoConteudo(aData){
    if (setabaixo){
      const lvId = aData.id;
      const lvDsConteudo = aData.ds_conteudo;
      return (
        <div className="div-conteudo-expand" >
          <div className="div-body-style" >
            <Form.Label  style={{marginTop: 5}} >Conteúdo</Form.Label>
            <Form.Control 
              disabled
              as="textarea"
              value={lvDsConteudo}
              rows="3"
            />
            <Router>
              <Link 
                style={{textDecoration: "none" }} 
                to={onNomeRouter} 
                onMouseOver={(e)=>setOnNomeRouter(lvId)} 
                onClick={()=>onClickPergunta(lvId)}
              >
                <button 
                  className="btn-selecionar"
                ><span className="span-btn-selecionar">Selecionar</span></button>
                {/* <Button 
                  variant="dark"
                  style={{marginTop: 7}} 
                  size="lg" 
                  block 
                >Selecionar</Button>  */}
              </Link>
              <Switch >
                <Route  path={onNomeRouter}/*"/:id"*/ />
              </Switch>
            </Router>
          </div>
        </div>
      )
    }
  }

  function retornarConteudo(aData, aCount){
    const lvId = aData.id;
    const lvDsMateria = aData.ds_materia;
    const lvDsInstituicao = aData.ds_instituicao;
    const lvData = aData.created_at;
    const lvNrPergunta = aData.nr_pergunta;

    return (
      <li className="li-pin" >
        <div className="div-principal"onClick={(e)=>onSetarEstadoPin(e)}>
          <div className="container">
            <div className="row">
              <div style={{paddingLeft:0}} className="col-8">
                <input className="input-pin" value={`Pin: ${lvId}`} />
                <input className="input-materia" value={`${lvDsMateria}`} />
                <input className="input-instituicao" value={`${lvDsInstituicao}`} />
              </div>
              <div className="col-4 div-seta">
                {retornarData(lvData)}
                <div className="div-qtdpergunta" >{retornarNrPergunta(lvNrPergunta)}</div>
                <img className={retornarClassSeta()} src={setabaixoimg} alt="setabaixo"/>
              </div>
            </div>
          </div>
        </div>
        {retornarDescricaoConteudo(aData)}  
      </li>  
    )
  }

  function retornarData(aData){
    const lvData= FuncoesObj.formataDataDDMMYYYY(aData);
    return (
      <p>{lvData}</p>
    )
  }

  function retornarNrPergunta(ANrPergunta){
    if (ANrPergunta !== '0'){
      return  <span className="span-nrpergunta">{ANrPergunta}</span>
    }
  }

  return (
    retornarConteudo(props.data, props.count)
  );

}