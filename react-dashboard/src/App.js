import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

// Components
import Layout from "./components/Layout";
// import AuthRoute from "./util/AuthRoute";

// Pages
import Error from "./pages/error";
import Signin from "./pages/signin";
import Landing from "./pages/landing/Landing";

// Context
import { useUserState } from "./context/UserContext";

// API
import axios from "axios";
axios.defaults.baseURL = "https://us-central1-culltive.cloudfunctions.net/api";

// TODO: Create a culltive.com/signin for clients and culltive.com/app/signin for admins
//   Try the following structure:
//   https://culltive.com/
//   https://culltive.com/signin
//   https://culltive.com/home

//   https://culltive.com/app/signin
//   https://culltive.com/app/dashboard

export default function App() {
  var { isAuthenticated } = useUserState();

  return (
    <BrowserRouter>
      <Switch>
        {/*client / signin-signup page*/}
        <Route exact path="/" component={Landing} />
        <Route exact path="/signin" component={Signin} />
        <PrivateRoute path="/app" component={Layout} />
        <Route exact path="/app" render={() => <Redirect to="/app/home" />} />
        {/* If url doesn't match any of the above paths*/}
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: {
                  from: props.location
                }
              }}
            />
          )
        }
      />
    );
  }
}