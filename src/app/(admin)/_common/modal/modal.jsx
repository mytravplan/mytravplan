import React from 'react'
import Modal from './component/modalPage'

function ModalWrapper({isOpen, onClose, onConfirm}) {
  return (
     <>
     {
        isOpen&&(
            <Modal onClose={onClose} onConfirm={onConfirm}/>
        )
     }
     </>
  )
}

export default ModalWrapper
