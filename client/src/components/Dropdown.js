import React, { Component } from 'react'; 

class Dropdown extends React.Component {
    constructor(props) {
        super(props); 

        this.state = {
            showMenu: false, 
            tags: props.tags === null ? [] : props.tags,
            updatetags: [], 
        }

        this.showMenu = this.showMenu.bind(this)
    }

    showMenu = (event) => {
        event.preventDefault(); 

        this.setState({
            showMenu: this.state.showMenu === true ? false : true,
        });
    }

    addOldTag = (event, id) => {
        event.preventDefault(); 
        //console.log(event.target.key); 
        let index = this.state.tags.findIndex(tag => tag.id === id); 
        let oldTag = this.state.tags[index];
        let newTags = [...this.state.tags]
        newTags.splice(index, 1); 
        this.setState({
            //tags: this.state.tags.splice(this.state.tags.findIndex(task => task.id === id), 1)
            updatetags: this.state.updatetags.concat(oldTag),
            tags: newTags,
        });

        this.props.updateTags(oldTag); 
    }

    render() {
        return (
            <div>
                <button onClick={this.showMenu}>
                    View existing tags |v
                </button>

                {
                    this.state.showMenu && 
                        <div className="tag-menu">
                            { this.state.tags.map(tag => (
                                <button key={tag.id} onClick={(e) => this.addOldTag(e, tag.id)}>{tag.content}</button>
                            ))}
                        </div>
                }
            </div>
        )
    }
}

export default Dropdown;