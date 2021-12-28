import '../App.css'
import RoundButton from './RoundButton'

const TaskHeader = (props) => {

    return (
      <div className="task-square-header">
        <div className="task-label">{props.label}</div>
        <RoundButton label="x" />
      </div>
    )
  }

export default TaskHeader;