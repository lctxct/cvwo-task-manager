import React from 'react'
import axios from 'axios'
import '../App.css'
import Tag from './Tag'
import Dropdown from './Dropdown';

const baseUrl = "http://localhost:8080";

class ModifyTaskModal extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {      
        task: props.task,  
        id: props.task.id,
        date: props.task.date, 
        title: props.task.title, 
        description: props.task.description,
        tags: props.task.tags === null ? [] : props.task.tags,
        
        alltags: props.alltags === null ? [] : props.alltags, 

        newtags: [], 
        updatetags: [],
        removetags: [], 


        error: false,
        errorMessage: ''
      };
  
      this.handleFocus = this.handleFocus.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleSubmitTag = this.handleSubmitTag.bind(this);
      this.updateTags = this.updateTags.bind(this);
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

    updateTags = (tag) => {
      this.setState({
        updatetags: this.state.updatetags.concat(tag),
      });
    }

    newTags = (tags) => {
      this.setState({
        newtags: tags, 
      })
    }

    handleSubmit = async(event) => {
      event.preventDefault(); 
      if (this.state.title === 'title...' || this.state.title === "") {
        this.setState({
          error: true, 
          errorMessage: "title not filled"
        })
        return 
      }

      let modifiedTask = {
        id: this.state.id, 
        date: this.state.date, 
        title: this.state.title,
        description: this.state.description,
      }

      axios
      .post(baseUrl + "/update/task/" + this.state.id, modifiedTask)
      .then(res => {
        let id = res.data.id;

        for (let i = 0; i < this.state.removetags.length; i++) {
          axios
          .delete(baseUrl + "/remove/" + id + "/" + this.state.removetags[i])
          .then(res => console.log(res)); 
        }

        for (let i = 0; i < this.state.newtags.length; i++) {
          axios
          .post(baseUrl + "/tag", {id: id, content: this.state.newtags[i].content}); 
        }

        for (let i = 0; i < this.state.updatetags.length; i++) {
          axios.post(baseUrl + "/tasktag", {task_id: id, tag_id: this.state.updatetags[i].id});
        }
      }); 

      this.state.tags.concat(this.state.updatetags); 
      this.state.tags.concat(this.state.newtags);

      modifiedTask.tags = this.state.tags === null ? [] : this.state.tags; 
      this.props.updateNewTask(modifiedTask); 

      this.props.closeModifyTask(); 

    }

    handleClose = (event) => {
      event.preventDefault();

      this.props.closeModifyTask(); 
    }
  
    handleSubmitTag = (event) => {
      event.preventDefault();
      if (this.state.tag !== '') {
        this.setState({
          newtags: this.state.newtags.concat({id: this.state.newtags.length+1, content: this.state.tag}),
          tag: ''
        });
      }
    }

    removeTag = (event, removeType, id) => {
      console.log("yes shush"); 

      if (removeType === "cur") {
        let tagIndex = this.state.tags.findIndex(tag => tag.id === id); 
        let tagValue = this.state.tags[tagIndex]; 
        
        this.setState({
          removetags: this.state.removetags.concat(id), 
          alltags: this.state.alltags.concat(tagValue), 
          tags: this.state.tags.splice(tagIndex, 1),
        }); 
      } else if (removeType === "exist") {
        let tagIndex = this.state.updatetags.findIndex(tag => tag.id === id); 
        let tagValue = this.state.updatetags[tagIndex]; 
        
        this.setState({
          alltags: this.state.alltags.concat(tagValue), 
          updatetags: this.state.updatetags.splice(tagIndex, 1),
        }); 
      } else if (removeType === "new") {
        let tagIndex = this.state.newtags.findIndex(tag => tag.id === id); 
        let tagValue = this.state.newtags[tagIndex]; 

        this.setState({
          newtags: this.state.newtags.splice(tagIndex, 1),
        }); 
      }

    }
  
    render () {
      return (
        <div id="add-task-box" className="modal-box">
              <div id="add-task-header">
                <input id="add-task-date" name="date" value={this.state.date} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <span className="round-button" onClick={this.handleClose}>x</span>
              </div>
              <div id="add-task-content">
                <input id="add-task-title" name="title" value={this.state.title} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <input id="add-task-desc" name="description" value={this.state.description} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                <form onSubmit={this.handleSubmitTag}>
                  <span>Add tags: </span>
                  <input name="tag" type="text" value={this.state.tag} onChange={this.handleInputChange} onFocus={this.handleFocus} onBlur={this.handleBlur} />
                  <div id="modify-task-tags">
                    {this.state.tags ? this.state.tags.map(tag =>
                      <Tag key={tag.id} tag={tag.content} onClick={(e) => this.removeTag(e, "cur", tag.id)}/>
                    ) : null }
                    {this.state.updatetags ? this.state.updatetags.map(tag =>
                      <Tag key={tag.id} tag={tag.content} onClick={(e) => this.removeTag(e, "exist", tag.id)}/>
                    ) : null }
                    {this.state.newtags ? this.state.newtags.map(tag =>
                      <Tag key={tag.id} tag={tag.content} onClick={(e) => this.removeTag(e, "new", tag.id)}/>
                    ) : null }
                  </div>
                </form>
                <Dropdown updateTags={this.updateTags} tags={this.state.alltags} />
              </div>
              {this.state.error &&
                <span id="add-task-error">{this.state.errorMessage}</span>
              }
              <div id="add-task-footer">
                <input type="button" className="modify-task-button" value="Apply changes" onClick={this.handleSubmit} />
                <input type="button" className="modify-task-button" value="Cancel" onClick={this.handleClose} />
              </div>
            </div>
      )
    }
  }

  export default ModifyTaskModal;