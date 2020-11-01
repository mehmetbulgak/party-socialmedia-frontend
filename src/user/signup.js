import React, { Component } from 'react'
import { signup } from '../auth/index'
import { Link } from 'react-router-dom'
import '../css/signup.css'

class Signup extends Component {
    constructor() {
        super()
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false
        }
    }

    handleChange = (name) => (event) => {
        this.setState({ error: "" })
        this.setState({ [name]: event.target.value })
    }

    clickSubmit = event => {
        event.preventDefault()
        const { name, email, password } = this.state
        const user = {
            name,
            email,
            password
        }
        signup(user)
            .then(data => {
                if (data.error) this.setState({ error: data.error })
                else this.setState({
                    error: "",
                    name: "",
                    email: "",
                    password: "",
                    open: true
                })
            })
    }

    render() {
        const { name, email, password, error, open } = this.state
        return (
            <div className='signup-container'>
                <div className='first-signup-div'>

                </div>

                <div className='second-signup-div'>
                  
                    <div className="signup-form">
                        <h2 className='signup-header'>Signup</h2>
                        <div className="signup-line"></div>

                        <div style={{ display: error ? '' : 'none' }} className="signup-error">
                            {error}
                        </div>

                        <form style={{ display: open === true ? 'none' : '' }}>
                            <label>Name</label>
                            <input onChange={this.handleChange('name')} type="text" value={name} />
                            <label>Email</label>
                            <input onChange={this.handleChange('email')} type="text" value={email} />
                            <label>Password</label>
                            <input onChange={this.handleChange('password')} type="password" value={password} />
                            <button onClick={this.clickSubmit}>Create Account</button>
                        </form>

                        <div style={{ display: open ? '' : 'none' }} className="signup-success">
                            New account is successfully created. <br /> Please <Link to='/signin'>Sign In...</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Signup