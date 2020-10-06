import React from 'react';

import { Image,OverlayTrigger, Tooltip  } from 'react-bootstrap';
import todasperguntas from '../../image/navbottom/todasperguntas.svg';
import perguntarespondida from '../../image/navbottom/perguntarespondida.svg';
import perguntanaorespondida from '../../image/navbottom/perguntanaorespondida.svg';

class BotaoNavBottom extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onClickTodas: true,
      onClickResp: false,
      onClickNResp: false
    }
  }
  
  componentDidMount(){
    this.setarBackgroundColor();
  }
  
  componentDidUpdate(){
    this.setarBackgroundColor()
  }

  setarBackgroundColor(){
    this.RefTodas.style  = (this.state.onClickTodas)?("background-color: #fff"):("rgba(255, 255, 255, 0.041)");
    this.RefResp.style    = (this.state.onClickResp)?("background-color: #fff" ):("rgba(255, 255, 255, 0.041)"); 
    this.RefNResp.style = (this.state.onClickNResp)?("background-color: #fff"):("rgba(255, 255, 255, 0.041)"); 
  }

  setarFiltroNavBottom(e, aItem){
    e.preventDefault();
    this.props.setarFiltroNavBottom(aItem);
    if(aItem ==='T'){
      this.setState({onClickTodas: true, onClickNResp: false, onClickResp: false})
    } else if(aItem ==='R' ){
      this.setState({onClickTodas: false, onClickNResp: false, onClickResp: true})
    } else {
      this.setState({onClickTodas: false, onClickNResp: true, onClickResp: false})
    }
  }

  retornarOverlayTrigger(aNome){
    if (aNome === 'T'){
      return(
        <OverlayTrigger
          key="T"
          placement="top"
          overlay={
            <Tooltip id="tooltip-todas">
              <strong>Todas as Perguntas</strong>
            </Tooltip>
          }
          >
            <div className="container hoverbottom"
              onClick={(e)=>this.setarFiltroNavBottom(e, 'T')}
              ref={(field) => {this.RefTodas = field}}
            >
              <Image src={todasperguntas}/>
            </div>  
        </OverlayTrigger>
      )
    } else if (aNome === 'N'){
      return(
        <OverlayTrigger
          key="N"
          placement="top"
          overlay={
            <Tooltip id="tooltip-nresp">
              <strong>Não Respondidas</strong>
            </Tooltip>
          }
          >
           <div className="container hoverbottom"
            onClick={(e)=>this.setarFiltroNavBottom(e, 'N')}
            ref={(field) => {this.RefNResp = field}}
          >
            <Image src={perguntanaorespondida}/>
          </div>
        </OverlayTrigger>
      )
    } else if (aNome === 'R') {
        return(
          <OverlayTrigger
            key="R"
            placement="top"
            overlay={
              <Tooltip id="tooltip-resp">
                <strong>Respondidas</strong>
              </Tooltip>
            }
            >
              <div className="container hoverbottom"
              onClick={(e)=>this.setarFiltroNavBottom(e, 'R')}
              ref={(field) => {this.RefResp = field}}
            >
              <Image src={perguntarespondida}/>
            </div>
          </OverlayTrigger>
        )
    }
  }

  render(){
    return(
      <>
        {this.retornarOverlayTrigger('T')}
        {this.retornarOverlayTrigger('N')}
        {this.retornarOverlayTrigger('R')}
      </>
    )
  }
}

export default BotaoNavBottom;