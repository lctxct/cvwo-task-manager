import React from 'react'
import '../App.css'
import Tag from './Tag'

class AddTaskModal extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        date: 'date...',
        title: 'title...',
        description: 'description...',
        tag: 'tag...',
        temptags: [],
  
        error: false,
        errorMessage: ''
      }
  
      this.handleFocus = this.handleFocus.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleSubmitTag = this.handleSubmitTag.bind(this);
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
  
    handleInputChange = (event) => {
      const target = event.target;
      const value = target.value;
      const name = target.name;
  
      this.setState({
        [name]: value
      })
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
        date: 'date...',
        title: 'title...',
        description: 'description...',
        tag: 'tag...',
        temptags: [],
        error: false,
        errorMessage: ''
      })

      this.props.changeAddtask();
  
    }
  
    handleSubmitTag = (event) => {
      event.preventDefault();
      if (this.state.tag !== '') {
        this.setState({
          temptags: this.state.temptags.concat(this.state.tag),
          tag: ''
        });
      }
    }
  
    render () {
      return (
        <div id="add-task-box" className="modal-box">
              <div id="add-task-header">
                <input id="add-task-date" name="date" value={this.state.date} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <span className="round-button" onClick={this.props.changeAddtask}>x</span>
              </div>
              <div id="add-task-content">
                <input id="add-task-title" name="title" value={this.state.title} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <input id="add-task-desc" name="description" value={this.state.description} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <form onSubmit={this.handleSubmitTag}>
                  <span>Add tags: </span>
                  <input name="tag" type="text" value={this.state.tag} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                  <div id="add-task-tags">
                    {this.state.temptags ? this.state.temptags.map(tag =>
                      <Tag key={tag} tag={tag} />
                    ) : null }
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
      )
    }
  }

  export default AddTaskModal;