import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  SectionList,
  SafeAreaView,
  Alert
} from "react-native";
import { globalStyles } from "../styles/global";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { Divider } from "react-native-paper";
import { List, ListItem, Avatar } from "react-native-elements";

// Context
import {
  useDataState,
  useDataDispatch,
  getDevices,
  getReadings
} from "../context/DataContext";

export default function ReportScreen() {
  var dataDispatch = useDataDispatch();
  const { devices, loadingDevices, readings, loadingReadings } = useDataState();
  const navigation = useNavigation();

  var today = new Date();
  const date =
    today.getDate() +
    "/" +
    parseInt(today.getMonth() + 1) +
    "/" +
    today.getFullYear();
  console.log(date);

  React.useEffect(() => {
    // navigation.setOptions({
    //   title: "Report: " + date.toString()
    // });

    navigation.setOptions({
      title: "Report",
      headerTitle: () => (
        <View style={styles.headerView}>
          <Text
            style={
              (styles.headerTitle,
              {
                color: "#FFF",
                fontWeight: "400",
                fontSize: 22
              })
            }
          >
            Report:
          </Text>
          <Text
            style={
              (styles.headerSubtitle,
              {
                color: "#FFF",
                fontWeight: "300",
                fontSize: 14,
                paddingBottom: 8
              })
            }
          >
            {date.toString()}
          </Text>
        </View>
      )
    });

    // getDevices(dataDispatch);
    // getReadings(dataDispatch);
    // console.log(devices.data);
    // console.log(readings.data);
  }, []);

  //TODO: data hooks, useEffect to upload api fetch
  const list = [
    {
      name: "Air humidity",
      dbName: "air",
      icon: "ios-cloud",
      subtitle: "Vice Chairman",
      lastValue: 50,
      rightTitle: "50 %"
    },
    {
      name: "Light ratio",
      dbName: "lumi",
      icon: "ios-sunny",
      subtitle: "Online",
      lastValue: 3,
      rightTitle: "18 : 6"
    },
    {
      name: "Soil humidity",
      dbName: "soil",
      icon: "ios-water",
      lastValue: 20,
      rightTitle: "20 %"
    },
    {
      name: "Temperature",
      dbName: "temp",
      icon: "ios-thermometer",
      subtitle: "Online",
      lastValue: 28,
      rightTitle: "28 °C"
    },
    {
      name: "Water level",
      dbName: "wlvl",
      icon: "md-beaker",
      subtitle: "Online",
      lastValue: "full",
      rightTitle: "Full"
    }
  ];

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      subtitle={"Status: " + item.subtitle}
      leftAvatar={{
        icon: { name: item.icon, type: "ionicon", color: "#303030" },
        size: "large",
        overlayContainerStyle: { backgroundColor: "white" }
      }}
      rightTitle={item.rightTitle}
      rightIcon={{ name: "chevron-right" }}
      bottomDivider={true}
      onPress={() => {
        navigation.navigate("Chart", { item: item });
      }}
    />
  );

  // TODO: Fetch data from firebaseDB
  // TODO: Spinner/loader when list is dragged down
  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  divider: {
    marginVertical: 32
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});

// TODO: Loading data Animation
// if (isLoading) {
//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" animating />
//     </View>
//   );
// } else { return ...}
