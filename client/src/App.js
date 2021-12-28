import React from 'react'
import axios from 'axios'
import './styles/App.css'

const baseUrl = "http://localhost:8080";

const Tag = (props) => {
  return (
    <span className="tag-content">
      {props.tag}
    </span>
  )
}

const RoundButton = (props) => {
  return (
    <span className="round-button">{props.label}</span>
  )
}

const TaskHeader = (props) => {

  return (
    <div className="task-square-header">
      <div className="task-label">{props.label}</div>
      <RoundButton label="x" />
    </div>
  )
}

const AddTaskBox = ({ onClick }) => {
  return (
    <div className="add-task-square" onClick={onClick}>
      <span className="add-task-image">+</span>
    </div>
  )
}

const TaskBox = (props) => {
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

const TaskLine = (props) => {
  return (
    <div className="task-line">
      <span className="task-line-title">{props.taskTitle}</span>
      <span className="task-line-date">{props.date}</span>
    </div>
  )
}

const ActionBar = (props) => {
  return (
    <div className="action-bar">

      <input className="tag-search" name="search" type="text" value={props.value} onChange={props.onChange} onFocus={props.onFocus} onBlur={props.onBlur}></input>
      <input className="tag-search-submit" type="button" value="x"></input>

      <input type="button" value="A"></input>
      <input type="button" value="B"></input>
      <input type="button" value="C" onClick={props.hangeLayout}></input>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      box: true,
      addtask: false,

      tasks: [],

      search: 'search...',

      date: 'date...',
      title: 'title...',
      description: 'description...',
      tag: 'tag...',
      tags: [],
      error: false,
      errorMessage: ''
    }
  }

  componentDidMount() {
    axios.get(baseUrl + '/all')
      .then(res => {
        console.log("hello from the inside")
        this.setState({
          tasks: res.data
        })
      })
  }

  changeLayout = () => {
    if (this.state.box) {
      this.setState({ box: false });
    } else {
      this.setState({ box: true });
    }
  }

  changeAddtask = () => {
    if (this.state.addtask) {
      this.setState({ addtask: false });
    } else {
      this.setState({
        addtask: true,
        tags: []
      });
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  handleFocus = (event) => {
    const name = event.target.name;

    if (this.state[name] === name + "...") {
      this.setState({
        [name]: ""
      })
    }
  }

  handleBlur = (event) => {
    const name = event.target.name;

    if (this.state[name] === "") {
      this.setState({
        [name]: name + "..."
      })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.title === 'title...' || this.state.title === "") {
      this.setState({
        error: true, 
        errorMessage: "title not filled"
      })
      return 
    }

    

    this.setState({
      addtask: false,
      date: 'date...',
      title: 'title...',
      description: 'description...',
      tag: 'tag...',
      tags: [],
      error: false,
      errorMessage: ''

    })
  }

  handleSubmitTag = (event) => {
    event.preventDefault();
    if (this.state.tag !== '') {
      this.setState({
        tags: this.state.tags.concat(this.state.tag),
        tag: ''
      });
    }
  }

  render() {
    return (
      <div className="main-container">

        <h1 id="title">Super Generic Task Manager Name</h1>


        <ActionBar changeLayout={this.changeLayout} value={this.state.search} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
        {!this.state.box &&
          <div className="task-container-line">
            <TaskLine importance="high" taskTitle="hello" date="12/07/2021" />
            <TaskLine importance="high" taskTitle="hello this is another task" date="12/07/2021" />
          </div>
        }

        {this.state.box &&

          <div className="task-container-box">
            <AddTaskBox onClick={() => this.setState({ addtask: true })} />
            <TaskBox taskTitle="this is a super duper long task title meant to test out if the flex stuff works" date="12/04/2021" />
            {
              this.state.tasks.map(task =>
                <TaskBox id={task.id} date={task.date} taskTitle={task.title} />
              )
            }
          </div>
        }

        <div id="add-task-modal" className="modal" style={this.state.addtask ? {} : { display: "none" }}>
          <div id="add-task-box" className="modal-box">
            <div id="add-task-header">
              <input id="add-task-date" name="date" value={this.state.date} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
              <span className="round-button" onClick={this.changeAddtask}>x</span>
            </div>
            <div id="add-task-content">
              <input id="add-task-title" name="title" value={this.state.title} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
              <input id="add-task-desc" name="description" value={this.state.description} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
              <form onSubmit={this.handleSubmitTag}>
                <span>Add tags: </span>
                <input name="tag" type="text" value={this.state.tag} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <div id="add-task-tags">
                  {this.state.tags.map(tag =>
                    <Tag key={tag} tag={tag} />
                  )}
                </div>
              </form>
            </div>
            {this.state.error &&
              <span id="add-task-error">{this.state.errorMessage}</span>
            }
            <div id="add-task-footer">
              <input type="button" value="Add Task" onClick={this.handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;