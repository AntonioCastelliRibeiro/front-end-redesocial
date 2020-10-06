import React from 'react';

import ModalCadGenerico from './ModalCadGenerico';

export default function ModalCadastro(props){

  function retornarModal(){
    if (props.isMateria){
      return (
        <ModalCadGenerico 
          api={props.api}
          token={props.token}
          listaCad={props.listaMateria}
          tituloModalCad="Cadastrar Matéria"
          tituloModalEdit="Editar Matéria"
          placeholderCad="Matéria" 
          labelCad="Nome da Matéria"
          labelEdit="Nova Descrição"
          placeholderEdit="Selecione a Matéria" 
          retornarConteudoSelecao={(aData,aNumber)=>retornarConteudoSelecaoMat(aData,aNumber)}
          onCadastrar={(e)=>cadastrarMateria(e)}
          onEditar={(e)=>editarMateria(e)}
          onClose={()=>props.onClose()}
          popoverTitle="Remover Matéria?"
          onRemover={(e)=>onRemoverMateria(e)}
          // onSubmitMateria={(e)=>(this.setState({ notMat: true }))}
          // onRecarregarMateria={(e)=>(this.carregarMateria())}
          // onClose={(e)=>(this.setState({ modalMateria: false }))}
        />
      )
    } else {
      return (
        <ModalCadGenerico
          api={props.api}
          token={props.token}
          listaCad={props.listaInstituicao}
          tituloModalCad="Cadastrar Instituição"
          tituloModalEdit="Editar Instituição"
          placeholderCad="Instituição" 
          labelCad="Nome da Instituição"
          labelEdit="Nova Descrição"
          placeholderEdit="Selecione a Instituição" 
          retornarConteudoSelecao={(aData,aNumber)=>retornarConteudoSelecaoInst(aData,aNumber)}
          onCadastrar={(e)=>cadastrarInstituicao(e)}
          onEditar={(e)=>editarInstituicao(e)}
          onClose={()=>props.onClose()}
          popoverTitle="Remover Instituição?"
          onRemover={(e)=>onRemoverInstituicao(e)}
        />
      )
    }
  }

  async function onRemoverInstituicao(aData){
    const lvCdInst = aData;
    const lvToken = props.token;
    const api = props.api;
    try {
      const lvRetorno = await api.delete('/Instituicao', {
        headers: {
          'authorization': `Bearer ${lvToken}`,
          cd_instituicao: lvCdInst,
        },
      });
      if (lvRetorno.status ===  200){await props.atualizarListaInstRemov(aData)}
    } catch (error) {
      if (error.response.data.alerta){
      alert(error.response.data.alerta.message)
    }
    }
  }

  async function onRemoverMateria(aData){
    const lvCdMateria = aData;
    const lvToken = props.token;
    const api = props.api;
    try {
      const lvRetorno = await api.delete('/Materia', {
        headers: {
          'authorization': `Bearer ${lvToken}`,
          cd_materia: lvCdMateria,
        },
      });
      if (lvRetorno.status ===  200){await props.atualizarListaMatRemov(aData)}
    } catch (error) {
      if (error.response.data.alerta !== ''){
      alert(error.response.data.alerta.message)
    }
    }
  }

  async function editarMateria(aData){
    const lvCdMateria = aData.cd_campo;
    const lvDsMateria = aData.ds_campo;
    const lvToken = props.token;
    const api = props.api;
    const lvRetorno = await api.put('/Materia', {
      headers: {
        'authorization': `Bearer ${lvToken}`,
        cd_materia: lvCdMateria,
        ds_materia: lvDsMateria
      },
    });
    if (lvRetorno.status ===  200){props.atualizarListaMateria(aData)}
  }

  async function cadastrarMateria(aData){
      const lvDsMateria = aData.ds_campo;
      const lvToken = props.token;
      const api = props.api;
      const lvRetorno = await api.post('/Materia', {
        headers: {
          'authorization': `Bearer ${lvToken}`,
          ds_materia: lvDsMateria.trim() 
        },
      });
      if (lvRetorno.status ===  200){props.adicionarMateriaLista(lvRetorno.data.data)}
  }

  function retornarConteudoSelecaoMat(aData,aNumber){
    return ( 
      <option 
        id={aData.id}
        key={aData.id}
      >{ `${aNumber} - ${aData.ds_materia}` }</option> )
  }  

  async function cadastrarInstituicao(aData){
    const lvDsInstituicao = aData.ds_campo;
    const lvToken = props.token;
    const api = props.api;
    const lvRetorno = await api.post('/Instituicao', {
      headers: {
        'authorization': `Bearer ${lvToken}`,
        ds_instituicao: lvDsInstituicao.trim() 
      },
    });
    if (lvRetorno.status ===  200){props.adicionarInstituicaoLista(lvRetorno.data.data)}
  }

  async function editarInstituicao(aData){
    const lvCdInst = aData.cd_campo;
    const lvDsInst = aData.ds_campo;
    const lvToken = props.token;
    const api = props.api;
    const lvRetorno = await api.put('/Instituicao', {
      headers: {
        'authorization': `Bearer ${lvToken}`,
        cd_instituicao: lvCdInst,
        ds_instituicao: lvDsInst
      },
    });
    if (lvRetorno.status ===  200){props.atualizarListaInstituicao(aData)}  
  }

  function retornarConteudoSelecaoInst(aData, aNumber){
    return ( 
      <option 
        id={aData.id}
        key={aData.id}
      >{ `${aNumber} - ${aData.ds_instituicao}` }</option> )
  }  

  return(
    retornarModal()
  )
}