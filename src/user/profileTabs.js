import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import DefaultProfile from '../images/pp.jpeg'

class profileTabs extends Component {
    render() {
        const { following, followers, posts } = this.props
        return (
            <div className="profile-second">
                <div className="followers">
                    <h4>Followers</h4>
                    {followers.map((person, i) => {
                        return <p key={i}>
                            <img
                                onError={i => (i.target.src = `${DefaultProfile}`)}
                                src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                alt={person.name}
                                style={{ width: '100px' }} />
                            <Link to={`${person._id}`}>
                                {person.name}
                            </Link>
                        </p>
                    })}
                </div>

                <div className="following">
                    <h4>Following</h4>
                    {following.map((person, i) => {
                        return <p key={i}>
                            <img
                                onError={i => (i.target.src = `${DefaultProfile}`)}
                                src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                alt={person.name}
                                style={{ width: '100px' }} />
                            <Link to={`${person._id}`}>
                                {person.name}
                            </Link>
                        </p>
                    })}
                </div>

                <div className="posts">
                    <h4>Posts</h4>
                    {posts.map((post, i) => {
                        return <div key={i}>
                            <Link to={`/posts/${post._id}`}>
                                <h3>{post.title}</h3>
                            </Link>
                        </div>
                    })}
                </div>
            </div>
        )
    }
}

export default profileTabs