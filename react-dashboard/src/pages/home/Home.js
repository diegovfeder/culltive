import React, { useEffect } from "react";

// Context
import {
  useDataState,
  useDataDispatch,
  getDevices,
  getReadings
} from "../../context/DataContext";

// Components
import PageTitle from "../../components/PageTitle";
// import Widget from "../../components/Widget";
// import ApexLineChart from "./components/Chart/ApexLineChart";

// Material UI
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import CircularProgress from "@material-ui/core/CircularProgress";

//styles
import useStyles from "./styles";

const devicesColumns = [
  { label: "User", name: "user" },
  { label: "Created At", name: "createdAt" },
  { label: "Device Id", name: "deviceId" },
  { label: "Geolocation", name: "geolocation" },
  { label: "Product Type", name: "productType" },
  { label: "Firmware", name: "firmwareVersion" },
  { label: "Wifi Status", name: "wifiStatus" }
];

const readingsColumns = [
  // { label: "Sensor Data Id", name: "readingsId" },
  { label: "Device", name: "deviceId" },
  { label: "Created At", name: "createdAt" },
  { label: "Air Humidity", name: "air" },
  { label: "Lumi.1", name: "lumi1" },
  { label: "Lumi.2", name: "lumi2" },
  { label: "Soil Hum.1", name: "soil1" },
  { label: "Soil Hum.2", name: "soil2" },
  { label: "Temperature", name: "temp" }
];

const options = {
  filterType: "dropdown",
  responsive: "stacked"
};

export default function Home(props) {
  var classes = useStyles();
  const dataDispatch = useDataDispatch();

  const { devices, loadingDevices, readings, loadingReadings } = useDataState();

  useEffect(() => {
    getDevices(dataDispatch);
    getReadings(dataDispatch);
  }, [dataDispatch]);
  // FIXME:  maybe clear dataDispatch on hooks return, keep it empty

  let devicesMUIDataTable = !loadingDevices ? (
    <MUIDataTable
      title="DEVICES LIST"
      data={devices}
      columns={devicesColumns}
      options={options}
    />
  ) : (
    <div className={classes.spinnerDiv}>
      <CircularProgress
        size={200}
        thickness={2}
        className={classes.progressSpinner}
      />
    </div>
  );

  let readingsMUIDataTable = !loadingReadings ? (
    <MUIDataTable
      title="SENSOR READINGS"
      data={readings}
      columns={readingsColumns}
      options={options}
    />
  ) : (
    <div className={classes.spinnerDiv}>
      <CircularProgress
        size={200}
        thickness={2}
        className={classes.progressSpinner}
      />
    </div>
  );

  return (
    <>
      <PageTitle title="Home" button="Latest Reports" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {devicesMUIDataTable}
        </Grid>
        <Grid item xs={12}>
          {readingsMUIDataTable}
        </Grid>
      </Grid>
    </>
  );
}
