import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Home from "../../pages/home";
import Tasks from "../../pages/tasks";
import Dashboard from "../../pages/dashboard";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";

// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <>
        <Header history={props.history} />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened
          })}
        >
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route path="/app/home" component={Home} />
            <Route path="/app/tasks" component={Tasks} />
            {/*<Route path="/app/add" component={Add} />*/}

            <Route path="/app/dashboard_example" component={Dashboard} />
            <Route path="/app/typography_example" component={Typography} />
            <Route path="/app/tables_example" component={Tables} />
            <Route
              path="/app/notifications_example"
              component={Notifications}
            />
            <Route
              exact
              path="/app/ui"
              render={() => <Redirect to="/app/ui/icons_example" />}
            />
            <Route path="/app/ui/maps_example" component={Maps} />
            <Route path="/app/ui/icons_example" component={Icons} />
            <Route path="/app/ui/charts_example" component={Charts} />
          </Switch>
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
