import React from 'react';
import './styles.scss';
import Alert from 'react-bootstrap/Alert';

class FormCadastroLogin extends React.Component {  
  constructor(props){
    super(props);
    this.state = {
      nm_usuario:  '',
      ds_email: '',
      ds_senha: '',
      ds_senhaRepeat: '',
      cd_pin: '',
      alertar: false,
      mensagem: '',
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    }
    
  componentDidUpdate(aPropsAnt){ // limpar alerta a cada troca de ação de professor/aluno/login/cadastro
    if((aPropsAnt.isProfessor !== this.props.isProfessor) || (aPropsAnt.isEntrar !== this.props.isEntrar)) {
      this.setarAlerta(false, '');
    }
  }

  setarAlerta(aAlertar, aMensagem){
    this.setState({
        alertar: aAlertar,
        mensagem: aMensagem,
    });
  }

  mostrarAlerta(){
    if (this.state.alertar){
      return (
        <>
        <Alert 
          variant="dark"            
          onClose={()=>(this.setarAlerta(false,''))}  
          dismissible 
          > {this.state.mensagem}
        </Alert>
        </>
      )
    }
  }

  async onSubmitDataLoginProfessor(){
    console.log(this.state.ds_email, this.state.ds_senha)
    try {
      const lvTeacher  = await this.props.api.post('/loginProfessor', {
        ds_email: this.state.ds_email,
        ds_senha: this.state.ds_senha,  
      });
      this.props.onSubmit(lvTeacher.data, true);
      } catch (error) {
      this.retornarAlertaLogin(error.response.data);
    }
  }

  retornarAlertaLogin(aError) {
    const  { alertar, mensagem }= aError;
    this.setarAlerta(alertar, mensagem);
  }
 
  async handleSubmit(e) {
    this.setarAlerta(false, '');
    e.preventDefault(); 
    (!this.props.isProfessor) ? (await this.onSubmitDataLoginAluno()) :
    (this.props.isEntrar) ? (await this.onSubmitDataLoginProfessor()) : (await this.onSubmitDataCadastro())
  }

  async onSubmitDataLoginAluno(){
    await this.realizarLoginAluno();
  }

  async realizarLoginAluno(){
    try {
      const lvAluno  = await this.props.api.post('/loginAluno', {
        nm_usuario: this.state.nm_usuario,
        ds_email: this.state.ds_email,
        cd_pin: this.state.cd_pin,
      });
      this.props.onSubmit(lvAluno.data, false);
      } catch (error) {
      this.retornarAlertaLogin(error.response.data);
    }
  }
  async onSubmitDataCadastro(){
    await this.adicionarUsuario();
  }

  async adicionarUsuario() {
    try {
      const lvTeacher  = await this.props.api.post('/teacher', {
        nm_professor:  this.state.nm_usuario,
        ds_email:  this.state.ds_email,
        ds_senha:this.state.ds_senha,
        ds_senhaRepeat: this.state.ds_senhaRepeat
      });
      this.props.onSubmit(lvTeacher.data, true);
    } catch (error) {
      this.setarAlerta(true, error.response.data.mensagem);
    }
  }

  retornarFormLoginProfessor(){
    if (this.props.isEntrar && this.props.isProfessor){
    return (
      <>
        <form 
          onSubmit={this.handleSubmit}>
          <div className="input-block">
            <label htmlFor="user_email" >Email para Acesso</label>
            <input
              name="user_email"
              id="user_email"
              required
              value={this.state.ds_email}
              onChange={(e)=>(this.setState({ ds_email: e.target.value}))} 
            />
          </div>

          <div className="input-block">
            <label htmlFor="user_password"  >Senha</label>
            <input
              name="user_password"
              id="user_password"
              type="password" 
              required
              value={this.state.ds_senha}
              onChange={(e)=>(this.setState({ ds_senha: e.target.value}))}
              />
       
          </div>
          <div className="input-block">
            <button type="submit" >Entrar como Professor</button>      
          </div>
{/*           
          <div className="input-a">
            <a href="#RecuperarSenha" onClick={(e)=>{e.preventDefault()}}>Recuperar a senha</a>

          </div> */}
        
        </form>
      </>
      )
    }
  }

  retornarFormCadastroProfessor(){
    if (!this.props.isEntrar && this.props.isProfessor) {
      return(
        <form onSubmit={this.handleSubmit}>
          <div className="input-block">
            <label htmlFor="user_name" >Nome de Usuário</label>
            <input 
              name="user_name"
              id="user_name" 
              type="input"
              required
              value={this.state.nm_usuario}
              onChange={(e)=>(this.setState({ nm_usuario: e.target.value }))}  /> 
          </div>

          <div className="input-block">
            <label htmlFor="user_email" >Email para Acesso</label>
            <input
              name="user_email"
              id="user_email"
              required
              value={this.state.ds_email}
              onChange={(e)=>(this.setState({ ds_email: e.target.value }))} />
          </div>

          <div className="input-block">
            <label htmlFor="user_password"  >Senha</label>
            <input
              name="user_password"
              id="user_password"
              type="password" 
              required
              value={this.state.ds_senha}
              onChange={(e)=>(this.setState({ ds_senha: e.target.value }))} />
          </div>

          <div className="input-block">
            <label htmlFor="user_passwordRepeat"  >Repita a senha</label>
            <input 
              name="user_passwordRepeat"
              id="user_passwordRepeat" 
              type="password" 
              required
              value={this.state.ds_senhaRepeat}
              onChange={(e)=>(this.setState({ ds_senhaRepeat: e.target.value }))} />
          </div>

          <div className="input-block">
            <button type="submit" >Cadastrar Professor</button>      
          </div>
          
          {/* <div className="input-a">
            <a href="#RecuperarSenha" onClick={(e)=>{e.preventDefault()}}>Recuperar a senha</a>

          </div>
         */}
        </form>
      )
    }
  }

  retornarFormLoginAluno(){
    if (!this.props.isProfessor) {
      return(
        <form onSubmit={this.handleSubmit}>
          <div className="input-block">
            <label htmlFor="user_name" >Nome de Usuário</label>
            <input 
              name="user_name"
              id="user_name" 
              type="input"
              required
              value={this.state.nm_usuario}
              onChange={(e)=>(this.setState({ nm_usuario: e.target.value }))}  /> 
          </div>

          <div className="input-block">
            <label htmlFor="user_email" >Email para Acesso</label>
            <input
              name="user_email"
              id="user_email"
              required
              value={this.state.ds_email}
              onChange={(e)=>this.setState({ ds_email: e.target.value })} />
          </div>

          <div className="input-block">
            <label htmlFor="user_pin">Pin</label>
            <input
              name="user_pin"
              id="user_pin"
              type="input" 
              required
              value={this.state.cd_pin}
              onChange={(e)=>(this.setState({ cd_pin: e.target.value }))} />
          </div>
          <div className="input-block">
            <button type="submit" >Entrar como Aluno</button>      
          </div>
        
        </form>
      )
    }
  }

  render() {
    return ( 
      <aside className="aside-cad">
        {this.mostrarAlerta()}
        {this.retornarFormLoginProfessor()} 
        {this.retornarFormCadastroProfessor()} 
        {this.retornarFormLoginAluno()}
      </aside>
      )
  }

}

export default FormCadastroLogin;