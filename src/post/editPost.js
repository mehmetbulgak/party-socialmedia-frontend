import React, { Component } from 'react'
import { singlePost, update } from './apiPost'
import { isAuthenticated } from '../auth'
import { Redirect } from 'react-router-dom'
import DefaultPost from '../images/cover.jpeg'

class EditPost extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            title: '',
            body: '',
            redirectToProfile: false,
            error: '',
            fileSize: 0,
            loading: false
        }
    }

    init = postId => {
        singlePost(postId).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true })
            } else {
                this.setState({
                    id: data._id,
                    title: data.title,
                    body: data.body,
                    error: "",

                })
            }
        })
    }

    componentDidMount() {
        this.postData = new FormData();
        const postId = this.props.match.params.postId;
        this.init(postId);
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

            const postId = this.state.id
            const token = isAuthenticated().token

            update(postId, token, this.postData).then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                }
                else {
                    this.setState({ loading: false, title: '', body: '', photo: '', redirectToProfile: true })
                }
            })
        }
    }

    editPostForm = (title, body) => (
        <div>
            <hr />
            <form>
                <label>Post Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />

                <br />

                <label>Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
                <br />

                <label>Body</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}
                />
                <br />

                <button onClick={this.clickSubmit}>Update Post</button>
            </form>
        </div>
    )

    render() {
        const { id, title, body, redirectToProfile, loading, error } = this.state
        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}?${new Date().getTime()}`} />
        }
        return (
            <div>
                <h2>Edit Post</h2>
                {title}
                <div style={{ display: error ? '' : 'none' }} className="signup-error">
                    {error}
                </div>
                {loading ? (<div>Yükleniyor...</div>) : ('')}
                <img
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${id}`}
                    alt={title}
                    style={{ width: '100px' }} />
                {this.editPostForm(title, body)}
            </div>
        )
    }
}

export default EditPost