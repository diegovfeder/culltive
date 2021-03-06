import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

import { Drawer, IconButton, List } from "@material-ui/core";
import {
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon, //Tasks Icon
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  InsertChart as ChartIcon,
  ArrowBack as ArrowBackIcon
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";

// Styles
import useStyles from "./styles";

// Components
import SidebarLink from "./components/SidebarLink/SidebarLink";
// import Dot from "./components/Dot";

// Context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar
} from "../../context/LayoutContext";

const structure = [
  { id: 0, label: "Home", link: "/app/home", icon: <HomeIcon /> },
  
  // Charts for selected device and sensor values
  { id: 1, label: "Charts", link: "/app/charts", icon: <ChartIcon /> },
  
  // Tasks / Todo 
  { id: 2, label: "Tasks", link: "/app/tasks", icon: <CheckCircleIcon /> },

  // Following UI / Feature examples that could be developed...
  { id: 5, type: "divider" },
  { id: 6, type: "title", label: "EXAMPLES" },
  {
    id: 10,
    label: "Dashboard",
    link: "/app/dashboard_example",
    icon: <HomeIcon />
  },
  {
    id: 20,
    label: "Typography",
    link: "/app/typography_example",
    icon: <TypographyIcon />
  },
  { id: 30, label: "Tables", link: "/app/tables_example", icon: <TableIcon /> },
  {
    id: 40,
    label: "Notifications",
    link: "/app/notifications_example",
    icon: <NotificationsIcon />
  },
  {
    id: 50,
    label: "UI Elements",
    link: "/app/ui",
    icon: <UIElementsIcon />,
    children: [
      { label: "Icons", link: "/app/ui/icons_example" },
      { label: "Maps", link: "/app/ui/maps_example" }
    ]
  }
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // Global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // Local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened
        })
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse)
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
