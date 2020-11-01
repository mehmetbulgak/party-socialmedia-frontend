import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/home'
import Menu from './core/menu'
import Signin from './user/signin'
import Signup from './user/signup'
import Profile from './user/profile'
import Users from './user/users'
import EditUser from './user/editUser'
import FindPeople from './user/findPeople'
import NewPost from './post/newPost'
import EditPost from './post/editPost'
import SinglePost from './post/singlePost'
import PrivateRoute from './auth/privateRoute'

const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/posts/:postId" component={SinglePost} />
            <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signin" component={Signin} />
            <PrivateRoute exact path="/user/:userId" component={Profile} />
            <PrivateRoute exact path="/user/edit/:userId" component={EditUser} />
            <PrivateRoute exact path="/findPeople" component={FindPeople} />
            <PrivateRoute exact path="/post/create" component={NewPost} />
        </Switch>
    </div>
)

export default MainRouter