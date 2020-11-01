import React, { Component } from 'react'
import { isAuthenticated } from '../auth/index'
import { Redirect, Link } from 'react-router-dom'
import { read } from './apiUser'
import DefaultProfile from '../images/pp.jpeg'
import DeleteUser from './deleteUser'
import FollowProfileButton from './followProfileButton'
import ProfileTabs from './profileTabs'
import { listByUser } from '../post/apiPost'
import "../css/profile.css"

class Profile extends Component {
    constructor() {
        super()

        this.state = {
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: '',
            posts: []
        }
    }

    checkFollow = user => {
        const jwt = isAuthenticated()
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id
        })
        return match
    }

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        callApi(userId, token, this.state.user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    this.setState({ user: data, following: !this.state.following })
                }
            })
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true })
                } else {
                    let following = this.checkFollow(data)
                    this.setState({ user: data, following })
                    this.loadPosts(data._id)
                }
            })
    }

    loadPosts = userId => {
        const token = isAuthenticated().token
        listByUser(userId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ posts: data })
            }
        })
    }

    componentDidMount() {
        const userId = this.props.match.params.userId
        this.init(userId)
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId
        this.init(userId)
    }

    render() {
        const { redirectToSignin, user, posts } = this.state
        if (redirectToSignin) return <Redirect to='/signin' />

        const photoUrl = this.state.user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${this.state.user._id}?${new Date().getTime()}` : DefaultProfile

        return (
            <div className="profile-container">
                <h1>Profile</h1>
                <div className="line"></div>
                <div>
                    <div className="profile-first">
                        <img src={photoUrl} alt='pp' onError={i => (i.target.src = `${DefaultProfile}`)} />
                        <div className="profile-bio">
                            <h4>{user.name}</h4>
                            <p>Email: {user.email}</p>
                            <p>{`Joined: ${new Date(user.created).toDateString()}`}</p>
                            <p>About: {user.about}</p>
                        </div>
                        {isAuthenticated().user &&
                            isAuthenticated().user._id === user._id ? (
                                <div>
                                    <Link className="edit-btn" to={`/user/edit/${user._id}`}>
                                        Edit Profile
                            </Link>
                                    <DeleteUser userId={user._id} />
                                </div>
                            ) : (
                                <FollowProfileButton
                                    following={this.state.following}
                                    onButtonClick={this.clickFollowButton} />
                            )}
                    </div>
                    <div className="line"></div>
                    <ProfileTabs followers={user.followers} following={user.following} posts={posts} />
                </div>
            </div>
        )
    }
}

export default Profile