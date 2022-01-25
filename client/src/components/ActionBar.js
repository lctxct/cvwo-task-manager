import React from 'react';
import axios from 'axios'
import '../App.css'
const baseUrl = "http://localhost:8080";

export class TagDropdown extends React.Component {
  constructor(props) {
    super(props); 

    this.state = {
      showMenu: false,
      tags: [],
    };

    this.showMenu = this.showMenu.bind(this); 
  }

  componentDidMount() {
    console.log(this.props);
    axios
    .get(baseUrl + '/tags')
    .then(res => {
      this.setState({
        tags: res.data, 
      })
    })
  }

  showMenu = (event) => {
    console.log(this.state.tags);
    event.preventDefault(); 

    this.setState({
      showMenu: this.state.showMenu === true ? false : true,
    })
  }
  
  handleClick = (id) => {
    this.props.onClick(id); 
  }

  render() {
    return (
      <div className='dropdown'>
        <button onClick={this.showMenu}>
          View all tags |v
        </button>
  
        {
          this.state.showMenu && 
            <div className="tag-menu">
              { this.state.tags.map(tag => (
                <button cclassName="tag-dropdown-content" key={tag.id} onClick={() => this.handleClick(tag.id)}>{tag.content}</button>
              ))}
            </div>
        }
      </div>
    )
  }
}

export const ActionBar = (props) => {

  return (
      <div className="action-bar">
      <span>search</span>
      <input className="tag-search" name="search" type="text" onChange={props.onChange}></input>

      <input type="button" value="C" onClick={props.changeLayout}></input>
      </div>
  )
}