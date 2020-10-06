import React from 'react';
import './styles.scss';

import Nav from 'react-bootstrap/Nav';

export default function NavItemPadrao(props){

  function onClick(e){
    e.preventDefault();
    props.onClick();
  }

  function retornarNav(){
    if (props.nav === true){
      return(
        <Nav  className={props.classNameNav} defaultActiveKey={props.defaultActiveKeyNav}>
          <Nav.Item>
            <Nav.Link 
              eventKey={props.eventKey}
              href={props.href} 
              onClick={onClick} >
                {props.name}
            </Nav.Link>
          </Nav.Item>
        </Nav> 
      )
    } else {
      return(
        <Nav.Item>
          <Nav.Link 
            eventKey={props.eventKey}
            href={props.href} 
            onClick={onClick} >
              {props.name}
          </Nav.Link>
        </Nav.Item>
      )
    }
  }

  return(
    retornarNav()    
  )
};