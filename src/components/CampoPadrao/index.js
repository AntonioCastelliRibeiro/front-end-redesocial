import React from 'react';
import Form from 'react-bootstrap/Form';
import AlertaPadrao from '../AlertaPadrao';

class CampoPadrao extends React.Component { 

  retornarLabel(){
    if (this.props.label) { return <Form.Label >{this.props.label}</Form.Label>}
  }
  retornarAlerta() {
    if (this.props.alerta) {
      return <AlertaPadrao mensagem={this.props.alertaMensagem}/>
    }
  }

  onKeyPress(e){
    this.props.onKeyPress();
    if (e.key === 'Enter'){ 
      this.props.onSubmit();  
      e.preventDefault();
    };
  }

  retornarConteudo(){
    if (this.props.retornarForm){
      return (
          <Form.Group controlId={this.props.controlId} tabIndex={this.props.tabIndex}>
            {this.retornarLabel()}
            <Form.Control 
              tabIndex={this.props.tabIndex}
              disabled={this.props.disabled}
              type={this.props.type}
              placeholder={this.props.placeholder} 
              value={this.props.value}
              onChange={(e)=>(this.props.onChange(e.target.value))}
              onKeyPress={(e)=>this.onKeyPress(e)} 
              isInvalid={this.props.isInvalid}
              />
            {this.retornarAlerta()}
          </Form.Group>
          )
    } else {
        return (
          <Form
            validated={this.props.validated} 
            id={this.props.id}  >
            <Form.Group controlId={this.props.controlId} tabIndex={this.props.tabIndex}>
              {this.retornarLabel()}
              <Form.Control 
                tabIndex={this.props.tabIndex}
                disabled={this.props.disabled}
                type={this.props.type}
                placeholder={this.props.placeholder} 
                value={this.props.value}
                onChange={(e)=>(this.props.onChange(e.target.value))}
                onKeyPress={(e)=>this.onKeyPress(e)} 
                isInvalid={this.props.isInvalid}
                />
              {this.retornarAlerta()}
            </Form.Group>
          </Form>)
    }
  }
  render(){
    return (
      this.retornarConteudo()

      
    )
  }
}

export default CampoPadrao;

