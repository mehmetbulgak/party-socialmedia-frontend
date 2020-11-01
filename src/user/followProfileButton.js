import React, { Component } from 'react'
import { follow, unfollow } from './apiUser'

class followProfileButton extends Component {
    followClick = () => {
        this.props.onButtonClick(follow)
    }

    unfollowClick = () => {
        this.props.onButtonClick(unfollow)
    }

    render() {
        return (
            <div>
                {
                    !this.props.following ? (
                        <button className="follow-btn" onClick={this.followClick}>Follow</button>
                    ) : (
                            <button className="unfollow-btn" onClick={this.unfollowClick}>Unfollow</button>
                        )
                }
            </div>
        )
    }
}

export default followProfileButton