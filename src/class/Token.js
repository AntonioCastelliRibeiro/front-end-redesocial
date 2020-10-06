class Token {
  constructor(){
    this.session = {
      token: this.retornarTokenSession(),
      gerado: true
    }
  }

  retornarTokenSession(){
    const lvToken = localStorage.getItem('TOKEN_ALUNO');
    return (lvToken) ? (localStorage.getItem('TOKEN_ALUNO')) : (localStorage.getItem('TOKEN_PROFESSOR'));
}

  gerarToken(AGerado, AToken, AIsProfessor){
    localStorage.setItem((AIsProfessor) ? ('TOKEN_PROFESSOR') : ('TOKEN_ALUNO'), AToken);
    this.session = ({
      gerado: AGerado,
      token: AToken,
    })
  }

  setarToken(AGerado){
    this.session = ({
      gerado: AGerado,
      token: localStorage.getItem('TOKEN_PROFESSOR'),
    })
  }

  limparSessionToken(){
    localStorage.clear(this.session.token);
    this.session = ({
      gerado: false,
      token: '',
    })
  }

}

export default Token;