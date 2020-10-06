import React from 'react';
import Form from 'react-bootstrap/Form';

class AlertaPadrao extends React.Component {  
  render(){
    return(
      <Form.Control.Feedback type="invalid">
        {this.props.mensagem}
      </Form.Control.Feedback>
    )
  }
}

export default AlertaPadrao;





