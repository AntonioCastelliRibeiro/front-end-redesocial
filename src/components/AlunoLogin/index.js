import React from 'react';
import './styles.scss';
import Alert from 'react-bootstrap/Alert';

class AlunoLogin extends React.Component {  
  constructor(props){
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    }
    

  componentDidMount(){
  }

  componentWillUnmount(){
    this.props.onCloseAlerta();
  }

  mostrarAlerta(){
    if (this.props.props.alerta.alertar){
      return (
        <>
        <Alert 
          ref="AlertGeral" 
          variant="danger"  
          onClose={this.props.onCloseAlerta}  
          dismissible> {this.props.props.alerta.mensagem}
        </Alert>
        </>
      )
    } else {
      return
    }
  }
 
  async handleSubmit(e) {
    e.preventDefault();       
    await this.props.onSubmit();
  }

  render() {

    return (
      <aside>
        <form onSubmit={this.handleSubmit}>
          {this.mostrarAlerta()}
          <div className="input-block">
            <label htmlFor="user_name" >Nome de Usuário</label>
            <input 
              name="user_name"
              id="user_name" 
              type="input"
              required
              value={this.props.props.nm_usuario}
              ref={(field) => {this.user_name = field}}
              onChange={(e)=>(this.props.onChangeNomeAluno(e.target.value))} /*salva o valor digitado no state pai*/ /> 
          </div>

          <div className="input-block">
            <label htmlFor="user_email" >Email para Acesso</label>
            <input
              name="user_email"
              id="user_email"
              required
              ref={(field) => {this.user_email = field}}
              value={this.props.props.ds_email}
              onChange={(e)=>this.props.onChangeEmail(e.target.value)} />
          </div>

          <div className="input-block">
            <label htmlFor="user_pin"  >Pin</label>
            <input
              name="user_pin"
              id="user_pin"
              type="input" 
              required
              value={this.props.props.cd_pin}
              onChange={(e)=>(this.props.onChangePin(e.target.value))} />
          </div>
          <div className="input-block">
            <button type="submit" >Logar com Pin</button>      
          </div>
          
        </form>
      </aside>
    )
  }

}

export default AlunoLogin;