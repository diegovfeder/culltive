import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal
} from "react-native";
// TODO: Implement Modal using this library
// https://github.com/react-native-community/react-native-modal
import { globalStyles } from "../style/global";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useAsyncStorage } from "../util/useAsyncStorage";

export default function BarCodeScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modal, setModal] = React.useState(false);

  // TODO: Finish this useAsyncStorage thing...
  // const [qrCode, setQrCode] = useAsyncStorage("qrCode", "CB-XXXX");

  useEffect(() => {
    // setModal(true);
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // TODO: Show popup? with the Device QR id and ask if it matches. Then make the user click NEXT to continue...
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Modal
        style={globalStyles.modal}
        visible={modal}
        animation={"fade"}
        transparent={true}
        presentationStyle={"overFullScreen"}
      >
        <View style={{ backgroundColor: "000000aa", flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#f9f9f9",
              marginTop: 120,
              marginBottom: 40,
              marginHorizontal: 30,
              paddingTop: 36,
              paddingHorizontal: 30,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 2.65,
              elevation: 4
            }}
          >
            <Text style={{ fontSize: 32 }}>This is a Modal...</Text>

            <TouchableOpacity
              style={globalStyles.touchableOpacityButton}
              onPress={() => {
                setModal(false);
              }}
            >
              <Text
                style={[
                  globalStyles.text,
                  { color: "#fff", fontWeight: "600", fontSize: 16 }
                ]}
              >
                Close Modal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {/*TODO: Animate something while/after reading QR-CODE */}
      {scanned && (
        <TouchableOpacity
          style={globalStyles.touchableOpacityButton}
          onPress={() => setScanned(false)}
        >
          <Text
            style={[
              globalStyles.text,
              { color: "#fff", fontWeight: "600", fontSize: 16 }
            ]}
          >
            Tap to Scan Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 30,
    justifyContent: "flex-end",
    alignItems: "center"
  }
});
