import '../App.css'

const Tag = (props) => {
    return (
      <span className="tag-content">
        {props.tag}
      </span>
    )
  }

export default Tag;