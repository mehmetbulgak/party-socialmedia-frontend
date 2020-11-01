import React, { Component } from 'react'
import { comment, uncomment } from "./apiPost"
import { isAuthenticated } from "../auth"
import { Link } from "react-router-dom"
import DefaultProfile from "../images/pp.jpeg"

class Comment extends Component {
    state = {
        text: '',
        error: ""
    }

    handleChange = event => {
        this.setState({ error: "" })
        this.setState({ text: event.target.value })
    };

    isValid = () => {
        const { text } = this.state
        if (!text.length > 0 || text.length > 150) {
            this.setState({
                error:
                    "Comment should not be empty and less than 150 characters long"
            })
            return false
        }
        return true
    }

    addComment = e => {
        e.preventDefault()

        if (!isAuthenticated()) {
            this.setState({ error: "Please signin to leave a comment" })
            return false
        }

        if (this.isValid()) {
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token
            const postId = this.props.postId

            comment(userId, token, postId, { text: this.state.text }).then(
                data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({ text: "" })
                        this.props.updateComments(data.comments);
                    }
                }
            )
        }
    }

    deleteComment = comment => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.props.updateComments(data.comments);
            }
        });
    };

    deleteConfirmed = comment => {
        let answer = window.confirm(
            "Are you sure you want to delete your comment?"
        );
        if (answer) {
            this.deleteComment(comment);
        }
    };

    render() {
        const { comments } = this.props
        const { error } = this.state
        return (
            <div className="comment-container">
                <div style={{ display: error ? '' : 'none' }}>
                    {error}
                </div>

                <form onSubmit={this.addComment}>
                    <p>Leave a comment</p>
                    <div>
                        <input type="text" onChange={this.handleChange} value={this.state.text} />
                        <button>Submit</button>
                    </div>
                </form>

                <p>Comments {comments.length}</p>
                {comments.map((comment, i) => {
                    return <div className="comments" key={i}>
                        <img
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                            alt={comment.postedBy.name}
                            style={{ width: '100px' }} />
                        <div className="comments-header">
                            {comment.text}
                            <Link to={`/user/${comment.postedBy._id}`}>
                                {comment.postedBy.name}
                            </Link>
                            <p className="comments-date">{new Date(comment.created).toDateString()}</p>
                        </div>
                        <button>
                            {
                                isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id &&
                                (<span onClick={() => this.deleteConfirmed(comment)}>Remove</span>)
                            }
                        </button>
                    </div>
                })}


            </div>
        )
    }
}

export default Comment