import React from 'react';
import './styles.css';
import Alert from 'react-bootstrap/Alert';

class ProfessorCadastro extends React.Component {  
  constructor(props){
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    }
    

  componentDidMount(){
    this.user_name.focus();
  }

  componentWillUnmount(){
    this.props.onCloseAlerta();
  }

  mostrarAlerta(){
    if (this.props.alertar){
      return (
        <>
        <Alert 
          variant="danger"  
          onClose={this.props.onCloseAlerta}  
          dismissible> {this.props.mensagem}
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
              onChange={(e)=>(this.props.onChangeNomeProfessor(e.target.value))} /*salva o valor digitado no state pai*/ /> 
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
            <label htmlFor="user_password"  >Senha</label>
            <input
              name="user_password"
              id="user_password"
              type="password" 
              required
              ref={(field) => {this.user_password = field}}
              value={this.props.props.ds_senha}
              onChange={(e)=>(this.props.onChangeSenha(e.target.value))} />
          </div>

          <div className="input-block">
            <label htmlFor="user_passwordRepeat"  >Repita a senha</label>
            <input 
              name="user_passwordRepeat"
              id="user_passwordRepeat" 
              type="password" 
              required
              value={this.props.props.ds_senhaRepeat}
              onChange={(e)=>(this.props.onChangeSenhaRepeat(e.target.value))} />
          </div>

          <div className="input-block">
            <button type="submit" >Cadastrar</button>      
          </div>
          
          <div className="input-a">
            <a href="#RecuperarSenha" onClick={(e)=>{e.preventDefault();}}>Recuperar a senha</a>

          </div>
        
        </form>
      </aside>
    )
  }

}

export default ProfessorCadastro;