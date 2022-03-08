import './Container.css'

const Container = ({ children, className, solid }) => {
  const classes = ['container']

  if (solid) {
    classes.push('container-solid')
  }

  if (className) {
    classes.push(className)
  }

  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  )
}

export default Container
