import React, { useEffect } from "react";

//context
import {
  useDataState,
  useDataDispatch,
  getDevices,
  getReadings
} from "../../context/DataContext";

//components
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import ApexLineChart from "./components/Chart/ApexLineChart";

//Material UI
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import CircularProgress from "@material-ui/core/CircularProgress";

//styles
import useStyles from "./styles";

const devicesColumns = [
  { label: "Assigned User", name: "assignedUser" },
  { label: "Created At", name: "createdAt" },
  { label: "Device Id", name: "deviceId" },
  { label: "Geolocation", name: "geolocation" },
  { label: "Product Type", name: "productType" },
  { label: "QR Code", name: "qrCode" },
  { label: "Version", name: "version" },
  { label: "Wifi Status", name: "wifiStatus" }
];

const readingsColumns = [
  { label: "Sensor Data Id", name: "readingsId" },
  { label: "QR Code", name: "qrCode" },
  { label: "Created At", name: "createdAt" },
  { label: "Air Humidity", name: "air" },
  { label: "Soil Humidity", name: "soil" },
  { label: "Luminosity", name: "lumi" },
  { label: "Temperature", name: "temp" }
];

const options = {
  filterType: "dropdown",
  responsive: "stacked"
};

// TODO: re-base match all devices/readings collection
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
        <Grid item xs={12}>
          <Widget title="Humidity" upperTitle noBodyPadding>
            <ApexLineChart />
          </Widget>
        </Grid>
        <Grid item xs={12}>
          <Widget title="Luminosity" upperTitle noBodyPadding>
            <ApexLineChart />
          </Widget>
        </Grid>
        <Grid item xs={12}>
          <Widget title="Temperature" upperTitle noBodyPadding>
            <ApexLineChart />
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}
