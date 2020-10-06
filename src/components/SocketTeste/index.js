import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const socket = io('http://localhost:3333');
socket.on('connect', ()=>{console.log('Conectado')});

const SpinnerPadrao = (props) => {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const lista = props.data[0];
  console.log(lista)
  
  useEffect(() => {
    const hangleNewMessage = newMessage => 
      setMensagens([...props.data, newMessage])
    socket.on('chat.message', hangleNewMessage)
    return () => socket.off('chat.message', hangleNewMessage)

  }, [props.data, mensagens]);

  function handleSubmit(e){
    e.preventDefault();
    socket.emit('message', {
      id: 1,
      mensagem: mensagem 
    });
    props.onPost(mensagem);
   }

    return  (
      
      <Form>

        <Form.Group>
          <ListGroup>
            {mensagens.map((data, index)=>(
              <ListGroup.Item 
                key={index} 
              >
                {data.mensagem}
              </ListGroup.Item>))}
          </ListGroup>
        </Form.Group>

        <Form.Group>
          <Form.Control 
            type="input"
            value={mensagem}
            onChange={(e)=>(setMensagem(e.target.value))}
          />
          <Button onClick={handleSubmit}>Enviar</Button>
        </Form.Group>
      </Form>
    )

  }

  export default SpinnerPadrao;