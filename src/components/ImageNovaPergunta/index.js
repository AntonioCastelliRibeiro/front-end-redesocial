import React from 'react';
import './styles.scss';
import { Image } from 'react-bootstrap';
import novapergunta from '../../image/novapergunta/novapergunta.svg';

export default function ImageNovaPergunta(props){
  function  onClickPergunta(e){
    e.preventDefault();
    props.onClickPergunta();
  }
  return (
    <>
      <a href="Perguntar">
          {/* <div className="img-pergunta1"> */}
            <Image 
              className="img-pergunta"
              onClick={(e)=>onClickPergunta(e)}
              src={novapergunta} 
              roundedCircle 
            />
          {/* </div>  */}
    </a>
  </>
  )
}