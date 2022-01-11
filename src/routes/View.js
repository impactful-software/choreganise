import './View.css'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faHome, faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

function View ({ taskList }) {
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState(undefined)

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true)
      setTasks(await taskList.findAll())
      setLoading(false)
    }

    if (!loading && tasks === undefined) {
      fetchTasks()
    }
  })

  return (
    <div>
      <nav className="viewLinks">
        <Link to="/" className="homeLink">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link to="/edit" className="addTaskLink">
          <FontAwesomeIcon icon={faPlusCircle} />
        </Link>
      </nav>
      <div className="viewPage">
        {loading ? (
          <p>Loading.</p>
        ) : !tasks || tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="taskColumn">Task</th>
                <th className="locationColumn">
                  <select className="selectRoom" type="text" name="taskLocation" defaultValue=''>
                    <option value="" disabled>Location</option>
                    <option value="hallLanding">Hall, stairs and Landing</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="backBedroom">Back Bedroom</option>
                    <option value="study">Study</option>
                    <option value="lounge">Lounge</option>
                    <option value="utilityRoom">Utility Room</option>
                    <option value="garage">Garage</option>
                    <option value="cats">Cats</option>
                    <option value="laundry">Laundry</option>
                    <option value="food">Food</option>
                    <option value="shopping">Shopping</option>
                  </select>
                </th>
                <th className="iconColumn"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id}>
                  <td className="taskColumn">
                    {task.name}
                  </td>
                  <td className="locationColumn">
                    {task.location}
                  </td>
                  <td className="iconColumn">
                    <Link to={`/edit/${task._id}`}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default View
