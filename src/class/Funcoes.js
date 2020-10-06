class Funcoes {
  constructor(aData){
    this.converterDataLista(aData);
  }

  formataHora(aHora){
    return (aHora.length <= 1) ? (`0${aHora}`) : (aHora);
  }

  formataDataDDMMYYYY(aData){
    const {data, mes, ano} = this.converterDataLista(aData);
    return `${(data <10)?(`0${data}`):(data)}/${(mes <10)?(`0${mes}`):(mes)}/${ano}`
  }

  converterDataLista(aData){
    const lvDateObj = new Date(aData);
    const lvData = lvDateObj.getDate().toString();
    const lvMes = lvDateObj.getMonth().toString();
    const lvAno = lvDateObj.getFullYear().toString();
    const lvHora = this.formataHora(lvDateObj.getHours().toString());
    const lvMin =this.formataHora(lvDateObj.getMinutes().toString());
    const lvSeg = this.formataHora(lvDateObj.getSeconds().toString());
    return ({data: lvData, mes: lvMes, ano: lvAno, hora: lvHora, min: lvMin, sec: lvSeg});
  }
}

export default Funcoes;