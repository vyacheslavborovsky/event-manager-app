import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import PrivateRoute from "../containers/PrivateRoute";

import '../styles/global.css'
import '../styles/material-override.css'

const AppRoutes = ({routes, location}) => {
    return (
        <ReactCSSTransitionGroup
            component="div"
            transitionName="md-cross-fade"
            transitionEnterTimeout={100}
            transitionLeave={false}
            className="col-12 grid-8-center-middle-noGutter main-container">
            <Switch key={location.pathname}>
                <Route exact path="/" render={() => <Redirect to={"/login"}/>}/>

                {routes.map(route => {
                    if (route.isPrivate) {
                        return (
                            <PrivateRoute key={route.label}
                                          path={route.path}
                                          exact={route.exact}
                                          component={route.component}/>
                        )
                    }

                    return (
                        <Route key={route.label}
                               path={route.path}
                               exact={route.exact}
                               component={route.component}/>
                    )
                })}
            </Switch>
        </ReactCSSTransitionGroup>
    )
};

export default withRouter(AppRoutes);
