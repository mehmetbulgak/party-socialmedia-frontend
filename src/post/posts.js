import React, { Component } from 'react'
import { list } from './apiPost'
import { Link } from 'react-router-dom'
import DefaultProfile from '../images/pp.jpeg'
import DefaultPost from '../images/cover.jpeg'

class Posts extends Component {
    constructor() {
        super()

        this.state = {
            posts: []
        }
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ posts: data })
            }
        })
    }

    renderPosts = (posts) => {
        return (
            <div className="container-content">
                {posts.map((post, i) => {
                    const posterId = post.postedBy ? post.postedBy._id : ''
                    const posterName = post.postedBy ? post.postedBy.name : 'Unknown'

                    return (
                        <div className='container-item' key={i}>
                            <div className="item-header">
                                <div className="item-header-one">
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                                        alt={post.name}
                                        onError={i => (i.target.src = `${DefaultProfile}`)}
                                    />
                                </div>
                                <div className="item-header-two">
                                    <p><Link to={`/user/${posterId}`}>{posterName}</Link></p>
                                    <p className="date-p">· on {new Date(post.created).toDateString()}</p>
                                </div>
                            </div>

                            <div className="item-content">
                                <h4>{post.title}</h4>
                                <div>{post.body.substring(0, 100)}</div>
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                    alt=""
                                    onError={i => (i.target.src = `${DefaultPost}`)}
                                />
                                <Link to={`/posts/${post._id}`}>Read More...</Link>
                            </div>
                        </div>
                    )
                })}
            </div>

        )
    }

    render() {
        const { posts } = this.state

        return (
            <div className="container">
                {/* <h1>Posts</h1>
                <hr />
                {!posts.length ? <div>Yükleniyor...</div> : ( "recent posts" )} */}
                {/* <div className="container-left">
                    lol kere lol
                </div> */}
                {this.renderPosts(posts)}
            </div>
        )
    }
}

export default Posts