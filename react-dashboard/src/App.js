import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import "./App.css";

// components
import Layout from "./components/Layout";
// import AuthRoute from "./util/AuthRoute";

// pages
import Error from "./pages/error";
import Login from "./pages/login";
import NewLandingPage from "./pages/landing/TestNewLandingPage";

import { useUserState } from "./context/UserContext";

axios.defaults.baseURL = "https://us-central1-culltive.cloudfunctions.net/api";

export default function App() {
  var { isAuthenticated } = useUserState();

  return (
    // <Provider store={store}>
    <BrowserRouter>
      <Switch>
        {/*TODO: Create a culltive.com/login for clients and culltive.com/app/login for admins
          Try the following structure:
          https://culltive.com/
          https://culltive.com/login
          https://culltive.com/home

          https://culltive.com/app/login
          https://culltive.com/app/dashboard*/}
        {/*client / login-signup page*/}
        {/*<Route exact path="/" component={LandingPage} />*/}
        <Route exact path="/" component={NewLandingPage} />
        {/*<Route exact path="/login" component={TestLogin} />*/}
        {/*admin app / login page (signup if pend aproval)*/}
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/app" component={Layout} />
        <Route exact path="/app" render={() => <Redirect to="/app/home" />} />
        {/* If url doesn't match any of the above paths*/}
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
    // </Provider>
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
                pathname: "/login",
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

  // function PublicRoute({ component, ...rest }) {
  //   return (
  //     <Route
  //       {...rest}
  //       render={props =>
  //         isAuthenticated ? (
  //           <Redirect
  //             to={{
  //               pathname: "/"
  //             }}
  //           />
  //         ) : (
  //           React.createElement(component, props)
  //         )
  //       }
  //     />
  //   );
  // }
}

//  Old code used to verify and then route user who was once isAuthenticated
// but also to signOut if token expired
// ----------------------------------------
// var userDispatch = useUserDispatch();
// const token = localStorage.FBIdToken;
// if (!!token) {
//   const decodedToken = jwtDecode(token);
//   console.log(this.history);
//   if (decodedToken.exp * 1000 < Date.now()) {
//     signOut(userDispatch, this.history);
//     window.location.href = "/login";
//   } else {
//     autoSignIn(userDispatch, this.history);
//     axios.defaults.headers.common["Authorization"] = token;
//     // store.dispatch(getUserData());
//   }
// } else {
//   console.log(this.history);
//   console.log("There is no token");
// }
