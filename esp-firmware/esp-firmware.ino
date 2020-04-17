/* CODE FOR CULLTIVE */

// TOOD: Stop using FirebaseArduino and start consuming https://us-central1-culltive.cloudfunctions.net/api


//ESP8266 PINOUT
//#define PIN_WIRE_SDA (4)
//#define PIN_WIRE_SCL (5)
//static const uint8_t SDA = PIN_WIRE_SDA;
//static const uint8_t SCL = PIN_WIRE_SCL;
//static const uint8_t LED_BUILTIN = 16;
//static const uint8_t D0   = 16;
//static const uint8_t D1   = 5;
//static const uint8_t D2   = 4;
//static const uint8_t D3   = 0;
//static const uint8_t D4   = 2;
//static const uint8_t D5   = 14;
//static const uint8_t D6   = 12;
//static const uint8_t D7   = 13;
//static const uint8_t D8   = 15;
//static const uint8_t D9   = 3;
//static const uint8_t D10  = 1;


#include <DHT.h>
#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>
#include <DoubleResetDetector.h>
#include <WifiLocation.h>
#include <FirebaseArduino.h>
//#define FIREBASE_HOST "culltive.firebaseio.com"
//#define FIREBASE_AUTH "3nGS42O0aNlFlRqHWepVGK2Hkafv8KFCnvDCL29w" // culltive

/*Multiplexer*/
#define MUX_A D5            // GPIO digital pins of mux (D5)
#define MUX_B D6            // GPIO digital pins of mux (D6)
#define MUX_C D7            // GPIO digital pins of mux (D7)
#define ANALOG_INPUT A0     // Input port for mux (A0)

/*DHT Humidity + Temperature Sensor*/
#define DHTTYPE DHT22       // define the dht sensor type
#define DHTPIN D2           // dht sensor pinned to GPIO4 (D2)
DHT dht(DHTPIN, DHTTYPE);   // instantiate dht object

//FIXME: Double Reset Button Click Detector
//using drd.stop() rather than relying on timeout
#define DRD_TIMEOUT 10
#define DRD_ADDRESS 0
DoubleResetDetector drd(DRD_TIMEOUT, DRD_ADDRESS);

#define Ntimes10 360 // LENGHT OF ARRAY FOR AVGS AND RESULT of 3600s = 60minutes = 1hour THAT IS THE POST-ALL TIME FOR THE SENSORS VALUES

/*WiFi Credentials*/
String ssid_ap = "CB-XXXX";   // CHANGE THIS EVERYTIME YOU UPLOAD IT TO ANOTHER ESP BOARD i.e. YOU ARE DEPLOYING A NEW PRODUCT
String password_ap = "culltive";

/*Server*/
ESP8266WebServer server;

/*Client*/
WiFiClient client;

/*IP*/
IPAddress ip(192,168,11,4);
IPAddress gateway(192,168,11,1);
IPAddress subnet(255,255,255,0);

// Keep track of the data that's going to be sent by the client (Culltive App)
String jsonBody = "";
String ssid_post = "";
String pw_post = "";
String qr_post = "";

//const int ledPin =  LED_BUILTIN;      // led built in chip
const int ledPin =  D4;                 // the number of the LED pin
const int relayPin_lights = D8;         // the input for the relay module controling the light (Led_Fita)
const int relayPin_water_pump = D3;     // the input for the relay module controling the light (pinBOMBA)

// Variables will change:
int ledState = LOW;                     // ledState used to set the LED

// Generally, you should use "unsigned long" for variables that hold time
// The value will quickly become too large for an int to store
unsigned long previousMillisLED = 0;                // will store last time LED was updated
unsigned long previousMillisMAINLOOP = 0;           // will store last time MAIN LOOP was updated

const long intervalLED = 1000;                      // interval at which LED blinks (milliseconds)
const long intervalMAINLOOP = 10000;                // interval at which MAIN LOOP executes (milliseconds)

enum STATE_NUM {WAITING_CREDENTIALS, VALIDATING_CREDENTIALS, MAIN_LOOP};
STATE_NUM STATE = WAITING_CREDENTIALS;

float dht_humi;
float dht_temp;
float ldr_lumi1;
float ldr_lumi2;
float soil_humi1;
float soil_humi2;

float avg_dht_humi;
float avg_dht_temp;
float avg_ldr_lumi1;
float avg_ldr_lumi2;
float avg_soil_humi1;
float avg_soil_humi2;

float water_level_good;
float water_level_ok;
float water_level_bad;

struct {
  float dht_humi[Ntimes10];
  uint dht_humi_err;
  float dht_temp[Ntimes10];
  uint dht_temp_err;
  float ldr_lumi1[Ntimes10];
  uint ldr_lumi1_err;
  float ldr_lumi2[Ntimes10];
  uint ldr_lumi2_err;
  float soil_humi1[Ntimes10];
  uint soil_humi1_err;
  float soil_humi2[Ntimes10];
  uint soil_humi2_err;
} data;

struct {
  char ssid[32] = "";
  char pw[32] = "";
  char qr[6] = "";
} wifi;

uint addr_global_index = 0;
int n = 0;

/***********************/
/*********SETUP*********/
/***********************/
void setup() {
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  // SETS MUX OUTPUT PINS
  pinMode(MUX_A, OUTPUT);
  pinMode(MUX_B, OUTPUT);
  pinMode(MUX_C, OUTPUT);

  // START DHT SENSOR
  dht.begin();

  // INITIALIZE LIGHTS AND WATER PUMP (RELAY) PINS
  pinMode(ledPin, OUTPUT);
  pinMode(relayPin_lights, OUTPUT);
  pinMode(relayPin_water_pump, OUTPUT);
  digitalWrite(relayPin_lights, HIGH);
  digitalWrite(relayPin_water_pump, HIGH);

  // START SERIAL
  Serial.begin(115200);
  while (!Serial);
  delay(1000);
  Serial.println();

  //TODO: DEBUG || MAKE THE DOUBLE RESET WORK
  if(drd.detectDoubleReset()) {
    Serial.println("Double Reset Detected");
  } else {
    Serial.println("No Double Reset Detected");
  }

  // HANDLING EEPROM
  EEPROM.begin(512); // commit 512 bytes of ESP8266 flash (for "EEPROM" emulation // loads the content (512 bytes) of flash into a 512-byte-array cache in RAM

//TODO: IF THE EEPROM IS READING SOME WEIRD VALUES, RESET EEPROM AND CUT TO NEXT STATE
//TODO: VALIDATE EEPROM SAVED DATA
//TODO: BREAK FROM CONNECTING STATE AND GO BACK TO INITIAL OR CLEAN EEPROM IF NOT CONNECTING
//TODO: CREATE A NOT CONNECTING VALIDATION
//- RESET EEPROM (OFF)
  clearEEPROM(); //reset eeprom
  EEPROM.commit();

  EEPROM.get(addr_global_index, wifi);  // read bytes (i.e. sizeof(data) from "EEPROM") // in reality, reads from byte-array cache, cast bytes into wifi structure

  if (String(wifi.ssid) != "" || String(wifi.pw) != "" || (String(wifi.qr) != "")) { // in case there are saved credentials in EEPROM
    Serial.println("Saved Wi-Fi Credentials are: " + String(wifi.ssid) + ", " + String(wifi.pw));
    Serial.println("Saved QR Code is: " + String(wifi.qr));

    // Try connecting to the home network
    if (connectToWiFi(String(wifi.ssid), String(wifi.pw))) {
      Serial.println("Wi-Fi connected by saved credentials.");
      qr_post = String(wifi.qr);
      STATE = MAIN_LOOP;
//      getGeoLocationHardCoded();
//      getGeoLocation();
//      postGeoLocation();
      preConfigToMainLoop();
    } else {
      Serial.println("Saved credentials didn't work. Starting normal setup..");
      clearEEPROM();
      EEPROM.commit();

      //todo: Notify user that / app by client-server communication.
      //todo: Create a way that checks if Wi-Fi is connected to ESP, notify user, create an app back to wifi config, etc...

      startSoftAPSetup();
    }
  } else { // in case EEPROM is empty
    Serial.println("There are no saved credentials");
    startSoftAPSetup();
  }

}

/***********************/
/*******MAIN*LOOP*******/
/***********************/
void loop() {

  switch(STATE) {
    case WAITING_CREDENTIALS: {
      server.handleClient();
      if (ssid_post != "" && pw_post != "" && qr_post != "") { // RECEIVED VALUES FOR CREDENTIALS
        Serial.println("WIFI CREDENTIALS - OK");
        STATE = VALIDATING_CREDENTIALS;
      }
      blinkLED();
    break;
    }
    case VALIDATING_CREDENTIALS: {
      //TODO: From time to time the Android App w/ Firebase should check for receiving data updates, and verify all sensors and outputs. Maybe use a background service.
      //     The user should get push notifications until the problem is fixed. Enable call for support?

      //TODO: If Wi-Fi credentials are invalid, notify the user using client-server communication. "Wi-Fi Credentials are invalid, please try again..."

      WiFi.softAPdisconnect(true);

      if (connectToWiFi(ssid_post, pw_post)) {
        ssid_post.toCharArray(wifi.ssid, 32); // Save succesful Wi-Fi credentials to EEPROM
        pw_post.toCharArray(wifi.pw, 32);
        qr_post.toCharArray(wifi.qr, 6);

        // SAVE WORKING CREDENTIALS TO EEPROM
        EEPROM.put(addr_global_index,wifi);
        EEPROM.commit();

        Serial.print("Saving Wi-Fi ssid: "); Serial.println(String(wifi.ssid));
        Serial.print("Saving Wi-Fi pw: "); Serial.println(String(wifi.pw));
        Serial.print("Saving Wi-Fi qr: "); Serial.println(String(wifi.qr));

//        getGeoLocation();

        STATE = MAIN_LOOP;
        preConfigToMainLoop();
      } else {
        Serial.println("Invalid WiFi Credentials, try again...");
        //todo: Notify user / app by client-server communication.
        ssid_post = ""; pw_post = ""; qr_post = "";
        ESP.restart();
      }
      delay(5000);
    break;
    }
    case MAIN_LOOP: {

      //TODO: SAVE A LIST OF VALUES, RESET EACH DAY AND SAVE ITS AVERAGE ON ANOTHER LIST (LIST OF AVARAGES PER DAY - Counting From Day 1 of the plantation...
      //- start saving values to an avg_lumi, avg_temp, etc... and after a whole hour upload to a separated space.
      //- this separated space should then save the avg of each hour, and avg of each day...

      //TODO: PRINT DATA TO MAINPANNEL DASHBOARD FASTER THAN 10SECONDS? ...SEPARATE IT FROM THE 10s LOOP...

      unsigned long currentMillis = millis();
      // NON-BLOCKING LOOP - EXECUTING EVERY 10s
      if (currentMillis - previousMillisMAINLOOP >= intervalMAINLOOP) {
        previousMillisMAINLOOP = currentMillis;
        Serial.println(n);

        readAll();
        getAll();
        printAll();

        postDashboardValues(); // post only the actual humidity, temperature and luminosity to the MainPannel Culltive app Dashboard

        postAirHumidity();
        postLuminosity();
        postSoilHumidity();
        postTemperature();

        saveToDataArray(n);
        n = n + 1;
      }


      //TODO: TESTAR SENSORES, VALIDAR VALORES
      //TODO:  IN PROCESSDATA ( COUNT ALL THE ~WRONG VALUES~ ) EXPORT THIS FAILs LOGs TO FIREBASE

      // A CADA 360 VALORES (1 HORA) TRANSPOR A MEDIA DESSES VALORES PARA O FIREBASE EM CULLTIVE
      if (n == Ntimes10){
        processData(n);


//        postAll();
//        printAverages();
//        postAverages();
        n = 0;
      }

      // SALVAR DADOS EM UMA STRUCT COM ARRAY DE ELEMENTOS E COUNTER DE ERROS.
      // VERIFICAR SE EXISTE FUNCAO ARRAY.LENGHT NO ARDUINO, SE NAO... IMPLEMENTAR UMA

      // (ISSO JA LIMPANDO OS VALORES NULL E ERROS)
      // (E UPAR TAMBEM ESSA QUANTIDADE DE ERROS PARA O FIREBASE)

      // CALCULATE THE AVERAGES AND COUNT + 1 - AND AFTER AN X NUMBER OF TIMES CALCULATE THE AVG AND SAVE TO THE FIREBASE

      // After processing all the erros, calculate te avg of all the dataarray and post to Firebase the value and the total of errors using pushFloat();

    break;
    }
    default: {
    break;
    }
  }
}


/***********************/
/****** FUNCTIONS ******/
/***********************/
void startSoftAPSetup(){
  Serial.println();
  Serial.println("-------------");
  Serial.println(" START SETUP ");
  Serial.println("-------------");

  /*Access Point Configuration*/
  Serial.print("Configuring soft-AP... ");
  WiFi.mode(WIFI_AP);
  //  WiFi.setAutoConnect(false);
  //  WiFi.disconnect(true);
  //  WiFi.softAPdisconnect(false);
  //  WiFi.setPhyMode(WIFI_PHY_MODE_11G);
  //  WiFi.setOutputPower(15); // low power

  Serial.println(WiFi.softAPConfig(ip, gateway, subnet) ? "Ready" : "Failed!");
  WiFi.softAP(ssid_ap, password_ap);
  Serial.print("IP Address: "); Serial.println(WiFi.localIP());
  IPAddress myIP = WiFi.softAPIP();
  Serial.println("AP IP address: ");
  Serial.println(myIP);
  //  WiFi.softAPmacAddress()

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  /*Server*/
  Serial.println("Starting HTTP server.");
  startServers();

  Serial.println();
  Serial.println("-------------");
  Serial.println(" SETUP DONE  ");
  Serial.println("-------------");
}

bool connectToWiFi(String ssid, String pw) {
  bool timeOut = false;
  bool wifisuccess = false;

  Serial.println("connectToWiFi: ");

  WiFi.begin(String(ssid), String(pw));
  Serial.print("Connecting to ");
  Serial.print(String(ssid));
  Serial.print(" ...");

  unsigned long startedWaiting = millis();
  while (WiFi.status() != WL_CONNECTED || timeOut) {    // Wait for the Wi-Fi to connect || timeout after 15sec
    delay(1000);
    Serial.print(".");

    if (millis() - startedWaiting >= 15000) {
      timeOut = true;
      Serial.println("...");
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifisuccess = true;
    Serial.println(" // Connection established!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());                 // Send ESP8266 IP address to the computer
  }
  return wifisuccess;
}

void preConfigToMainLoop() {
  ledState = HIGH;
  digitalWrite(ledPin, ledState);
  Serial.println();
  Serial.println("// SENSOR OUT VALUES //");
}

//todo: Create another handleServer method to communicate bad wi-fi credentials
void startServers() {
  server.on("/",handleRoot);
  server.on("/post", postThatWorks);
  server.onNotFound(handleNotFound);
  //  server.on("/login", HTTP_POST, handleLogin);
  server.begin();
}

void handleRoot() {
  //print ssid, pw and qr code to html root - ip (192.168.11.4)
  String str = ssid_post + " - " + pw_post + " - " + qr_post;
  server.send(200,"text/plain", str); // we'll need to refresh the page for getting the latest value
  Serial.println("handleRoot /200");
}

void handleNotFound(){
  server.send(404, "text/plain", "404: Not found"); // Send HTTP status 404 (Not Found) when there's no handler for the URI in the request
  Serial.println("handleNotFound /404");
}

void handleError(){
  // handle firebase error
  if (Firebase.failed()) {
     Serial.print("pushing /logs failed:");
     Serial.println(Firebase.error());
     return;
  }
}

void postThatWorks(){
  String data = server.arg("plain");
  StaticJsonBuffer<300> jBuffer;
  JsonObject& root = jBuffer.parseObject(data);
//  ssid_value = jObject["ssid"].toString;
  root.printTo(jsonBody);
  Serial.print("jsonBody: ");
  Serial.println(jsonBody);

  const char* ssid_cc = root["ssid"];
  Serial.print("SSID: ");
  Serial.println(ssid_cc);
  ssid_post = ssid_cc;

  const char* pw_cc = root["pw"];
  Serial.print("PW: ");
  Serial.println(pw_cc);
  pw_post = pw_cc;

  const char* qr_cc = root["qr"];
  Serial.print("QR: ");
  Serial.println(qr_cc);
  qr_post = qr_cc;

  server.send(204,"");
}

void getGeoLocation(){
  loc = location.getGeoFromWiFi();
  Serial.println("Location request data");
  Serial.println(location.getSurroundingWiFiJson());
  Serial.println("Latitude: " + String(loc.lat, 7));
  Serial.println("Longitude: " + String(loc.lon, 7));
  Serial.println("Accuracy: " + String(loc.accuracy));
}

void postGeoLocation(){
  String str = "";
  str = qr_post + "/lat";
  Firebase.setFloat(str, loc.lat);
  str = qr_post + "/lon";
  Firebase.setFloat(str, loc.lon);
  str = qr_post + "/acc";
  Firebase.setFloat(str, loc.accuracy);
}

//TODO: CLIENT POST TO GOOGLE GEO API, RUN ONCE WHEN WIFI GETS CONNECTED AND LINK TO 'THE W-QRcode' COLLECTION
//void postToGoogleGeoAPI() {
//  StaticJsonBuffer<300> jBuffer;
//  String line = client.readStringUntil('\r');
//  JsonObject &root = jBuffer.parseObject(line);
//  if (root.success()) {
//    latitude = root["location"]["lat"];
//    longitude = root["location"]["lng"];
//    accuracy = root["accuracy"];
//  }
//}

void readEEPROM() {
  for (int addr = 0; addr < 512; addr++) {     // there are only 512 bytes of EEPROM, from 0 to 511, so if we're on address 512, wrap around to address 0
    byte value = EEPROM.read(addr);
    Serial.print(addr);
    Serial.print("\t");
    Serial.print(value, DEC);
    Serial.println();
  }
}

void clearEEPROM() {
  for (int addr = 0; addr < 512; addr++) {
    EEPROM.write(addr, 0);
  }
}

void changeMux(int c, int b, int a){
  digitalWrite(MUX_A, a);
  digitalWrite(MUX_B, b);
  digitalWrite(MUX_C, c);
}

void blinkLED() {
  unsigned long currentMillisLED = millis();
  if (currentMillisLED - previousMillisLED >= intervalLED) {
    previousMillisLED = currentMillisLED;
    if (ledState == LOW) {
      ledState = HIGH;
    } else {
      ledState = LOW;
    }
    digitalWrite(ledPin, ledState);
  }
}


// ----------------------
// THE VERY NICE METHODS :)
// ----------------------

void getAll() {
  String str = "";

  // RELAY CONTROL FOR LIGHTS AND WATER PUMP
  Serial.println("--GET--");
  str = qr_post + "/sb_lights";
  boolean sb_lights = Firebase.getBool(str);
  str = qr_post + "/water_pump";
  boolean water_pump = Firebase.getBool(str);

  if (sb_lights) {
    Serial.println("sb_lights = true");
    digitalWrite(relayPin_lights, LOW);
  } else {
    Serial.println("sb_lights = false");
    digitalWrite(relayPin_lights, HIGH);
  }

  if (water_pump) {
    Serial.println("water_pump = true");
    digitalWrite(relayPin_water_pump, LOW);
  } else {
    Serial.println("water_pump = false");
    digitalWrite(relayPin_water_pump, HIGH);
  }
}

void readAll() {

  //DHT SENSOR
  dht_temp = dht.readTemperature();
  dht_humi  = dht.readHumidity();

  // ANALOG INPUTS AND MULTIPLEXER LOGIC
  // LDR
  changeMux(LOW, LOW, LOW); //LDR 1 set to I/O #0 OF CD4051 CI PINOUT #13
  ldr_lumi1 = analogRead(ANALOG_INPUT);
  delay(500);
  changeMux(LOW, LOW, HIGH); //LDR 2 set to I/O #1 OF CD4051 CI PINOUT #14
  ldr_lumi2 = analogRead(ANALOG_INPUT);
  delay(500);
  // SOIL
  changeMux(LOW, HIGH, LOW);  //SOIL 1 set to I/O #2 OF CD4051 CI PINOUT #15
  soil_humi1 = analogRead(ANALOG_INPUT);
  delay(500);
  changeMux(LOW, HIGH, HIGH);  //SOIL 2 set to I/O #3 OF CD4051 CI PINOUT #12
  soil_humi2 = analogRead(ANALOG_INPUT);

  delay(500);
  // WATER LEVEL
  changeMux(HIGH, LOW, LOW);  //W LEVEL set to I/O #4 OF CD4051 CI PINOUT #1
  water_level_good = analogRead(ANALOG_INPUT);
  Serial.print("LOG: Water Level Good: "); Serial.println(water_level_good);
  delay(500);
  changeMux(HIGH, LOW, HIGH); //W LEVEL set to I/O #5 OF CD4051 CI PINOUT #5
  water_level_ok = analogRead(ANALOG_INPUT);
  Serial.print("LOG: Water Level Ok: "); Serial.println(water_level_ok);
  delay(500);
  changeMux(HIGH, HIGH, LOW);  //W LEVEL set to I/O #6 OF CD4051 CI PINOUT #2
  water_level_bad = analogRead(ANALOG_INPUT);
  Serial.print("LOG: Water Level Bad: "); Serial.println(water_level_bad);
  changeMux(HIGH, HIGH, HIGH);

  // ANALOG TO DIGITAL LOGIC FOR WATER PUMP
  analogToDigital(water_level_good);
  analogToDigital(water_level_ok);
  analogToDigital(water_level_bad);
}


void analogToDigital(float n){
  if (n > 500) n = 1;
  else n = 0;
}

void printAll() {
  Serial.print("dht_humi: ");
  Serial.println(dht_humi);

  Serial.print("dht_temp: ");
  Serial.println(dht_temp);

  Serial.print("ldr_lumi1: ");
  Serial.println(ldr_lumi1);

  Serial.print("ldr_lumi2: ");
  Serial.println(ldr_lumi2);

  Serial.print("soil_humi1: ");
  Serial.println(soil_humi1);

  Serial.print("soil_humi2: ");
  Serial.println(soil_humi2);
//  Serial.println();
}

void printAverages() {
  Serial.print("Average of dht_humi: ");
  Serial.println(avg_dht_humi);

  Serial.print("Average of dht_temp: ");
  Serial.println(avg_dht_temp);

  Serial.print("Average of ldr_lumi1: ");
  Serial.println(avg_ldr_lumi1);

  Serial.print("Average of ldr_lumi2: ");
  Serial.println(avg_ldr_lumi2);

  Serial.print("Average of soil_humi1: ");
  Serial.println(avg_soil_humi1);

  Serial.print("Average of soil_humi2: ");
  Serial.println(avg_soil_humi2);

  Serial.println();
}

void saveToDataArray(int n_saveToDataArray) {
  if (n_saveToDataArray >= 0 && n_saveToDataArray < Ntimes10) {
    data.dht_humi[n_saveToDataArray] = dht_humi;
    data.dht_temp[n_saveToDataArray] = dht_temp;
    data.ldr_lumi1[n_saveToDataArray] = ldr_lumi1;
    data.ldr_lumi2[n_saveToDataArray] = ldr_lumi2;
    data.soil_humi1[n_saveToDataArray] = soil_humi1;
    data.soil_humi2[n_saveToDataArray] = soil_humi2;
  } else {
    Serial.print("ERROR - N - Data Array Overflow: "); Serial.println(n_saveToDataArray);
  }
}

void processData(int n_avg){
    avg_dht_humi = averageOf(data.dht_humi, n_avg);
    avg_dht_temp = averageOf(data.dht_temp, n_avg);
    avg_ldr_lumi1 = averageOf(data.ldr_lumi1, n_avg);
    avg_ldr_lumi2 = averageOf(data.ldr_lumi2, n_avg);
    avg_soil_humi1 = averageOf(data.soil_humi1, n_avg);
    avg_soil_humi2 = averageOf(data.soil_humi2, n_avg);
}

float averageOf(float a[], int n) {

  float sum = 0;
  for (int i =0; i < n; i++) {
    sum = sum +  a[i];
  }
  return sum/n;
}

void postDashboardValues(){
  String str = "";

  Serial.println("--POST--");
  Serial.println("tv_humi: ");
  Serial.println(dht_humi);
  Serial.println("tv_lumi: ");
  Serial.println(ldr_lumi1);
  Serial.println("tv_temp: ");
  Serial.println(dht_temp);
  Serial.println();

  str = qr_post + "/tv_humi";
  Firebase.setFloat(str, dht_humi);

  handleError();

  str = qr_post + "/tv_temp";
  Firebase.setFloat(str, dht_temp);
  handleError();

  str = qr_post + "/tv_lumi";
  Firebase.setFloat(str, ldr_lumi1);
  handleError();
}

void postAirHumidity() {
  String str = "";
  const int capacity = JSON_OBJECT_SIZE(10);
  StaticJsonBuffer<capacity> jb;
  JsonObject &root = jb.createObject();
  JsonObject &air_humidity = root.createNestedObject("air_humidity");
  air_humidity["qr"].set(qr_post);
  air_humidity["value"].set(avg_dht_humi);
//  air_humidity["time"].set(0);
//  air_humidity["geo"].set(0);
  str = "air_humidity";
  Firebase.push(str, air_humidity);

  // THIS CODE RETURNS 1 IF SUCCESS, 0 IF FAILED
//  Serial.print("Air Humidity POST: "); Serial.println(Firebase.success());

  handleError();
}

void postLuminosity() {
  String str = "";
  const int capacity = JSON_OBJECT_SIZE(10);
  StaticJsonBuffer<capacity> jb;
  JsonObject &root = jb.createObject();
  JsonObject &luminosity = root.createNestedObject("luminosity");
  luminosity["qr"].set(qr_post);
  luminosity["value"].set(avg_ldr_lumi1);
//  luminosity["time"].set(0);
//  luminosity["geo"].set(0);
  str = "luminosity";
  Firebase.push(str, luminosity);
  handleError();
}

void postSoilHumidity() {
  String str = "";
  const int capacity = JSON_OBJECT_SIZE(10);
  StaticJsonBuffer<capacity> jb;
  JsonObject &root = jb.createObject();
  JsonObject &soil_humidity = root.createNestedObject("soil_humidity");
  soil_humidity["qr"].set(qr_post);
  soil_humidity["value"].set(avg_soil_humi1);
//  soil_humidity["time"].set(0);
//  soil_humidity["geo"].set(0);
  str = "soil_humidity";
  Firebase.push(str, soil_humidity);
  handleError();
}

void postTemperature() {
  String str = "";
  const int capacity = JSON_OBJECT_SIZE(10);
  StaticJsonBuffer<capacity> jb;
  JsonObject &root = jb.createObject();
  JsonObject &temperature = root.createNestedObject("temperature");
  temperature["qr"].set(qr_post);
  temperature["value"].set(avg_ldr_lumi1);
//  temperature["time"].set(0);
//  temperature["geo"].set(0);
  str = "temperature";
  Firebase.push(str, temperature);
  handleError();
}

void postAverages() {
  String str = "";

  str = qr_post + "/stats" + "/avg_dht_humi";
  Firebase.pushFloat(str, avg_dht_humi);
  handleError();

  str = qr_post + "/stats" + "/avg_dht_temp";
  Firebase.pushFloat(str, avg_dht_temp);
  handleError();

  str = qr_post + "/stats" + "/avg_soil_humi1";
  Firebase.pushFloat(str, avg_soil_humi1);
  handleError();

  str = qr_post + "/stats" + "/avg_soil_humi2";
  Firebase.pushFloat(str, avg_soil_humi2);
  handleError();

  str = qr_post + "/stats" + "/avg_ldr_lumi1";
  Firebase.pushFloat(str, avg_ldr_lumi1);
  handleError();


  str = qr_post + "/stats" + "/avg_ldr_lumi2";
  Firebase.pushFloat(str, avg_ldr_lumi2);
  handleError();


}

// SEND ALL DATA TO FIREBASE
void postAll(){
  String str = "";

  str = qr_post + "/all_info" + "/dht_humi";
  Firebase.pushFloat(str, dht_humi); // Envia o dado da variavel Umidade
  handleError();

  str = qr_post + "/all_info" + "/dht_temp";
  Firebase.pushFloat(str, dht_temp); // Envia o dado da variavel Temperatura
  handleError();

  str = qr_post + "/all_info" + "/soil_humi1";
  Firebase.pushFloat(str, soil_humi1); // Umidade do solo1
  handleError();

  str = qr_post + "/all_info" + "/soil_humi2";
  Firebase.pushFloat(str, soil_humi2); // Umidade do solo2
  handleError();

  str = qr_post + "/all_info" + "/ldr_lumi1";
  Firebase.pushFloat(str, ldr_lumi1); // Envia o dado da variavel luz
  handleError();

  str = qr_post + "/all_info" + "/ldr_lumi2";
  Firebase.pushFloat(str, ldr_lumi2); // Envia o dado da variavel luz2
  handleError();
}
