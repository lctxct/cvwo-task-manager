import React from 'react'
import axios from 'axios'
import './App.css'

// Components 
import { TaskBox, AddTaskBox } from './components/TaskBox'
import TaskLine from './components/TaskLine'
import ActionBar from './components/ActionBar'
import AddTaskModal from './components/AddTaskModal'

const baseUrl = "http://localhost:8080";



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      box: true,
      addtask: false,

      tasks: [
        {id: 1, date: '12/11', title: 'open sesame'}, 
        {id: 2, date: '13/11', title: 'but you have to remember to close the sesame'}
      ],
      tags: [
        {id: 1, content: "hello"},
        {id: 1, content: "hello again!"}, 
        {id: 1, content: "it's me, open sesame"}, 
        {id: 1, content: "i enjoy sharing all of my problems with the world"}    
      ],

      search: '',
    }

    this.changeLayout = this.changeLayout.bind(this);
    this.changeAddtask = this.changeAddtask.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
      this.setState({ addtask: true });
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
            {
              this.state.tasks
              .filter(task => task.title.includes(this.state.search))
              .map(task =>
                <TaskBox key={task.id} id={task.id} date={task.date} taskTitle={task.title} tags={
                  this.state.tags.filter(tag => tag.id === task.id)
                }/>
              )
            }
          </div>
        }

        <div id="add-task-modal" className="modal" style={this.state.addtask ? {} : { display: "none" }}>
          <AddTaskModal changeAddtask={this.changeAddtask} />
        </div>
      </div>
    )
  }
}

export default App;