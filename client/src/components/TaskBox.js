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
        {props.tags ? props.tags.map(tag => 
          <Tag key={tag.content} tag={tag.content} />  
        ) : null }
      </div>
    </div>
  )
}