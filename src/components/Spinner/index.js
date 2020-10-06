import React from 'react';

import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class SpinnerPadrao extends React.Component {
  retornarMd(){
    if (this.props.span && this.props.offset){
        return ({ span: this.props.span, offset:this.props.offset })
    } else {
      return ( { span: 6, offset:11 } )
    }
  }
  render() {
    return  (
      <Container>
        <Row >
          <Col  md={this.retornarMd()} >
            <Spinner animation="border" role="status" className="center"/>
          </Col>
        </Row>
     </Container>  
    )
  }
}
export default SpinnerPadrao;
