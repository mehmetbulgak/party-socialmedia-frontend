import React, { Component } from 'react'
import { findPeople, follow } from './apiUser'
import { Link } from 'react-router-dom'
import DefaultProfile from '../images/pp.jpeg'
import { isAuthenticated } from '../auth'
import '../css/findPeople.css'

class FindPeople extends Component {
    constructor() {
        super()

        this.state = {
            users: [],
            error: '',
            open: false
        }
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        findPeople(userId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ users: data })
            }
        })
    }

    clickFollow = (user, i) => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        follow(userId, token, user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    let toFollow = this.state.users
                    toFollow.splice(i, 1)
                    this.setState({
                        users: toFollow,
                        open: true,
                        followMessage: `Following ${user.name}`
                    })
                }
            })
    }

    renderUsers = (users) => (
        <div className="users-item-container">
            {users.map((user, i) => (
                <div className="users-item" key={i}>
                    <img
                        style={{ width: '100px' }}
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                        alt={user.name}
                        onError={i => (i.target.src = `${DefaultProfile}`)} />
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <Link to={`/user/${user._id}`}>View Profile</Link>
                    <button className='followButton' onClick={() => this.clickFollow(user, i)}>Follow</button>
                </div>
            ))}
        </div>
    )

    render() {
        const { users, open, followMessage } = this.state

        return (
            <div className="users">
                <h1>Find People</h1>
                <div className="line"></div>
                {open && (<p>{followMessage}</p>)}
                {this.renderUsers(users)}
            </div>
        )
    }
}

export default FindPeople