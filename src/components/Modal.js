import './Modal.css'
import ReactDOM from 'react-dom'
import Theme from './Theme'

const Modal = ({ children, theme = 'default' }) => {
  const themes = Object.fromEntries(
    theme.split(' ').map(entry => [entry, true])
  )

  const modal = (
    <div className="modalBackground">
      <Theme {...themes}>
        <div className="modal">
          <div className="modalContent">
            {children}
          </div>
        </div>
      </Theme>
    </div>
  )

  return ReactDOM.createPortal(
    modal,
    document.body
  )
}

export default Modal
