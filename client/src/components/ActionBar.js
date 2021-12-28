import '../App.css'

const ActionBar = (props) => {

  return (
      <div className="action-bar">
      <span>search</span>
      <input className="tag-search" name="search" type="text" onChange={props.onChange}></input>

      <input type="button" value="A"></input>
      <input type="button" value="B"></input>
      <input type="button" value="C" onClick={props.changeLayout}></input>
      </div>
  )
}

export default ActionBar;