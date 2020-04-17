import React from "react";
import { Button } from "@material-ui/core";
import base from "../../util/rebase.js";

// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers";

export default function PageTitle(props) {
  var classes = useStyles();

  function handleClick(e) {
    e.preventDefault();
    switch (props.button) {
      case "Clear All Tasks":
        base
          .removeDoc("tasks/user") //TODO: change to userHandle
          .then(() => {
            //document is deleted
          })
          .catch(err => {
            //handle error
          });
        break;
      default:
        console.log(props.button);
        break;
    }
  }

  return (
    <div className={classes.pageTitleContainer}>
      <Typography className={classes.typo} variant="h1" size="sm">
        {props.title}
      </Typography>
      {props.button && (
        <Button
          classes={{ root: classes.button }}
          variant="contained"
          size="large"
          color="secondary"
          onClick={handleClick}
        >
          {props.button}
        </Button>
      )}
    </div>
  );
}
