import React, {useState} from 'react';
import './styles.scss';
import { Modal, Button, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';

import AlertaPadrao from '../AlertaPadrao';

export default function ModalPerguntar(props){
  const [ds_duvida, setDs_duvida] = useState('');
  const [alertaDuvida, setAlertaDuvida] = useState('');
  const [st_anonimo, setSt_anonimo] = useState(false);


  function retornarAlerta(){
    if (alertaDuvida) {
      return <AlertaPadrao mensagem="Pergunta inválida!" />
    }
  }

  function fecharModal(){
    props.onClose();
  }

  function onSubmitPergunta(e){
    e.preventDefault();
    if (validarDados()) {return}
    props.onSubmitPergunta({ds_duvida: ds_duvida, st_anonimo: st_anonimo})
  }

  function validarDados(){
    const lvDuvida = ds_duvida.trim();
    if (lvDuvida.length === 0) {
      setAlertaDuvida({ alertaDuvida: true})
      return true;
    }
  }

  function onChange(aData){
    setDs_duvida(aData);
    if (alertaDuvida) {setAlertaDuvida(false)}
  }

  return (
    <Modal size="lg"
        scrollable={true}
        aria-labelledby="contained-modal-title-vcenter"
        centered 
        show={true} 
        onHide={()=>fecharModal()}>
        <Modal.Body className="modal-body-perguntar" >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: 20 }}>{`Aula de ${props.materia}`}</Modal.Title>
          </Modal.Header>
          <Form validated={(!props.alertaDuvida) && (ds_duvida.length > 0)} >
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label style={{ marginTop:10 }} >Descreva sua dúvida</Form.Label>
              <Form.Control 
                as="textarea" 
                rows="6" 
                placeholder="Qual é a sua dúvida?" 
                value={ds_duvida}
                onChange={(e)=>onChange(e.target.value)}
                isInvalid={alertaDuvida} 
                />
                {retornarAlerta()}
            </Form.Group>
            <OverlayTrigger
              show="true"
              trigger={["hover", "focus"]}
              key={"Overr"}
              placement="bottom-start"
              overlay={
                <Tooltip className="tooltip-novapergunta" id="tooltip-novapergunta">
                  <strong>{`Seu nome não será exposto`}</strong>
                </Tooltip>
              }
            >
            <Form.Group controlId="formBasicCheckbox" className="form-group-style"
              // onClick={()=>setSt_anonimo((!st_anonimo) ? (true) : (false))}
            >
              <Form.Check 
               className="chk-anonimo"
                type="checkbox"
                label="Pergunta Anônima" 
                checked={st_anonimo}
                value={st_anonimo}
                custom={true}
                onClick={()=>setSt_anonimo((!st_anonimo) ? (true) : (false))}
              />
            </Form.Group>
            </OverlayTrigger>{' '}

          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-perguntar" >
          <Button size="lg" variant="dark" onClick={(e)=>(onSubmitPergunta(e))} block> Perguntar </Button>
        </Modal.Footer>
      </Modal>
  )
}