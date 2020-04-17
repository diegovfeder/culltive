// https://stackoverflow.com/questions/30266831/hide-show-components-in-react-native
// The idea behind this task is the create a state variable called state having the initial value set to false when the button click event happens then it value toggles. Now we will use this state variable during the creation of component.

// the only one thing to notice in this snippet is renderIf which is actually a function which will return the component passed to it based on the boolean value passed to it.

// renderIf(predicate)(element)

// renderif.js
// 'use strict';
// const isFunction = input => typeof input === 'function';
// export default predicate => elemOrThunk =>
//   predicate ? (isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : null;

import renderIf from "./renderIf";

class FetchSample extends Component {
  constructor() {
    super();
    this.state = {
      status: false
    };
  }

  toggleStatus() {
    this.setState({
      status: !this.state.status
    });
    console.log("toggle button handler: " + this.state.status);
  }

  render() {
    return (
      <View style={styles.container}>
        {renderIf(this.state.status)(
          <Text style={styles.welcome}>I am dynamic text View</Text>
        )}

        <TouchableHighlight onPress={() => this.toggleStatus()}>
          <Text>touchme</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
