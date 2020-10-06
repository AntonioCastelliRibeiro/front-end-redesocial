import React, {useState} from 'react';
import './styles.scss';

import { Image, OverlayTrigger, Popover } from 'react-bootstrap';

import deleteicon from '../../image/delete/delete.svg';
import deleteiconhover from '../../image/delete/deletehover.svg';

export default function OverlayDelete(props){
  var refDelete = React.createRef();
  const [onHoverDelete, setOnHoverDelete] = useState(false);

  function retornarPopover(){
    return (
      <Popover id="popover-basic" >
        <Popover.Title as="h1" style={{fontSize: 15}}>{(props.popoverTitle)?(props.popoverTitle):("Remover Pergunta?")}</Popover.Title>
        <Popover.Content className="pop-remover-sim" onClick={()=>onClickPopoverRemover()}>
          Sim
        </Popover.Content>
        <Popover.Content className="pop-remover-nao" onClick={()=>refDelete.click()}>
          Não
        </Popover.Content>
      </Popover>
    )
  }

  function onClickPopoverRemover(){
    props.onDeleteOverlay();
    refDelete.click(); // simula o click para fechar o popover
  }

  return (
    <div 
      className={(props.className)?(props.className):("div-delete")}
      // style={{paddingTop:(props.paddingTop)?(0):(0)}}
    >
      <OverlayTrigger
        delay="2"
        transition={true}
        rootClose={true}
        rootCloseEvent={"click"}
        trigger="click" 
        placement={(props.isAluno)?("auto-start"):("left-end")}
        overlay={retornarPopover()}
      >
        <Image 
          className="img-delete"
          style={(props.isAluno)?({width: 30, height: 30, marginTop: 0}):({})}
          ref={(e)=>refDelete=e}
          src={(onHoverDelete)?(deleteiconhover):(deleteicon)}
          onMouseEnter={()=>setOnHoverDelete((!onHoverDelete)?(true):(false))}
          onMouseLeave={()=>setOnHoverDelete((!onHoverDelete)?(true):(false))}
        /> 
      </OverlayTrigger>
      </div>
    )
  }