import React from "react";
import { useHistory } from "react-router-dom";

// Components
import YouTube from "react-youtube";

// Material UI
import {AppBar, Button, Container, CssBaseline, Grid, Link, makeStyles, Toolbar, Typography} from "@material-ui/core";

// Logo
import logo from "../../images/culltive-logo.png";
import logo_small from "../../images/culltive-logo-sm.jpeg";

// import cLogo 
// import logo from "../../images/cLogo.min.svg";
// import logo_small from "../../images/cLogo.min.svg";


// Styles
const useStyles = makeStyles(theme => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  },
  youtube: {
    resizeMode: "contain",
    margin: "5px 10px 5px 10px"
  },
  customLogotypeText: {
    color: "white",
    borderRadius: 3,
    fontWeight: 400,
    fontSize: "6rem",
    boxShadow: 100,
    [theme.breakpoints.down("md")]: {
      fontSize: 48
    }
  },
  fragment: {
    backgroundColor: "#f7f7f7"
  },
  logotypeContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  logotypeImage: {
    margin: theme.spacing(5),
    width: 260

  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    minHeight: "64px",
    paddingLeft: "24px",
    paddingRight: "24px",
    flexWrap: "wrap",
    display: "flex",
    position: "relative"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  toolbarImage: {
    width: 64
  },
  signinButton: {
    // left: "93%",
    // margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6)
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2)
  },
  footer: {
    borderTop: `2px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    }
  }
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://culltive.me/">
        Culltive
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Landing() {
  const classes = useStyles();
  const history = useHistory();


  function _onReady(event) {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }

  return (
    <React.Fragment>
      <CssBaseline />
      {/* Header */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <img src={logo_small} alt="logo" className={classes.toolbarImage} />
            <Button
              color="primary"
              variant="outlined"
              className={classes.signinButton}
              onClick={() => history.replace("/signin")}
              type="button"
            >
              Entrar
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* Body */}
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <YouTube
          className={classes.youtube}
          videoId="piH0I6usMp0"
          onReady={_onReady}
        />
      </div>

      {/* Footer */}
      <Container className={classes.footer}>
        <Copyright />
      </Container>
    </React.Fragment>
  );
}
