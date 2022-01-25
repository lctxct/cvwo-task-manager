import '../App.css'

const Tag = (props) => {
    return (
      <span className="tag-content" onClick={props.onClick}>
        {props.tag}
      </span>
    )
  }

export default Tag;