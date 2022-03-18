import "./Filter.css"
import { useDispatch, useSelector } from "react-redux"
import { Option, Select } from "./Form"
import { setFilterCategory } from "../store/taskListSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Filter = () => {
  const dispatch = useDispatch()

  const selectedCategory = useSelector(state => state.taskList.filter.category)

  const handleChangeCategory = (event) => {
    dispatch(setFilterCategory(event.target.value))
  }

  return (
    <div className="filter">
      <FontAwesomeIcon className="filterIcon" icon="filter" />
      <Select
        name="filter"
        onChange={handleChangeCategory}
        type="text"
        value={selectedCategory || ""}
      >
        <Option value="">All tasks</Option>
        <Option value="back bedroom">Back bedroom</Option>
        <Option value="bathroom">Bathroom</Option>
        <Option value="cats">Cats</Option>
        <Option value="dining room">Dining room</Option>
        <Option value="food">Food</Option>
        <Option value="garage">Garage</Option>
        <Option value="hall, stairs and landing">Hall, stairs and landing</Option>
        <Option value="kitchen">Kitchen</Option>
        <Option value="lounge">Lounge</Option>
        <Option value="study">Study</Option>
        <Option value="utility room">Utility room</Option>
      </Select>
    </div>
  )
}

export default Filter
