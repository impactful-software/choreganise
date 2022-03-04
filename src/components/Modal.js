import IconButton from './IconButton'
import './Modal.css'

const Modal = ({ children, controls, onClose }) => {
  return (
    <div className="modal">
      <div className="modalContent">
        <span className="modalClose">
          <IconButton dark icon="close" onClick={onClose} />
        </span>

        {children}
      </div>
    </div>
  )
}

export default Modal
