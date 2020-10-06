import React from 'react';
import './styles.scss';

import perfil from '../../image/perfil/perfil.svg';
import {Accordion, Card, ListGroup, Image } from 'react-bootstrap';

export default function AcordeaoItemLoading(props){

  function retornarConteudo(){
    return (
      <Accordion 
      defaultActiveKey="0" 
      >
        <Card >
          <Accordion.Toggle  
            as={ListGroup} 
            eventKey="1">
            <li className="dev-item-loading" >
            <header className="header-loading">
              <Image className="img-perfil" style={{width:46}} src={perfil} roundedCircle={true} />
              <div className="div-item">
                <div className="user-info">
                  <div className="user-name"/>
                  <div className="user-item"/>
                  <div className="user-item"/>
                </div>
              </div>
            </header>
            </li>
          </Accordion.Toggle>
        </Card>
    </Accordion>
    )
  }

 return ( retornarConteudo() )
}