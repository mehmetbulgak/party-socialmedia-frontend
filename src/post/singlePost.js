import React, { Component } from 'react'
import { singlePost, remove, like, unlike } from './apiPost'
import DefaultProfile from '../images/pp.jpeg'
import DefaultPost from '../images/cover.jpeg'
import { Link, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../auth/index'
import Comment from './comment'
import '../css/singlePost.css'


class SinglePost extends Component {
    state = {
        post: '',
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0,
        comments: []
    }

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id
        let match = likes.indexOf(userId) !== -1
        return match
    }

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    post: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    comments: data.comments
                });
            }
        });
    };

    updateComments = comments => {
        this.setState({ comments })
    }

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId
        const token = isAuthenticated().token
        remove(postId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ redirectToHome: true })
            }
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm(
            'Are you sure you want to delete this post?'
        )
        if (answer) {
            this.deletePost()
        }
    }

    renderPost = (post) => {

        const posterId = post.postedBy ? post.postedBy._id : ''
        const posterName = post.postedBy ? post.postedBy.name : 'Unknown'

        const { like, likes } = this.state

        return (
            <div className="singlepost-container">
                <div className="single-post-header">
                    <img
                        style={{ width: '100px' }}
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                        alt={post.name}
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                    />
                    <Link className="pp-link" to={`/user/${posterId}`}>{posterName}</Link>
                    <p className="date-p">· on {new Date(post.created).toDateString()}</p>
                </div>

                <div className="single-post-body">
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                    <img
                        src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                        alt=""
                        onError={i => (i.target.src = `${DefaultPost}`)}
                    />
                    <button>
                        {like ? (
                            <p onClick={this.likeToggle}>{likes} Like</p>
                        ) : (
                                <p onClick={this.likeToggle}>{likes} Like</p>
                            )}
                    </button>
                </div>

                {isAuthenticated().user &&
                    isAuthenticated().user._id === post.postedBy._id &&
                    <>
                        <Link to={`/post/edit/${post._id}`}><button>Edit Post</button></Link>
                        <button onClick={this.deleteConfirmed}>Delete Post</button>
                    </>
                }
            </div>
        )
    }

    render() {
        const { post, redirectToHome, redirectToSignin, comments } = this.state
        if (redirectToHome) {
            return <Redirect to={`/`} />
        } else if (redirectToSignin) {
            return <Redirect to={`/signin`} />
        }
        return (
            <div>
                {!post ? (<div style={{width:"80%", margin:"20px auto"}}>Loading...</div>) : (this.renderPost(post))}
                <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />
            </div>
        )
    }
}

export default SinglePost