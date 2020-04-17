import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

// redux
import { useSelector } from "react-redux";
// import { connect } from "react-redux";

export default function AuthRoute({
  component: Component,
  authenticated,
  ...rest
}) {
  authenticated = useSelector(state => state.user.authenticated);

  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}

AuthRoute.propTypes = {
  user: PropTypes.object
};

// const mapStateToProps = state => ({
//   authenticated: state.user.authenticated
// });

// export default connect(mapStateToProps)(AuthRoute);
