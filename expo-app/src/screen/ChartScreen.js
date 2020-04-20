import React from "react";
import { globalStyles } from "../style/global";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Info,
  Warning,
  Error
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { WiHumidity } from "react-icons/wi";

import {
  VictoryAxis,
  VictoryLabel,
  VictoryLine,
  VictoryChart,
  VictoryBar,
  VictoryZoomContainer,
  VictoryScatter,
  VictoryTheme
} from "victory-native";

// Context
import {
  useDataState,
  useDataDispatch,
  getDevices,
  getReadings
} from "../context/DataContext";

// TODO: Animation for the VictoryChart
// TODO: Beautify this whole Screen!
// TODO: Design Animation for loading and Whole Graph.
// TODO: Design buttons for Hours Days Weeks
// TODO: Cancel getEvent when screen is changed, back button etc...

export default function ChartScreen({ route }) {
  var dataDispatch = useDataDispatch();
  const { devices, loadingDevices, readings, loadingReadings } = useDataState();
  const navigation = useNavigation();
  const { item } = route.params;
  const [data, setData] = React.useState(0);

  const ICON_STATES = {
    air: <WiHumidity />
  };

  function getScatterData() {
    return range(50).map(index => {
      return {
        x: random(1, 50),
        y: random(10, 90),
        size: random(8) + 3
      };
    });
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  // TODO: Develop switch case for icons
  function getIcon(icon) {
    switch (dbName) {
      case "air":
        return <Ionicon name="ios-cloud" />;
        break;
      case "lumi":
        return <Ionicon name="ios-sunny" />;
        break;
      case "humi":
        return <Ionicon name="ios-water" />;
        break;
      case "soil":
        <Ionicon name="ios-cloud" />;
        break;
      case "temp":
        <Ionicon name="ios-thermometer" />;
        break;
      case "wlvl":
        <Ionicon name="md-beaker" />;
        break;
      default:
        break;
    }
  }

  // TODO: Switch case to define item.icon
  // -outline doesnt't work for all...
  React.useEffect(() => {
    navigation.setOptions({
      title: "Chart",
      headerTitle: () => (
        <View style={styles.headerView}>
          <Text
            style={
              (styles.headerTitle,
              { color: "#FFF", fontWeight: "400", fontSize: 21 })
            }
          >
            {"Chart: " + item.name.toString().toUpperCase()}
          </Text>
        </View>
      )
    });
    console.log(item);
    setData(getRandomArbitrary(50, 3975));
    // getDevices(dataDispatch);
    // console.log(devices.data);
    getReadings(dataDispatch);
    // console.log(readings.data);
  }, []);

  // {/*{getIcon(item.dbName)}*/}
  // TODO: Show loading indicator...
  return (
    <ScrollView style={styles.container}>
      <View style={styles.valueView}>
        <View style={(styles.valueView, { flexDirection: "row", padding: 20 })}>
          <Ionicons size={80} name={item.icon} style={styles.icon} />
          {/*<View>{ICON_STATES["air"]}</View>*/}
          {/*{
            {
              air: <WiHumidity />,
              lumi: <WiHumidity />
            }[item.dbName]
          }*/}
          {/*https://www.robinwieruch.de/conditional-rendering-react*/}
          {/*{(() => {
            switch (item.dbName) {
              case "air":
                return <WiHumidity/>;
                break;
              case "humi":
                break;
              case "soil":
                break;
              case "temp":
                break;
              case "wlvl":
                break;
              default:
                break;
            }
          })()}*/}
          <Text style={styles.text}>{item.lastValue}</Text>
        </View>
        <Text style={(globalStyles.text, { fontSize: 30 })}>Latest Value</Text>

        {/*<Text style={globalStyles.h1}>{item.name}</Text>*/}
      </View>
      <View
        style={{
          flexDirection: "row",
          padding: 20
        }}
      >
        <TouchableOpacity style={globalStyles.smallButton} onPress={() => {}}>
          <Text
            style={[
              globalStyles.text,
              { color: "#fff", fontWeight: "600", fontSize: 16 }
            ]}
          >
            Hours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.smallButton} onPress={() => {}}>
          <Text
            style={[
              globalStyles.text,
              { color: "#fff", fontWeight: "600", fontSize: 16 }
            ]}
          >
            Days
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.smallButton} onPress={() => {}}>
          <Text
            style={[
              globalStyles.text,
              { color: "#fff", fontWeight: "600", fontSize: 16 }
            ]}
          >
            Weeks
          </Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.container}>
        <VictoryChart width={350}>
          <VictoryLine
            data={readings}
            x="createdAt"
            y={item.dbName.toString()}
            style={{
              data: {
                stroke: "#3ea341",
                strokeWidth: 5,
                strokeLinecap: "round"
              }
            }}
            interpolation="natural"
          />
        </VictoryChart>

        {/* <VictoryChart
          domain={{ y: [0, 100] }}
          containerComponent={
            <VictoryZoomContainer zoomDomain={{ x: [5, 35], y: [0, 100] }} />
          }
        >
          <VictoryScatter
            data={data}
            style={{
              data: {
                opacity: ({ datum }) => (datum.y % 5 === 0 ? 1 : 0.7),
                fill: ({ datum }) => (datum.y % 5 === 0 ? "tomato" : "black")
              }
            }}
          />
        </VictoryChart> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30
  },
  valueView: {
    flex: 1,
    margin: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    color: "#555"
  },
  text: {
    fontFamily: "Helvetica Neue",
    color: "#52575D",
    fontSize: 60,
    marginHorizontal: 30
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
