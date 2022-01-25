import React from 'react'
import axios from 'axios'
import './App.css'

// Components 
import { TaskBox, AddTaskBox } from './components/TaskBox'
import TaskLine from './components/TaskLine'
import { ActionBar, TagDropdown } from './components/ActionBar'
import AddTaskModal from './components/AddTaskModal'
import ModifyTaskModal from './components/ModifyTaskModal'

const baseUrl = "http://localhost:8080";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      box: true,
      addtask: false,

      tasks: [
        {id: 1, date: '12/11', title: 'open sesame', tags: [
          {id: 1, content: "hello"}, 
          {id: 2, content: "hola"}]}, 
        {id: 2, date: '13/11', title: 'but you have to remember to close the sesame'}
      ],
      alltags: [
        {id: 3, content: "hello"},
        {id: 4, content: "hello again!"}, 
        {id: 5, content: "it's me, open sesame"}, 
        {id: 6, content: "i enjoy sharing all of my problems with the world"}    
      ],

      search: '',
      tagfilter: -1, 
      modifytask: false,
      modifyTaskID: -1,
    }

    this.changeLayout = this.changeLayout.bind(this);
    this.changeAddtask = this.changeAddtask.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleModifyTask = this.handleModifyTask.bind(this);
    this.filterTag = this.filterTag.bind(this);
  }

  componentDidMount() {
    axios
      .get(baseUrl + '/tasks')
      .then(res => {
        this.setState({
          tasks: res.data ? res.data : [],
        })
      })

    axios
    .get(baseUrl + '/tags')
    .then(res => {
      this.setState({
        alltags: res.data ? res.data : [], 
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

  handleDeleteTask = (id) => {
    console.log("deleting task with id: " + id);
    const currentTasks = this.state.tasks; 

    this.setState({
      tasks: currentTasks.filter(tasks => tasks.id !== id), 
    }); 

    axios
      .delete(baseUrl + "/task/" + id)
      .then(res => { 
        if (res.status === "error") {
          this.setState({
            tasks: currentTasks,
          }); 
        } else {
          console.log(res);
        }
      })
  }

  handleModifyTask = (id) => {
    this.setState({
      modifyTaskID: id, 
      modifytask: true,
    }); 


  }

  closeModifyTask = (id) => {
    this.setState({
      modifyTaskID: -1, 
      modifytask: false,
    }); 
  }

  renderNewTask = (taskItem) => {
    this.setState({
      tasks: this.state.tasks.concat(taskItem)
    }); 
  }

  updateNewTask = (taskItem) => {
    let taskIndex = this.state.tasks.findIndex(task => task.id === taskItem.id); 
    this.state.tasks[taskIndex] = taskItem; 
  }

  getTagsOfTask = (id) => {
    axios
    .get(baseUrl + "/tags/" + id)
    .then(res => {
      return res.data; 
    });
    return null; 
  }

  filterTag = (id) => {
    this.setState({
      tagfilter: this.state.tagfilter === -1 ? id : -1, 
    })
  }

  render() {
    return (
      <div className="main-container">

        <h1 id="title">[Doors] Task Manager</h1>

        <ActionBar changeLayout={this.changeLayout} value={this.state.search} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} alltags={this.alltags} onClick={this.filterTag} />
        <TagDropdown tags={this.state.alltags} onClick={this.filterTag}/>

        {!this.state.box &&
          <div className="task-container-line">
            {
              this.state.tasks
              .filter(task => task.title.includes(this.state.search))
              .map(task => {
                if (this.state.tagfilter === -1 || (task.tags !== undefined && task.tags !== null && task.tags.filter(tag => tag.id === this.state.tagfilter).length > 0)) {
                  return (
                    <TaskLine key={task.id} id={task.id} date={task.date} taskTitle={task.title} tags={task.tags}/>
                  )
                  
                } 
                return null;
                
              })
            }
          </div>
        }

        {this.state.box &&
          <div className="task-container-box">
            <AddTaskBox onClick={() => this.setState({ addtask: true })} />
            {
              this.state.tasks
              .filter(task => task.title.includes(this.state.search))
              .map(task => {
                if (this.state.tagfilter === -1 || (task.tags !== undefined && task.tags !== null && task.tags.filter(tag => tag.id === this.state.tagfilter).length > 0)) {
                  return (
                    <TaskBox key={task.id} id={task.id} date={task.date} taskTitle={task.title} taskDescription={task.description} tags={task.tags} handleDeleteTask={this.handleDeleteTask} handleModifyTask={this.handleModifyTask}/>
                  )
                  
                } 
                return null;
                
              })
            }
          </div>
        }

        <div id="add-task-modal" className="modal" style={this.state.addtask ? {} : { display: "none"}}>
          <AddTaskModal changeAddtask={this.changeAddtask} postTask={this.postTask} renderNewTask={this.renderNewTask}/>
        </div>

        { this.state.modifytask && 
          <div id="modify-task-modal" className="modal">
            <ModifyTaskModal closeModifyTask={this.closeModifyTask} updateNewTask={this.updateNewTask} alltags={this.getTagsOfTask(this.state.modifyTaskID)} task={
              this.state.tasks.find(task => task.id === this.state.modifyTaskID)}/> 
          </div> }
      </div>
    )
  }
}

export default App;