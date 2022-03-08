import './Section.css'

const Section = ({ children, className }) => {
  const classes = ['section']

  if (className) {
    classes.push(className)
  }

  return (
    <section className={classes.join(' ')}>
      {children}
    </section>
  )
}

export default Section
