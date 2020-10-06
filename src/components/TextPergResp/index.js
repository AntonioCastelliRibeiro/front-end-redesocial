import React, {useState, useEffect} from 'react';
import './style.scss';

import {Form} from 'react-bootstrap';

export default function TextPergResp(props){
  const [onBlur, setBlur] = useState(false);

  function retornarClassName(){
    if (props.onValidaResposta) {
      return "text-alerta-resposta "
    } else {
      return( (onBlur) ? (props.classNameBlur):(props.classNameControl) )
    }
  }

  function retornarTextArea(){
    if (props.correcaoOrtografica){
      return(
        <textarea 
        spellCheck="true"
        onFocus={()=>setBlur(true)}
        onBlur={()=>setBlur(false)}
        className={retornarClassName()}
        placeholder={props.placeholder}
        rows={props.rows} 
        value={props.value} 
        onChange={(e)=>(props.onChange)?(props.onChange(e.target.value)):({})}
      />
      )
    } else {
      return (
        <textarea 
          spellCheck="false"
          onFocus={()=>setBlur(true)}
          onBlur={()=>setBlur(false)}
          className={retornarClassName()}
          placeholder={props.placeholder}
          rows={props.rows} 
          value={props.value} 
          onChange={(e)=>(props.onChange)?(props.onChange(e.target.value)):({})}
      />
      )
    }
  }

  return (
    <Form.Group className={props.classNameGroup}>
      {retornarTextArea()}
  
    </Form.Group>
  )
}