import '../App.css'

const TaskLine = (props) => {
    return (
        <div className="task-line">
        <span className="task-line-title">{props.taskTitle}</span>
        <span className="task-line-date">{props.date}</span>
        </div>
    )
}

export default TaskLine;