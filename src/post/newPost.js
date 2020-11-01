import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { isAuthenticated } from '../auth/index'
import { create } from './apiPost'
import '../css/createPost.css'

class NewPost extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            body: '',
            photo: '',
            error: '',
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        }
    }

    componentDidMount() {
        this.postData = new FormData()
        this.setState({ user: isAuthenticated().user })
    }


    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 1000000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            })
            return false
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", loading: false })
            return false
        }
        return true
    }

    handleChange = name => event => {
        this.setState({ error: "" })
        const value = name === "photo" ? event.target.files[0] : event.target.value
        const fileSize = name === "photo" ? event.target.files[0].size : 0
        this.postData.set(name, value)
        this.setState({ [name]: value, fileSize })
    }

    clickSubmit = event => {
        event.preventDefault()
        this.setState({ loading: true })

        if (this.isValid()) {

            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token

            create(userId, token, this.postData).then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                }
                else {
                    this.setState({ loading: false, title: '', body: '', photo: '', redirectToProfile: true })
                }
            })
        }
    }

    newPostForm = (title,body) => (
        <div className='createpost-form'>
            <form>
                <label>Post Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                />

                <label>Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="createpost-input"
                    value={title}
                />

                <label>Body</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="createpost-textarea"
                    value={body}
                />

                <button className="createPost-button" onClick={this.clickSubmit}>Create Post</button>
            </form>
        </div>
    )

    render() {
        const { id, title, body, photo, user, error, loading, redirectToProfile } = this.state

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />
        }

        return (
            <div className='createPost-container'>
                <h1>Create a new post</h1>

                <div style={{ display: error ? '' : 'none' }} className="signup-error">
                    {error}
                </div>

                {loading ? (<div>Yükleniyor...</div>) : ('')}

                {this.newPostForm(title,body)}
            </div>
        )
    }
}

export default NewPost