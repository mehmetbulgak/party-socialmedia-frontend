import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { signin, authenticate } from '../auth/index'
import '../css/signin.css'

class Signin extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        }
    }

    handleChange = (name) => (event) => {
        this.setState({ error: "" })
        this.setState({ [name]: event.target.value })
    }

    clickSubmit = event => {
        event.preventDefault()
        this.setState({ loading: true })
        const { email, password } = this.state
        const user = {
            email,
            password
        }
        signin(user)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error, loading: false })
                }
                else {
                    authenticate(data, () => {
                        this.setState({ redirectToReferer: true })
                    })
                }
            })
    }

    signinForm = (email, password) => (
        <form>
            <label>Email</label>
            <input onChange={this.handleChange('email')} type="text" value={email} />

            <br />

            <label>Password</label>
            <input onChange={this.handleChange('password')} type="password" value={password} />

            <br />

            <button onClick={this.clickSubmit}>Login</button>
        </form>
    )

    render() {
        const { email, password, error, redirectToReferer, loading } = this.state

        if (redirectToReferer) {
            return <Redirect to='/' />
        }

        return (
            <div className="signin-container">
                <div className='signin-form'>
                    <h2 className='signin-header'>Signin</h2>
                    

                    <div style={{ display: error ? '' : 'none' }} className="signup-error">
                        {error}
                    </div>

                    {loading ? (<div>Yükleniyor...</div>) : ('')}

                    {this.signinForm(email, password)}
                </div>
            </div>
        )
    }
}

export default Signin