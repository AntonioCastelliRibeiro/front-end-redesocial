import React, { useState } from 'react';
import './styles.scss';

// import { CSSTransition, TransitionGroup } from 'react-transition-group';

import OverlayDelete from '../OverlayDelete';
import AcordeaoResposta from '../AcordeaoResposta';

import {Accordion, Card, Image } from 'react-bootstrap';
import Funcoes from '../../class/Funcoes';
import setabaixoicon from '../../image/seta/setabaixo.svg';
import resposta from '../../image/resposta/resposta.svg';
import perfil from '../../image/perfil/perfil.svg';

export default function AcordeaoItemHome(props){
  const [setacima, setSetaCima] = useState(false);
  const [onRetrair, setOnRetrair] = useState(false);
  const [onClick, setOnClick] = useState(false);
  const [onMouseOver, setOnOnMouseOver] = useState(false);
  const [onClickImageAcordeao, setOnClickImageAcordeao] = useState(false);
  
  function onDeleteOverlay(){
     setOnRetrair(true);
     setTimeout(() => {
      props.onDelete({
        id: props.data.id, 
        cd_aluno: props.data.cd_aluno, 
        cd_pin: props.data.cd_pin, 
        cd_professor: props.data.cd_professor
      })
     }, 200);
  }

  function retornarOverlayDelete(aAluno){
    return (
      <OverlayDelete 
        isAluno={aAluno}
        onDeleteOverlay={()=>onDeleteOverlay()}
      />
    )
  } 

  function retornarResposta(){
    return (
      <AcordeaoResposta
        id={props.data.id}
        isProfessor={props.isProfessor}
        professor={props.data.cd_professor}
        isAluno={props.isAluno}
        cd_aluno={props.cd_aluno}
        data={props.data}
        pergunta={props.data.ds_pergunta}
        resposta={props.data.ds_resposta}
        st_pergunta={props.data.st_pergunta}
        onClickResposta={(e)=>props.onClickResposta(e)}
        onDeleteOverlay={()=>onDeleteOverlay()}
        onClickImageAcordeao={()=>setarEventos()} 
      />
    )
  }

  function retornarDescricaoStatus(aData, aStatus, aDataHora, aPin){
      const lvDsStatus = (aData.st_pergunta === 'A')?('Não Respondida'):('Respondida');
      const lvDataAtt = aData.updated_at;
      const lvCdPin = aData.cd_pin;
      const lvId = aData.id;
      const lvFuncoes = new Funcoes();
      const {data, mes, ano, hora, min} = lvFuncoes.converterDataLista(lvDataAtt)
      if (aStatus) {return `Status: ${lvDsStatus}`}
      if (aDataHora) {return `${data}/${(mes.length <= 9) ? (`0${mes}`) : (mes)}/${ano} as ${hora}:${min}`}
      if (aPin) {return (`Código: ${lvId} - Pin: ${lvCdPin}`)}
  }

  function retornarSeta(aResp){
    if (aResp) {
      return (
        <div 
          className="col-auto div-setabaixo"
          onClick={()=>setarEventosOver(true)}
          >
          <Image 
            className="img-setacima"
            // onMouseOver={()=>}
            src={setabaixoicon}
          />
        </div>
      ) 
    } else if (props.isProfessor || props.isAluno){
      return (
        <div 
            className="col-auto div-resposta-expand"
            // onClick={()=>setOnClickImageAcordeao((!onClickImageAcordeao)?(true):(false))}
            onClick={()=>setarEventosOver(true)}
          >
          <Image 
            className="image-resposta"
            style={{width: 25, height: 25}}
            src={resposta}
          />
        </div>
      )
    }
    else {
      return retornarOverlayDelete(true)
    }
  } 

  function setarEventos(aMouseOver){
    setSetaCima(()=>((!setacima)?(true):(false)));
    props.onExpand(false, props.count);

    setOnClick(()=>((onClick)?(false):(true)));
    // setOnRetrair(()=>((onRetrair)?(false):(true)));
    setOnClickImageAcordeao((!onClickImageAcordeao)?(true):(false))
  }

  function setarEventosOver(aMouseOver){
    setSetaCima(true);
    props.onExpand(true, props.count);

    setOnClick(true);
    setOnClickImageAcordeao(true);
    // if 
    // if (aMouseOver){
    //   setSetaCima(true);
    //   setOnClick(true);
    //   setOnClickImageAcordeao(true)
    // } else {
    //   setSetaCima(false);
    //   // setOnClick(false);
    //   setOnClickImageAcordeao(false)
    // }
  }

  function retornarPergunta(){
    // console.log(onClickImageAcordeao)
    return (onClickImageAcordeao)?(retornarResposta()):(retornarCapaPergunta())
  }

  function retornarCapaPergunta(){
    return(
      <>
        <header >
          <Image className="img-perfil" src={perfil} alt="imagem" />
          <div className="container" >
            <div className="row" >
              <div className="col" style={{position: "inherit"}}>
                <div className="user-info"  >
                  <input className="input-nome" readOnly value={(props.data.st_anonimo === 'S')?('Anônimo'):(props.data.nm_aluno)}/>
                  {/* <span>{retornarDescricaoStatus(props.data, true)}</span> */}
                  <span>{retornarDescricaoStatus(props.data, false, true)}</span>
                  <span>{retornarDescricaoStatus(props.data, false, false, true)}</span>
                  <span>{}</span>
                </div>
              </div>
              {retornarSeta(props.data.st_pergunta === 'F')}
            </div>
          </div>
        </header>
          {/* <TextPergResp 
            value={props.data.ds_pergunta}
            rows="3"
            classNameBlur="blur-pergunta"
            classNameControl="text-pergunta"
            onChange={false}
          /> */}
        </>
    )
  }

  function retornarClassNameAcordeao(){
    if (onRetrair){
      return "dev-item dev-item-delete" 
    }
    if (!setacima) {
      return "dev-item"
    }
    else {
      return  "dev-item dev-item-expand"
    }
  }

  function retornarClassName(){
    if (setacima){
      return "accordion-principal accordion-grid"
    } else {
      return ''
    }
  }

  // function retornarGridColumnNumber(){
  //   for (let i = 1; i <= 3 ; i++) {
  //     if (retornarCondicaoColumnNuber(i)){
  //       return i
  //     }
  //   }
  // }

  // function retornarCondicaoColumnNuber(e){
  //   // console.log(window.innerWidth)
  //   const lvCount = props.count;
  //   for (let i = e; i <= props.listaPergunta.length; i = i + 3) {
  //     if (lvCount === i){ return true }
  //   }
  // }

  // function retornarNumberColuna(){
  //   const lvCount = props.count+1;
  //   let lvQtCol = 3;
  //   let lvLinha = 1;
  //   for (let i = 1; i <= props.listaPergunta.length; i ++) {
  //     if (i > lvQtCol) {
  //       lvLinha ++; // recebe proxima linha;
  //       lvQtCol += 3; //recebe ele mais 3, pq tem 3 registros por linha
  //     }

  //     if (lvCount === i ){
  //       if ( i === lvQtCol ) { // terceiro elemento da col 3/3
  //         let lvContReg = 0;
  //         for (let i = 0; i < props.expandList; i++) {
  //           if (props.expandList[i] < lvCount) {
  //             lvContReg ++;
  //           }
  //         }
  //         return (lvContReg !== 0) ? (lvContReg) : (3) //3
  //       } else if ( i === (lvQtCol -1)){ // segundo elemento
  //         return 2
  //       } else {
  //         return 1 // primeiro  elemento
  //       }




  //     // if (lvCount === i ){
  //     //   if ( i === lvQtCol ) { // terceiro elemento da col 3/3
  //     //     return 3
  //     //   } else if ( i === (lvQtCol -1)){ // segundo elemento
  //     //     return 2
  //     //   } else {
  //     //     return 1 // primeiro  elemento
  //     //   }

  //       console.log(lvLinha, lvCount);

  //       return lvLinha;
  //     }
  //   }
  // }

  // function retornarRowColumnNumer(){
  //   const lvCount = props.count+1;
  //   let lvQtCol = 3;
  //   let lvLinha = 1;
  //   for (let i = 1; i <= props.listaPergunta.length; i ++) {
  //     if (i > lvQtCol) {
  //       lvLinha ++; // recebe proxima linha;
  //       lvQtCol += 3; //recebe ele mais 3, pq tem 3 registros por linha
  //     }
  //     // if (lvCount === i ){
  //       console.log(props.expandList)
  //       if ( i === lvCount){ 
  //         let lvContReg = 0;
  //         for (let i = 0; i < props.expandList.length; i++) {
  //           if (props.expandList[i] < lvCount) {
  //             lvContReg ++;
  //           }
  //         }
  //         return lvLinha + (lvContReg * 3); }//+ lvContReg}
  //     // }
  //   }
  // }

  function retornarStyle(){
    // console.log((props.count +1) % 3 === 0)
    // console.log(props.count, (props.count) % 3 === 0)
    // console.log(props.count %1 === 0)
    // console.log(props.listaPergunta)
    if  (setacima){
      if (props.count %1 === 0){
        return {
          zIndex: props.data.id,
          // gridColumn: retornarNumberColuna(),//props.count+1,
          // gridRow: `${retornarRowColumnNumer()} / span 3`
          // gridColumn: retornarGridColumnNumber(),
          // gridRow: `${retornarRowColumnNumer()} / span 3`
        }
      } 
    }
    return { zIndex: props.data.id}
  }

  return (
        <Accordion
          style={retornarStyle()}
          className={retornarClassName()} 
          defaultActiveKey="0" 
          onMouseEnter={()=>setOnOnMouseOver((!onMouseOver)?(true):(false))}
          onMouseLeave={()=>setOnOnMouseOver((!onMouseOver)?(true):(false))}
        >
          <Card 
            className="card-box"
            id={props.data.id}
          >
            <div className="acordeao-delete">
              <li 
                className={retornarClassNameAcordeao()} 
                id={props.data.id} 
                key={props.data.id}
              >
              {retornarPergunta()}
              </li>
            </div>
          </Card>
        </Accordion>
  )
}