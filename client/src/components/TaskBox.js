import '../App.css'
import Tag from './Tag'
import RoundButton from './RoundButton'

const TaskHeader = (props) => {
    return (
      <div className="task-square-header">
        <div className="task-label">{props.label}</div>
        <RoundButton style={{backgroundColor: "#FFD41C"}} label="" onClick={() => props.handleModifyTask(props.taskID)}/>
        <RoundButton label="" onClick={() => props.handleDeleteTask(props.taskID)}/>
      </div>
    )
  }

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
      <TaskHeader importance={props.importance} label={props.date} taskID={props.id} handleDeleteTask={props.handleDeleteTask} handleModifyTask={props.handleModifyTask}/>
      <div className="task-body">
        <div className="task-title">{props.taskTitle}</div>
        <div className="task-description">{props.taskDescription}</div>
      </div>
      <div className="task-tagbox">
        {props.tags ? props.tags.map(tag => 
          <Tag key={tag.id} tag={tag.content} />  
        ) : null }
      </div>
    </div>
  )
}