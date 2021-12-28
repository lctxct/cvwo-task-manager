import '../App.css'
import Tag from './Tag'
import TaskHeader from './TaskHeader'

export const AddTaskBox = ({ onClick }) => {
  return (
    <div className="add-task-square" onClick={onClick}>
      <span className="add-task-image">+</span>
    </div>
  )
}

export const TaskBox = (props) => {
  return (
    <div className="task-square">
      <TaskHeader importance={props.importance} label={props.date} />
      <div className="task-body">
        <span className="task-title">{props.taskTitle}</span>
      </div>
      <div className="task-tagbox">
        <Tag tag="this is a super long tag to check out how the tag works oooooooo" />
        <Tag tag="shorty" />
        <Tag tag="another shorty" />
      </div>
    </div>
  )
}