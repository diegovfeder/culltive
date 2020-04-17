import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontFamily: "Helvetica Neue",
    color: "#52575D"
  },
  h1: {
    fontFamily: "Helvetica Neue",
    fontSize: 40,
    color: "#52575D"
  },
  subText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#AEB5BC",
    textTransform: "uppercase"
  },
  divider: {
    marginVertical: 16
  },
  modal: {
    marginVertical: 100,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center"
  },
  smallButton: {
    width: "30%",
    backgroundColor: "#3ea341",
    fontSize: 16,
    borderRadius: 100,
    paddingVertical: 12,
    marginHorizontal: 4,
    marginTop: 32,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    shadowColor: "rgba(171, 180, 189, 0.35)",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 20
  },
  touchableOpacityButton: {
    width: "100%",
    backgroundColor: "#3ea341",
    position: "absolute",
    bottom: 48,
    fontSize: 16,
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 32,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    shadowColor: "rgba(171, 180, 189, 0.35)",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 20
  },
  headerTitle: {
    fontFamily: "Helvetica Neue",
    color: "#f5f5f5",
    fontWeight: "400",
    fontSize: 20
  }
});
