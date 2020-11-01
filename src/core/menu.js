import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { signout, isAuthenticated } from '../auth/index'
import '../css/menu.css'
import Logo from '../images/logo.svg'

const Menu = ({ history }) => (
    <div className='navbar'>

        <Link to='/'>
            <img src={Logo} style={{ width: '70px' }} alt="" />
        </Link>

        {!isAuthenticated() && (
            <div>
                <div className='sign'>
                    <Link to='/signin'>Sign In</Link>
                    <Link className='signup' to='/signup'>Sign Up</Link>
                </div>

                <div className="mobile-sign">
                    <i class="fas fa-bars fa-lg"></i>
                </div>
            </div>
        )}

        {isAuthenticated() && (
            <div>
                <div className="signed">
                    <Link to='/users' className="users-link">
                        <i className="fas fa-users"></i>
                    </Link>
                    <Link
                        to={`/user/${isAuthenticated().user._id}`}
                        className="profile-link"
                    >
                        <i className="fas fa-user-circle"></i>
                    </Link>

                    <Link
                        to={`/findpeople`}
                        className="findpeople-link"
                    >
                        <i className="fas fa-search"></i>
                    </Link>

                    <Link
                        to={`/post/create`}
                        className="create-link"
                    >
                        <i className="fas fa-plus"></i>
                    </Link>

                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => signout(() => history.push('/'))}>
                        Sign Out
                    </span>
                </div>

                <div className="mobile-sign">
                    <i class="fas fa-bars fa-lg"></i>
                </div>
            </div>
        )}

    </div>
)

export default withRouter(Menu)