import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade
} from "@material-ui/core";

// Styles
import useStyles from "./styles";

// Logo
// import logo from "../../images/culltive-logo.png";

// cLogo 
import logo from "../../images/cLogo.min.svg";

// Context
import {
  useUserDispatch,
  signinUser,
  signupUser
} from "../../context/UserContext";

const Signin = props => {
  var classes = useStyles();
  var userDispatch = useUserDispatch();

  console.log('-- Signin.js'); 



  // local
  const [isLoading, setIsLoading] = useState(false);
  // const [errors, setErrors] = useState(false);
  const [error, setError] = useState(null);
  const [activeTabId, setActiveTabId] = useState(0);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        {/*<Typography className={classes.customLogotypeText}>Culltive</Typography>*/}
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Acessar" classes={{ root: classes.tab }} />
            {/* <Tab label="Sign Up" classes={{ root: classes.tab }} /> */}
          </Tabs>
          {/*SIGN IN TAB*/}
          {activeTabId === 0 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Culltive, a natureza perto de você!
              </Typography>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Verifique se seu e-mail e senha estão corretos.
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
                margin="normal"
                placeholder="E-mail"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Senha"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.signinLoader} />
                ) : (
                  <Button
                    disabled={
                      emailValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={() =>
                      signinUser(
                        userDispatch,
                        emailValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError
                      )
                    }
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.signinButton}
                  >
                    Entrar
                  </Button>
                )}
              </div>
            </React.Fragment> 
          )}
          {/*SIGN UP TAB*/}
          {activeTabId === 1 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Bem vindo!
              </Typography>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Verifique se seu e-mail e senha estão corretos.
                </Typography>
              </Fade>
              <TextField
                id="name"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                margin="normal"
                placeholder="Full Name"
                type="email"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Senha"
                type="password"
                fullWidth
              />
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    onClick={() =>
                      signupUser(emailValue, passwordValue, props.history)
                    }
                    disabled={
                      emailValue.length === 0 ||
                      passwordValue.length === 0 ||
                      nameValue.length === 0
                    }
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Sign Up
                  </Button>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </Grid>
  );
};

Signin.propTypes = {
  emailValue: PropTypes.string
};

export default withRouter(Signin);
