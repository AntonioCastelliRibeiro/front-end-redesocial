import React from 'react';
import './styles.scss';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ModalSair(props){
    return (
      <>      
        <Modal show={true} onHide={props.onCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Deseja Realmente Sair?</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{padding: "10px 10px 10px 10px"}} >Atenção: Dados não salvos serão perdidos</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.onCancel}>
              Não
            </Button>
            <Button variant="primary" onClick={props.onClick}>
              Sim
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );  
}