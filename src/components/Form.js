import './Form.css'

export const Button = ({ children, className, ...props }) => {
  const classes = ['button']

  if (className) {
    classes.push(className)
  }

  return (
    <button className={classes.join(' ')} {...props}>
      {children}
    </button>
  )
}

export const Fieldset = ({ children, className, inline = false, ...props }) => {
  const classes = ['fieldset']

  if (inline) {
    classes.push('inline')
  }
  if (className) {
    classes.push(className)
  }

  return (
    <fieldset className={classes.join(' ')} {...props}>
      {children}
    </fieldset>
  )
}

export const Form = ({ children, className, ...props }) => {
  const classes = ['form']

  if (className) {
    classes.push(className)
  }

  return (
    <form className={classes.join(' ')} {...props}>
      {children}
    </form>
  )
}

export const Input = ({ className, ...props }) => {
  const classes = ['input']

  if (className) {
    classes.push(className)
  }

  return (
    <input className={classes.join(' ')} {...props} />
  )
}

export const Label = ({ children, className, ...props }) => {
  const classes = ['label']

  if (className) {
    classes.push(className)
  }

  return (
    <label className={classes.join(' ')} {...props}>
      {children}
    </label>
  )
}

export const Select = ({ children, className, ...props }) => {
  const classes = ['select']

  if (className) {
    classes.push(className)
  }

  return (
    <select className={classes.join(' ')} {...props}>
      {children}
    </select>
  )
}

export default Form
