import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Spinner from 'react-bootstrap/Spinner';

import ProfessorLista from '../ProfessorLista';


class ProfessorSpinnerData extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      spinner: true
    }

    this.listaProfessor = [{
      id: '',
      nm_professor: '',
      ds_email: '',
    }]

    this.carregarListaProfessor = this.carregarListaProfessor.bind(this);
    this.retornarConteudo = this.retornarConteudo.bind(this);
  }

  componentDidMount(){
    this.carregarListaProfessor();
  } 

  async carregarListaProfessor(){
    const lvToken = localStorage.getItem('TOKEN_PROFESSOR');
    const professor = await this.props.api.get('/teacher', {
      headers: {
        'authorization': `Bearer ${lvToken}`
      }
    });
    if (professor.data.success){
      this.setState(this.listaProfessor = professor.data.teachers);
      this.setState({
        spinner: false
      })
      return
  }
  }

  retornarConteudo(data){
      return ( 
        <ProfessorLista 
          key={data.id}
          dev={data}
        />
      )
  }

  retornarSpinner(){
    const lvSpinner = this.state.spinner;
    const lvProfessor = this.listaProfessor;
    if  (lvSpinner) {
      return (
        <Container>
        <Row >
           <Col  md={{ span: 6, offset:11 }} >
             <Spinner animation="border" role="status" className="center"/>
           </Col>
         </Row>
       </Container>       
      )
     } else {
      return (
        lvProfessor.map(this.retornarConteudo)
      )
    }
  }

  render() {
    return  (
      this.retornarSpinner()
    )
  }
}
export default ProfessorSpinnerData;
