import '../App.css'

const RoundButton = (props) => {
  return (
    <span className="round-button" onClick={props.onClick} style={props.style}>{props.label}</span>
  )
}

export default RoundButton;