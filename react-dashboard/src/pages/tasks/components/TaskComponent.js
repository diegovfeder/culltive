import React from "react";
import base from "../../../util/rebase.js";

import {
  TextField,
  Button,
  IconButton,
  Card,
  Divider,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Switch
} from "@material-ui/core";

import { Delete as DeleteIcon } from "@material-ui/icons";

const styles = {
  done: {
    textDecoration: "line-through",
    opacity: ".5",
    display: "flex",
    width: "100%"
  },
  header: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  main: {
    width: "100%",
    maxWidth: "400px",
    margin: "20px auto"
  },
  card: {
    padding: "20px",
    margin: "20px 0"
  },
  todo: {
    position: "relative",
    display: "flex",
    flexFow: "row",
    alignContent: "space-between"
  },
  label: {
    display: "flex",
    width: "100%"
  },
  divider: {
    position: "absolute",
    width: "100%",
    top: 0
  }
};

class TaskComponent extends React.Component {
  state = {
    tasks: [],
    newTask: ""
  };

  componentDidMount() {
    base.listenToDoc("tasks/admin", {
      context: this,
      then(data) {
        if (data.tasks === undefined) {
          // deleted whole doc from Clear All Tasks
          // console.log("data is undefined");
          this.addToTasksCollection([]);
        } else {
          // console.log("data is ", data.tasks);
        }
      },
      onFailure(err) {
        //handle error
      }
    });
    base.bindDoc("tasks/admin", {
      context: this,
      then() {
        // this.setState({
        //   loading: false
        // })
      },
      onFailure(err) {
        //handle error
      }
    });
  }

  //TODO: get and use the userHandle instead of 'admin'
  addToTasksCollection = tasks => {
    base
      .addToCollection("tasks", { tasks: tasks }, "admin") //userHandle
      .then(() => {
        //document is added to the collection, do?
      })
      .catch(err => {
        console.log(err);
      });
  };

  onTextUpdate = e => {
    this.setState({ newTask: e.target.value });
  };

  addTask = () => {
    let { tasks, newTask } = this.state;
    tasks.push({ text: newTask, done: false });
    this.setState({ tasks: tasks, newTask: "" });
    this.addToTasksCollection(tasks);
  };

  deleteTask = task => {
    let { tasks } = this.state;
    tasks.splice(tasks.indexOf(task), 1);
    this.setState({ tasks: tasks, newTask: "" });
    this.addToTasksCollection(tasks);
  };

  toggle = task => {
    let { tasks } = this.state;
    tasks[tasks.indexOf(task)].done = !tasks[tasks.indexOf(task)].done;
    this.setState({ tasks: tasks, newTask: "" });
    this.addToTasksCollection(tasks);
  };

  render() {
    const { tasks, newTask } = this.state;

    return (
      <div id="main" style={styles.main}>
        <header style={styles.header}>
          <TextField
            label="Add new task"
            value={newTask}
            onChange={this.onTextUpdate}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!newTask}
            onClick={this.addTask}
          >
            Add
          </Button>
        </header>
        {tasks.length > 0 && (
          <Card style={styles.card}>
            <FormGroup>
              {tasks.map((task, index) => (
                <div key={index} style={styles.todo}>
                  {index > 0 ? <Divider style={styles.divider} /> : ""}
                  <FormControlLabel
                    control={
                      <Switch
                        color="primary"
                        checked={!task.done}
                        onChange={() => this.toggle(task)}
                      />
                    }
                    label={task.text}
                    style={task.done ? styles.done : styles.label}
                  />
                  <Tooltip title="Delete task" placement="top">
                    <IconButton
                      aria-label="delete"
                      onClick={() => this.deleteTask(task)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
            </FormGroup>
          </Card>
        )}
      </div>
    );
  }
}

export default TaskComponent;
