import React from "react";
import TaskComponent from "./components/TaskComponent";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
// import purple from "@material-ui/core/colors/purple";
// import green from "@material-ui/core/colors/green";

import { Grid } from "@material-ui/core";

// import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    type: "light" // Switching the dark mode on is a single property value change.
  }
});

export default function Tasks(props) {
  return (
    <>
      <PageTitle title="Tasks" button="Clear All Tasks" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ThemeProvider theme={theme}>
            <TaskComponent />
          </ThemeProvider>
        </Grid>
      </Grid>
    </>
  );
}
