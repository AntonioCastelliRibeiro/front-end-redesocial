import React from 'react';
import './style.scss';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function ImageModal(props){

  function onClick(){
    // props.onChange();
    props.onClick();
  }
  
  return(
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip className="tooltip-edit">{props.tooltipName}</Tooltip>}
    >
      <img onClick={()=>onClick()} className="img-edit" src={props.img} alt={props.alt} />
    </OverlayTrigger>
  )
}
