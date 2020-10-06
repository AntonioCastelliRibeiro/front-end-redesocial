import React from 'react';
import './styles.scss'; 

import { Image,OverlayTrigger, Tooltip, Nav } from 'react-bootstrap';

class BotaoImg extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }
  
  componentDidMount(){
    this.componentDidUpdate();
  }
  
  componentDidUpdate(){
    if(this.props.stateExterno)this.setarBackgroundColor(this.props.state);
  }

  setarBackgroundColor(aSetar){
    this.RefNovaPergunta.style  = (aSetar) ? ("background-color: #fff"):("rgba(255, 255, 255, 0.041)");
    this.RefNovaImg.style  = (aSetar) ? ("height: 31px;"):("");
  }

  onClick(e){
    e.preventDefault();
    this.props.onClick();
  }

  retornarOverlayTrigger(aNome){
    return(
      <Nav>
        <OverlayTrigger
          show="true"
          trigger={["hover", "focus"]}
          key={this.props.dica}
          placement={(this.props.posicao)?(this.props.posicao):("top")}
          overlay={
            <Tooltip id="tooltip-novapergunta">
              <strong>{this.props.dica}</strong>
            </Tooltip>
          }
          >
            <div className={(this.props.hoverBottom)?("container hoverbottom hovernovapergunta"):("container hovertop")}
              onClick={(e)=>this.onClick(e)}
              ref={(field) => {this.RefNovaPergunta = field}}
            >
              <Image ref={(field) => {this.RefNovaImg = field}} className={(this.props.hoverBottom)?("img-button"):("img-top")} src={this.props.imagem}/>
            </div>  
        </OverlayTrigger>
      </Nav>
    )
  }

  render(){
    return(
      <>
        {this.retornarOverlayTrigger()}
      </>
    )
  }
}

export default BotaoImg;