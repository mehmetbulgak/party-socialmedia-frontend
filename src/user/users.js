import React, { Component } from 'react'
import { list } from './apiUser'
import { Link } from 'react-router-dom'
import DefaultProfile from '../images/pp.jpeg'
import '../css/users.css'

class Users extends Component {
    constructor() {
        super()

        this.state = {
            users: []
        }
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ users: data })
            }
        })
    }

    renderUsers = (users) => (
        <div className="users-item-container">
            {users.map((user, i) => (

                <div className="users-item" key={i}>
                    <img
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                        alt={user.name}
                        onError={i => (i.target.src = `${DefaultProfile}`)} />
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <Link to={`/user/${user._id}`}>View Profile</Link>
                </div>

            ))}
        </div>
    )

    render() {
        const { users } = this.state

        return (
            <div className="users">
                <h1>Users</h1>
                <div className="line"></div>
                {this.renderUsers(users)}
            </div>
        )
    }
}

export default Users