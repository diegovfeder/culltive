/** @file CULLTIVE FIRMWARE
    @brief This code  provides low-level control for the very first culltive device hardware.

    ** Important details about its implementation should go in these comments.
    

    @author Diego V. Feder (@diegovfeder)
    @bug No known bugs (probably a lie...)
*/

#include <Arduino.h>
#include <ArduinoJson.h>
#include <asyncHTTPrequest.h>
#include <DHT.h> 
#include <DoubleResetDetector.h>
#include <EEPROM.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>   
#include <ESP8266WiFi.h>
#include <ESP8266Ping.h>
#include <ESP8266mDNS.h>
#include <Ticker.h>
#include <WiFiClientSecure.h>


// ------------------------------------------------------- //
//                     CONSTANTS / VARIABLES
// ------------------------------------------------------- //

/*Product Definition*/
#define DEVICE_ID "CULLTIVE-00Y"
#define PRODUCT_TYPE "SINGLE"
#define FIRMWARE_VERSION "alpha"

/*RTC Memory Address for the DoubleResetDetector*/
#define DRD_ADDRESS 0
/*Total gap in seconds for DoubleResetDetector*/
#define DRD_TIMEOUT 2
DoubleResetDetector drd(DRD_TIMEOUT, DRD_ADDRESS);

/*DHT - Humidity + Temperature Sensor*/
#define DHTTYPE DHT22       
#define DHTPIN D2 // DHT pinned to GPIO4 (D2)
DHT dht(DHTPIN, DHTTYPE);     

/*Status LED*/
#define ledPin D0 //LED (ON/OFF) GPIO 16 (D0)

/*Device actions*/
#define ledTapePin D8 // LED TAPE GPIO 15 (D8)
#define waterPumpPin D3 // WATER PUMP GPIO 0 (D3)

/*Multiplexer*/
#define ANALOG_INPUT A0     // Input port for mux (A0)
#define MUX_A D5            // GPIO 14 digital pins of mux (D5)
#define MUX_B D6            // GPIO 12 digital pins of mux (D6)
#define MUX_C D7            // GPIO 13 digital pins of mux (D7)

/*Allocate a 512-byte-array flash-mem into cache in RAM*/
#define EEPROM_SIZE 512

/*Define the Wi-Fi object that saves credentials from the App after device is paired*/
struct WIFI {
  char ssid[32] = ""; // TECHNO
  char password[32] = ""; // MELODICO
  char user[32] = ""; // diegovfeder@gmail.com
} wifi;

struct Reading {
  float air = 0;
  float lumi1 = 0;
  float lumi2 = 0;
  float soil1 = 0;
  float soil2 = 0;
  float temp = 0;
  String waterLevel = "";
} readings;

enum STATE_NUM {WAITING_CREDENTIALS, VALIDATING_CREDENTIALS, RETURN_VALIDATION, TESTING_CONNECTION, RETURN_CONNECTION, CERTIFY_SUCCESS, RETURN_SUCCESS ,SAVING_CREDENTIALS, POST_DEVICE, CLOSE_SERVER, WATER_PUMP, MAIN_LOOP};
STATE_NUM STATE = WAITING_CREDENTIALS;
//TODO: Create a state to return errors to the App // or basically the state and the logs where the pairing failed // or return errors and logs to firestore if already connected...


//TODO: Define LED DEVICE_STATES: led will prompt states as feedback to the user.
// Example: 4s blink // 1s blink // 250ms blink // OFF
// enum DEVICE_STATE {IDLE, CONNECTED, else... };

/* Access Point Wi-Fi Credentials */
String ssid_ap_name = "Acesse www.culltive.me";  
//FIXME: Testing no password access point
// String ssid_ap_name = PRODUCT_ID
// String ssid_ap_name = "CULLTIVE-000"; 
// String password_ap = "culltive.me";

/* GET_CREDENTIALS ASSIGNMENTS */
// Keep track of the data that's going to be sent by the client (App)
String ssid_post = "";
String password_post = "";
String user_post = "";

/*IP*/
IPAddress ip(192,168,11,4);
IPAddress gateway(192,168,11,1);
IPAddress subnet(255,255,255,0);

/*Server*/
ESP8266WebServer server;

/* Outputs: Actuator variables*/
int ledState = LOW; // ledState used to output a LED value (ON/OFF -> HIGH/LOW)

/* Inputs: Sensor variables */
float dht_humi; //air (sensor)
float dht_temp; //temp (sensor)
float ldr_lumi1; //lumi (sensor)
float ldr_lumi2;
float soil_humi1; //soil (sensor)
float soil_humi2;
float water_level_high; //water_level (digital states)
float water_level_med;
float water_level_low;
String water_level_state;
bool water_pump; //water_pump (switch)
bool led_tape; //led_tape (switch)

/* EEPROM Global Index Address */
uint addr_global_index = 0;

/* Time delays (ms) for async threads */
long checkDueTime = 0;
int checkDelay = 15000; // 15s || 60 x 1000ms (1 minute)

// Wait to close softAp server
long wait = 0;

unsigned long previousMillisLED = 0;                // will store last time LED was updated
unsigned long previousMillisRESET = 0;              // will store last time for RESET Esp8266
unsigned long previousMillisMAINLOOP = 0;           // will store last time MAIN LOOP was updated
const long intervalLED = 1000;                      // interval at which LED blinks (ms)          //TODO: this should change by deviceStates (enum)
const long intervalRESET = 10000;    
const long intervalMAINLOOP = 30000;    
const long intervalACTION = 2000;                // interval at which MAINLOOP runs (ms)


//TODO: Testing this on handleConnection
String credentialsState = "";
String connectionState = "";
String pairState = "";

bool validationStatusReturned = false;
bool connectionStatusReturned = false;
bool pairStatusReturned = false; // app verifies if new device was instantiated in firestore
bool devicePosted = false; // app verifies if new device was instantiated in firestore

//TODO: 
// Ticker ticker;

// ------------------------------------------------------- //
//                     FUNCTIONS / METHODS
// ------------------------------------------------------- //

//*** API ***

// TODO: Get the value from waterPump using ## DEVICE_ID
// TODO: Get the latest updates on deviceReadings??? ## DEVICE_ID
void getLastDeviceReading(){
  HTTPClient https;
  BearSSL::WiFiClientSecure client;
  client.setInsecure();
  long now = millis();
  if(now >= checkDueTime) {
    https.begin(client, "https://us-central1-culltive.cloudfunctions.net/api/device/reading");
    int httpsCode = https.GET();
    
    //Check http response status code                                                                  
    if (httpsCode > 0) {
      // Get the request response payload
      String payload = https.getString();
      Serial.println(payload);
      payload.remove(0,1); // Remove "[]" characters from payload String
      payload.remove(payload.length() - 1);
      // Serial.println(payload);

      StaticJsonDocument<500> doc;
      DeserializationError err = deserializeJson(doc, payload);

      if (err) {
        Serial.print("ERROR:");
        Serial.println(err.c_str());
        return;
      }

      String deviceId = doc["deviceId"];
      String productType = doc["productType"];
      String assignedUser = doc["assignedUser"];
      String geolocation = doc["geolocation"];
      String firmwareVersion = doc["firmwareVersion"];
      String createdAt = doc["createdAt"];
      String wifiStatus = doc["wifiStatus"];

      Serial.println("deviceId: " + deviceId);
      Serial.println("productType: " + productType);
      Serial.println("assignedUser: " + assignedUser);
      Serial.println("geolocation: " + geolocation);
      Serial.println("firmwareVersion: " + firmwareVersion);
      Serial.println("createdAt: " + createdAt);
      Serial.println("wifiStatus: " + wifiStatus);
      Serial.println("--------------");
    } else {
      return;
    }

    checkDueTime = now + checkDelay;
  }
  
  https.end();
}

void getGeolocation(){
  HTTPClient https;
  BearSSL::WiFiClientSecure client;
  client.setInsecure();
  long now = millis();
  if(now >= checkDueTime) {
    https.begin(client, "https://us-central1-culltive.cloudfunctions.net/geolocation");
    int httpsCode = https.GET();
    
    // Check http response status code                                                                  
    if (httpsCode > 0) {
      // Get the request response payload
      String payload = https.getString();
      Serial.println(payload);
      const int capacity =JSON_OBJECT_SIZE(5);
      StaticJsonDocument<capacity>doc;
      DeserializationError err = deserializeJson(doc, payload);

      if (err) {
        Serial.print("ERROR:");
        Serial.println(err.c_str());
        //TODO: If error do something. (ERROR:NoMemory)
        return;
      }

      String country = doc["country"];
      String region = doc["region"];
      String city = doc["city"];
      String cityLatLong = doc["cityLatLong"];
      String userIP = doc["userIP"];

      Serial.println("country: " + country);
      Serial.println("region: " + region);
      Serial.println("city: " + city);
      Serial.println("cityLatLong: " + cityLatLong);
      Serial.println("userIP: " + userIP);
      Serial.println("--------------");
    }

    checkDueTime = now + checkDelay;
  }
  
  https.end();
}

void getDevices(){
  HTTPClient https;
  BearSSL::WiFiClientSecure client;
  client.setInsecure();
  long now = millis();
  if(now >= checkDueTime) {
    https.begin(client, "https://us-central1-culltive.cloudfunctions.net/api/devices");
    int httpsCode = https.GET();

    // Check http response status code                  
    if (httpsCode < 0) { 
        Serial.println("request error - " + httpsCode);
        return;
    }
    if (httpsCode != HTTP_CODE_OK) { // caso o status for diferente de 200, reinicia o ciclo da requisicao
      return;
    }
    // else...
    // if (httpsCode > 0) {
    // Get the request response payload
    String payload = https.getString();
    payload.remove(0,1); // Remove "[]" characters from payload String
    payload.remove(payload.length() - 1);
    // Serial.println(payload);

    const int capacity = JSON_OBJECT_SIZE(10);
    StaticJsonDocument<capacity>doc;
    // StaticJsonDocument<500> doc;
    DeserializationError err = deserializeJson(doc, payload);

    if (err) {
      Serial.print("ERROR:");
      Serial.println(err.c_str());
      return;
    }

    String deviceId = doc["deviceId"];
    String productType = doc["productType"];
    String assignedUser = doc["assignedUser"];
    String geolocation = doc["geolocation"];
    String firmwareVersion = doc["firmwareVersion"];
    String createdAt = doc["createdAt"];
    String wifiStatus = doc["wifiStatus"];

    Serial.println("deviceId: " + deviceId);
    Serial.println("productType: " + productType);
    Serial.println("assignedUser: " + assignedUser);
    Serial.println("geolocation: " + geolocation);
    Serial.println("firmwareVersion: " + firmwareVersion);
    Serial.println("createdAt: " + createdAt);
    Serial.println("wifiStatus: " + wifiStatus);
    Serial.println("--------------");
    // }

// String payload = http.getString(); // passando das verificacoes acima, voce tem acesso ao corpo da mensagem retornado pelo servidor
// http.end(); // finaliza a conexao
// Serial.println("##[RESULT]## ==> " + payload); // imprimi na serial a string retornada pelo servidor

    checkDueTime = now + checkDelay;
  }
  
  https.end();
}

void getDeviceAction() {
  
  HTTPClient https;
  BearSSL::WiFiClientSecure client;
  client.setInsecure();
  long now = millis();
  if(now >= checkDueTime) {
    Serial.println("-- GET_DEVICE_ACTION");
    String endpoint = "https://us-central1-culltive.cloudfunctions.net/api/device/" + String(DEVICE_ID) + "/action";
    // Serial.println(endpoint);

    https.begin(client, endpoint);
    int httpsCode = https.GET();

    //Check the returning code                  
    if (httpsCode < 0) { 
      // negative res.status returns error
      Serial.println("request error - " + httpsCode);
      return;
    }
    else if (httpsCode != HTTP_CODE_OK) { 
      // In case res.status != 200, restart req cycle
      return;
    } else {
      // Get the request response payload
      String payload = https.getString();
      Serial.println(payload);

      const int capacity = JSON_OBJECT_SIZE(10);
      StaticJsonDocument<capacity>doc;
      // StaticJsonDocument<500> doc;
      DeserializationError err = deserializeJson(doc, payload);

      if (err) {
        Serial.print("ERROR:");
        Serial.println(err.c_str());
        return;
      }

      // String ledTape = doc["ledTape"];
      // String waterPump = doc["waterPump"];
      bool ledTape = doc["ledTape"];
      bool waterPump = doc["waterPump"];

      //TODO: transform bool to LOW & HIGH.
      if (ledTape) {
        digitalWrite(ledTapePin, HIGH);
        Serial.println("ledTape is true!");

      } else if (waterPump) {
        Serial.println("waterPump is true!");
        //TODO: postDeviceAction needs to be on top of getDevice, or at least its function declaration... so I should copy copy all function declarations to the top, and later on adapt them to .lib
        // postDeviceAction();
        // need to run waterPumpPin for 5s turn off and then respond false to firestore...
        // STATE = WATER_PUMP;
        // setState();
        // digitalWrite(waterPumpPin, HIGH);
      }

      Serial.println("ledTape: " + String(ledTape));
      Serial.println("waterPump: " + String(waterPump));
      Serial.println("--------------");

      checkDueTime = now + checkDelay;
    }
  }
  https.end();
}

//TODO: postSomething to cloud as Handshake success.
// if device already exists return a token from firebase ??
// setAuthorizationHeader(res.data.token); // ??? 
void postDevice(){
  HTTPClient https;
  BearSSL::WiFiClientSecure client;
  client.setInsecure();
  long now = millis();
  if(now >= checkDueTime) {
    Serial.println("-- POST_DEVICE");
    https.begin(client, "https://us-central1-culltive.cloudfunctions.net/api/device");
    https.addHeader("Content-Type", "application/json");
    // https.addHeader("Authorization", "Bearer ...");

    const int capacity = JSON_OBJECT_SIZE(7);
    StaticJsonDocument<capacity>doc;

    Serial.println(String(user_post));
    //TODO: feature -> getGeoLocation()    
    // doc["user"].set(user_post);
    doc["user"].set(String(user_post));
    doc["deviceId"].set(DEVICE_ID);
    doc["productType"].set(PRODUCT_TYPE); //FIXME: PRODUCT_TYPE ERROR ??   
    doc["firmwareVersion"].set(FIRMWARE_VERSION);
    doc["geolocation"].set("Curitiba"); 

    Serial.print("measureJson: ");
    Serial.println(measureJson(doc));

    // Declare a buffer to hold the result
    char output[300];
    serializeJsonPretty(doc, output);

    Serial.print("posting Device: ");
    Serial.println(output);

    int httpsCode = https.POST(output);
    

    //FXIME: httpsCode: -11 is creating device at firestore but breaks the pairing state_machine
    Serial.print("httpsCode: ");
    Serial.println(httpsCode);
    //Check the returning code                                                                  
    if (httpsCode > 0) {
      // Get the request response payload
      String payload = https.getString();
      // payload.remove(0,1); // Remove "[]" characters from payload String
      // payload.remove(payload.length() - 1);
      Serial.print("postDevice() payload: ");
      Serial.println(payload);

      //set flag for devicePosted...
      if (httpsCode == 201) {
        devicePosted = true;
      } else if (httpsCode == 400) {
        devicePosted = false;
      } else {
        //TODO: handle these erros better
        devicePosted = false;
      }
    } else {
       Serial.println("weird httpsCode response");
    }

    checkDueTime = now + checkDelay;
  }
  
  https.end();
}

void postDeviceAction(){
  HTTPClient https;
  BearSSL::WiFiClientSecure client;
  client.setInsecure();
  long now = millis();
  if(now >= checkDueTime) {
    Serial.println("-- POST_DEVICE_ACTION");
    String endpoint = "https://us-central1-culltive.cloudfunctions.net/api/device/" + String(DEVICE_ID) + "/action";
    // Serial.println(endpoint);

    https.begin(client, endpoint);
    https.addHeader("Content-Type", "application/json");

    const int capacity = JSON_OBJECT_SIZE(4);
    StaticJsonDocument<capacity>doc;

    doc["ledTape"].set(false); // TODO; adapt postDeviceAction to update values only if in req.body
    doc["waterPump"].set(false);

    // Declare a buffer to hold the result
    char output[200];
    // Produce a prettified JSON document
    serializeJsonPretty(doc, output);

    // Post and check the returned status code                                                                  
    int httpsCode = https.POST(output);
    if (httpsCode > 0) {
      // Get the request response payload
      String payload = https.getString();
      Serial.println(payload);
    } else {
      // ... handleError
    }

    checkDueTime = now + checkDelay;
  }
  
  https.end();
}

void postReading(){
  HTTPClient https;
  BearSSL::WiFiClientSecure client;
  client.setInsecure();
  long now = millis();
  if(now >= checkDueTime) {
    https.begin(client, "https://us-central1-culltive.cloudfunctions.net/api/reading");
    https.addHeader("Content-Type", "application/json");

    const int capacity = JSON_OBJECT_SIZE(12);
    StaticJsonDocument<capacity>doc;

    doc["deviceId"].set(DEVICE_ID);
    doc["air"].set(dht_humi);
    doc["lumi1"].set(ldr_lumi1); 
    doc["lumi2"].set(ldr_lumi2); 
    doc["soil1"].set(soil_humi1); 
    doc["soil2"].set(soil_humi2);
    doc["temp"].set(dht_temp);
    doc["ledTape"].set(led_tape);
    doc["waterPump"].set(water_pump);
    doc["waterLevel"].set(water_level_state);
    // doc["deviceState"].set(device_state);

    // Declare a buffer to hold the result
    char output[500];
    // Produce a prettified JSON document
    serializeJsonPretty(doc, output);

    int httpsCode = https.POST(output);
    //Check the returning code                                                                  
    if (httpsCode > 0) {
      // Get the request response payload
      String payload = https.getString();
      // payload.remove(0,1); // Remove "[]" characters from payload String
      // payload.remove(payload.length() - 1);
      Serial.println(payload);
    }

    checkDueTime = now + checkDelay;
  }
  
  https.end();
}


// ------------------------------------------------------- //
//          SOFT AP SERVER // HANDLE CREDENTIALS
// ------------------------------------------------------- //

bool connectToWiFi(String ssid, String password) {
  bool timeOut = false;
  bool wifiSuccess = false;

  Serial.println("connectToWiFi: ");
  
  WiFi.begin(String(ssid), String(password));             
  Serial.print("Connecting to "); 
  Serial.print(String(ssid)); 
  Serial.print(" ...");
  
  unsigned long startedWaiting = millis();
  while (WiFi.status() != WL_CONNECTED && !timeOut) {    // Wait for the Wi-Fi to connect || timeout after 15sec
    delay(1000);
    Serial.print(".");
       
    if (millis() - startedWaiting >= 12000) {          
      timeOut = true;
      Serial.println(" // Connection timed out!");
    }             
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiSuccess = true; 
    Serial.println(" // Connection established!");  
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());                   // Send ESP8266 IP address to the computer
  }

  return wifiSuccess;
}

//TODO: develop handleConnection as a method to communicate wrong credentials / fail to connect to home wi-fi
//TODO: return JSON response for ERROR and SUCCESS.

/*  Server handle to receive credentials (ssid, password, userData, else...) from the client (App) */
void handleCredentials(){
  Serial.println("handleCredentials()");
  String data = server.arg("plain"); // ?
  Serial.println(data);

  const int capacity =JSON_OBJECT_SIZE(8);
  StaticJsonDocument<capacity>doc;

  // Deserialize the doc JSON document into data and catch error
  DeserializationError error = deserializeJson(doc, data);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    server.send(400, "Deserialization error");
    Serial.println("handleValidation -> 400");
    return ;
  }

  //TODO: Validate Credentials -- check if all values 

  // Cast const char* -> String.
  const char* ssid_cc = doc["ssid"];
  ssid_post = ssid_cc;

  const char* pw_cc = doc["password"];
  password_post = pw_cc;

  const char* user_cc = doc["user"];
  user_post = user_cc;

  if (ssid_post == "" || password_post == "" || user_post == "") {
    server.send(401, "Missing data");
    Serial.println("handleValidation -> 401");
  } else {
    server.send(200, "Accepted");
    Serial.println("handleValidation -> 200");
  }
}

// return credentials status 
void handleValidation() {
  Serial.println("handleValidation()");
  StaticJsonDocument<50> doc;
  doc["credentials"] = credentialsState;


  char output[50];
  serializeJsonPretty(doc, output);

  server.send(200, "application/json", output);
  
  Serial.println("handleValidation /200");
  validationStatusReturned = true;
}

//TODO: Send deviceId to the App -> inApp: validate the handshake by checking devices firestore collection...
// return connection status and DEVICE_ID
void handleConnection() {
  StaticJsonDocument<100> doc;
  doc["connection"] = connectionState;
  doc["deviceId"] = DEVICE_ID;

  char output[100];
  serializeJsonPretty(doc, output);

  server.send(200, "application/json", output);

  Serial.println("handleConnection /200");
  connectionStatusReturned = true;
}

// not sure if needed
void handlePairing() {
  StaticJsonDocument<50> doc;
  doc["paired"] = devicePosted;

  char output[50];
  serializeJsonPretty(doc, output);

  server.send(200, "application/json", output);

  Serial.println("handlePairing /200");
  pairStatusReturned = true;

}

// return plain text [ssid, password, user] to server root (192.168.11.4)
void handleRoot() {
  String str = ssid_post + ":" + password_post + ":" + user_post;
  server.send(200, "text/plain", str);
  Serial.println("handleRoot /200");
}

// return HTTP status 404 (Not Found) for unespecified handle
void handleNotFound() {
  server.send(404, "text/plain", "404: Not found"); 
  Serial.println("handleNotFound /404");
}

void startServers() {
  server.on("/credentials", handleCredentials); // POST CREDENTIALS FROM APP
  server.on("/validation", handleValidation);
  server.on("/connection", handleConnection); // GET CONNECTION STATE {credentials: verified / connection: succeded} FROM APP
  server.on("/paired", handlePairing);
  server.on("/",handleRoot);
  server.onNotFound(handleNotFound);
  server.begin();
}

/*Access Point Configuration*/
void softAPConfig(){
  Serial.println();
  Serial.println("-----------------");
  Serial.println(" SOFT AP CONFIG ");
  Serial.println("-----------------");

  WiFi.mode(WIFI_AP);

  Serial.println(WiFi.softAPConfig(ip, gateway, subnet) ? "Ready" : "Failed!");

 // TESTING 'culltive000' softAP without password credentials
  WiFi.softAP(ssid_ap_name); 
  // WiFi.softAP(ssid_ap_name, password_ap);
  // Serial.print("IP Address: "); 
  // Serial.println(WiFi.localIP());
  
  Serial.print("Name: ");
  Serial.println(ssid_ap_name);
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
  Serial.println("--------------");
  Serial.println("  SETUP DONE  ");
  Serial.println("--------------");
  Serial.println("Waiting for Wi-Fi credentials...");
}
//  WiFi.setAutoConnect(false);
//  WiFi.disconnect(true);
//  WiFi.softAPdisconnect(false);
//  WiFi.setPhyMode(WIFI_PHY_MODE_11G);
//  WiFi.setOutputPower(15); // low power


bool pingSomething(String hostName) {
  Serial.print("Pinging ");
  Serial.print(hostName);
  Serial.print(": ");

  bool res = Ping.ping(hostName.c_str());
  int avg_time_ms = Ping.averageTime();

  if (res) {
    connectionState = "succeded";

    Serial.print("SUCCESS! RTT = ");
    Serial.print(avg_time_ms);
    Serial.println(" ms");

  } else {
    connectionState = "failed";
    Serial.println("FAILED!");

  }
  return res;
}

bool savedCredentials() {
  EEPROM.get(addr_global_index, wifi);
  if (String(wifi.ssid) != "" || String(wifi.password) != "" || (String(wifi.user) != "")) {
    return true;
  } else {  
    return false;
  }
}

void clearDueTime() {
  checkDueTime = 0;
}
   

// ------------------------------------------------------- //
//                OTHER // GENERAL METHODS
// ------------------------------------------------------- //

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

bool analogToDigital(float n){
  if (n > 500) return true;
  else return 0;
}

//TODO: Debug/Test this function
String waterLevelState(bool high, bool med, bool low){
  if(!high && !med && !low){ //0 0 0 
      return "Empty";
  } else if (!high && !med && low) { // 0 0 1
      return "Half Empty";
  } else if (!high && med && !low) { // 0 1 0
      return "Error: 0 1 0";
  } else if (!high && med && low) { // 0 1 1
      return "Half Full";
  } else if (high && !med && !low) { // 1 0 0
      return "Error: 1 0 0";
  } else if (high && !med && low) { // 1 0 1
      return "Error: 1 0 1";
  } else if (high && med && low) { // 1 1 1
      return "Full";
  } else {
      return "-";
  }
}

void readAll(){
  Serial.println("--------------"); 

  //DHT SENSOR
  //FIXME: Deal with null values in dht / all sensors
  // dht_temp = dht.readTemperature(); // TEMPERATURE
  // dht_humi  = dht.readHumidity();  // AIR HUMIDITY
  dht_temp = 23;
  dht_humi = 12;
  
  ldr_lumi1 = analogRead(ANALOG_INPUT);

  // ANALOG INPUTS AND MULTIPLEXER LOGIC 
  // LUMINOSITY (LDR)
  changeMux(LOW, LOW, LOW); //LDR 1 set to I/O #0 OF CD4051 CI PINOUT #13
  ldr_lumi2 = analogRead(ANALOG_INPUT);         
  delay(500);
  changeMux(LOW, LOW, HIGH); //LDR 2 set to I/O #1 OF CD4051 CI PINOUT #14
  ldr_lumi1 = analogRead(ANALOG_INPUT); 
  delay(500);

  // SOIL HUMIDITY
  changeMux(LOW, HIGH, LOW);  //SOIL 1 set to I/O #2 OF CD4051 CI PINOUT #15
  soil_humi1 = analogRead(ANALOG_INPUT);       
  delay(500);
  changeMux(LOW, HIGH, HIGH);  //SOIL 2 set to I/O #3 OF CD4051 CI PINOUT #12
  soil_humi2 = analogRead(ANALOG_INPUT);  
  delay(500);

  // WATER LEVEL
  changeMux(HIGH, LOW, HIGH);  //W LEVEL set to I/O #4 OF CD4051 CI PINOUT #1
  water_level_high = analogRead(ANALOG_INPUT);        
  // water_level_high = analogToDigital(analogRead(ANALOG_INPUT));     
  delay(500);
  
  changeMux(HIGH, LOW, LOW); //W LEVEL set to I/O #5 OF CD4051 CI PINOUT #5
  water_level_med = analogRead(ANALOG_INPUT);        
  // water_level_med = analogToDigital(analogRead(ANALOG_INPUT));     
  delay(500);
  
  changeMux(HIGH, HIGH, LOW);  //W LEVEL set to I/O #6 OF CD4051 CI PINOUT #2
  water_level_low = analogRead(ANALOG_INPUT); 
  // water_level_low = analogToDigital(analogRead(ANALOG_INPUT));     
  delay(500);
  

  // Sets a value of [] to the water_level_state var
  // TODO: Finish this...
  // This var will then be sent or received from db
  water_level_state = waterLevelState(
    analogToDigital(water_level_high), 
      analogToDigital(water_level_med), 
        analogToDigital(water_level_low));

  // water_pump_state = ???
}

//TODO:
void validateAll() {

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

  Serial.print("water_level_high: "); 
  Serial.println(water_level_high);
  // Serial.println(analogToDigital(water_level_high));

  Serial.print("water_level_med: "); 
  Serial.println(water_level_med);
  // Serial.println(analogToDigital(water_level_med));

  Serial.print("water_level_low: "); 
  Serial.println(water_level_low);
  // Serial.println(analogToDigital(water_level_low));

  Serial.print("Water Level State: "); 
  Serial.println(water_level_state);

  Serial.println();  
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

// unsigned long time_now = 0;
// void setTimeoutRestart(int period) {
//     Serial.println("setTimeoutRestart()...");
//     if(millis() > time_now + period){
//         time_now = millis();

//         // Reset credentials values / Restart ESP (try pairing again)
//         ssid_post = ""; password_post = ""; user_post = "";
//         STATE = WAITING_CREDENTIALS;
//         ESP.restart();

//     }
// }

void preConfigToMainLoop() {
  ledState = HIGH;
  digitalWrite(ledPin, ledState);
  Serial.println();
  Serial.println("// SENSOR OUT VALUES //");
}



// ------------------------------------------------------- //
//                     SETUP CONFIG
// ------------------------------------------------------- //
void setup() {
  Serial.begin(115200); while (!Serial) delay(1000);
  Serial.println();
  Serial.println("-----------------------");
  Serial.print("DEVICE_ID: ");
  Serial.println(DEVICE_ID);
  
  Serial.print("PRODUCT_TYPE: ");
  Serial.println(PRODUCT_TYPE);

  Serial.print("FIRMWARE_VERSION: ");
  Serial.println(FIRMWARE_VERSION);


  Serial.println("****************");
  Serial.println("  Starting Setup(); SETUP  ");
  Serial.println("");
  Serial.println("");

  // Start DHT Sensor
  dht.begin();

  // Set MUX (A,B,C) as output
  pinMode(MUX_A, OUTPUT);
  pinMode(MUX_B, OUTPUT);     
  pinMode(MUX_C, OUTPUT); 

  // Set (ON/OFF) blink LED as output
  pinMode(ledPin, OUTPUT);

  // Switches:  Water Pump and LED Tape as OUTPUTS
  pinMode(ledTapePin, OUTPUT);
  pinMode(waterPumpPin, OUTPUT);

  // Features:
  //TODO: IF THE EEPROM IS READING SOME WEIRD VALUES, RESET EEPROM AND CUT TO NEXT STATE
  //TODO: VALIDATE EEPROM SAVED DATA
  //TODO: BREAK FROM CONNECTING STATE AND GO BACK TO INITIAL OR CLEAN EEPROM IF NOT CONNECTING
  //TODO: CREATE A NOT CONNECTING VALIDATION 

  /* Electrically-Erasable Programmable Read-Only Memory */
  EEPROM.begin(EEPROM_SIZE); // Commit SIZE bytes of ESP8266 flash for "EEPROM" emulation

  // Clean EEPROM from Double Reset triggers
  if (drd.detectDoubleReset()) {
    Serial.println("Double Reset Detected");
    clearEEPROM(); 
    EEPROM.commit();
  } else {
    Serial.println("No Double Reset Detected");
  }

  // Are there any saved credentials in EEPROM?
  if (savedCredentials()){
    Serial.println("Saved Wi-Fi Credentials are: " + String(wifi.ssid) + ", " + String(wifi.password));

    // Try connecting to Home Wi-Fi
    if (connectToWiFi(String(wifi.ssid), String(wifi.password))) {
      Serial.println("Wi-Fi successfully connected from Saved Credentials (EEPROM)");
      
      getGeolocation();

      // Device is finally paired <3
      preConfigToMainLoop(); 
      STATE = MAIN_LOOP;

    } else {
      Serial.println("Saved credentials didn't work. Starting normal setup..");
      clearEEPROM();
      EEPROM.commit();
      softAPConfig(); 
    }  

  // There aren't savedCredentiasl, EEPROM is clean/empty.
  } else { 
    Serial.println("No saved credentials, start soft AP");
    softAPConfig();
  }
}

unsigned long time_now = 0;

// ------------------------------------------------------- //
//                     MAIN LOOP
// ------------------------------------------------------- //
// enum STATE_NUM {WAITING_CREDENTIALS, VALIDATING_CREDENTIALS, RETURN_VALIDATION, TESTING_CONNECTION, RETURN_CONNECTION, SAVING_CREDENTIALS, MAIN_LOOP};
void loop() {
  switch(STATE) {
    case WAITING_CREDENTIALS: {
      server.handleClient();

      if (ssid_post != "" && password_post != "" && user_post != "") { // RECEIVED VALUES FOR CREDENTIALS
        Serial.println("WAITING_CREDENTIALS: Credentials received from App");
        STATE = VALIDATING_CREDENTIALS;
      }
      blinkLED();
    break;
    }
    case VALIDATING_CREDENTIALS: {
      server.handleClient();

      //TODO: Add timeOut for this handle...

      // Try connecting to Home Wi-Fi
      if (connectToWiFi(ssid_post, password_post)) {
        Serial.println("VALIDATING_CREDENTIALS: Wi-Fi Connected!");
        credentialsState = "VERIFIED";
        STATE = RETURN_VALIDATION;

      // Connection did not work, probably wrong credentials...
      } else {
        Serial.println("VALIDATING_CREDENTIALS: Wrong Wi-Fi Credentials");
        credentialsState= "FAIL";

        STATE = RETURN_VALIDATION;
      } 
    break;
    }
    case RETURN_VALIDATION: {
      server.handleClient();

      if(validationStatusReturned) {

        if (credentialsState == "VERIFIED") {
          Serial.println("RETURN_VALIDATION: VERIFIED //");
          STATE = TESTING_CONNECTION;

        } else if (credentialsState == "FAIL") {
          Serial.println("RETURN_VALIDATION: FAIL // Reseting ESP");

          // Reset credentials values / Restart ESP (try pairing again)
          ssid_post = ""; password_post = ""; user_post = "";
          // STATE = WAITING_CREDENTIALS;
          ESP.restart();

        } else {
          //...
        }
      } else {
        //...
      }
      //TODO: Timeout for validationStatusReturned
    break;
    }
    case TESTING_CONNECTION: {
      server.handleClient();
    
      if(pingSomething("www.google.com")) {
        connectionState = "SUCCESS";        
      } else {
        connectionState = "FAIL";
      }

      Serial.print("TESTING_CONNECTION: ");
      Serial.println(connectionState);

      STATE = RETURN_CONNECTION;
    break;
    }
    case RETURN_CONNECTION: {
      server.handleClient();

      if (connectionStatusReturned) {
        if (connectionState == "SUCCESS") {
          Serial.println("RETURN_CONNECTION: SUCCESS //");
          // STATE = SAVING_CREDENTIALS;
          STATE = POST_DEVICE;

        } else if (connectionState == "FAIL") {
          Serial.println("RETURN_CONNECTION: FAIL // Reseting ESP");

          // Reset credentials values / Restart ESP (try pairing again)
          ssid_post = ""; password_post = ""; user_post = "";
          // STATE = WAITING_CREDENTIALS;
          ESP.restart();

        } else {
          //...
        }
      } else {
        //...
      }
    break;
    }
    case POST_DEVICE: {
      //FIXME: Make both functions properly run without memoryError
      
      //TODO: insert lat lon in postDevice()
      // Serial.println("-- GET GEOLOCATION --");
      // getGeolocation();

      // postDevice, wait for App verification on triggerUser
      Serial.println("-- POST DEVICE --");
      clearDueTime();
      postDevice();  

      STATE = CERTIFY_SUCCESS;
    break;
    }
    case CERTIFY_SUCCESS: {
      server.handleClient();

      //if postDevice returned OK, else...
      Serial.print("devicePosted(): ");
      Serial.println(devicePosted);
      if (devicePosted) {
        pairState = "SUCCESS";
      } else {
        pairState = "FAIL";
      }
      delay(1000);
      STATE = RETURN_SUCCESS;
    break;
    }
    case RETURN_SUCCESS: {
      server.handleClient();

      Serial.print("RETURN_SUCESS: ");
      Serial.println(pairStatusReturned);

      if (pairStatusReturned) {

        Serial.print("pairState: ");
        Serial.println(pairState);

        if (pairState == "SUCCESS") {
          Serial.println("FINALLY PAIRED!");
          STATE = SAVING_CREDENTIALS;
          //...
        } else if (pairState == "FAIL") {
          Serial.println("RETURN_CONNECTION: FAIL // Reseting ESP");
          // Reset credentials values / Restart ESP (try pairing again)
          ssid_post = ""; password_post = ""; user_post = "";
          // STATE = WAITING_CREDENTIALS;
          ESP.restart();
        } else {
          //...
        }
      } else {
        //...
      }
    break;
    }
    case SAVING_CREDENTIALS: {
      server.handleClient();

      ssid_post.toCharArray(wifi.ssid, 32); 
      password_post.toCharArray(wifi.password, 32);
      user_post.toCharArray(wifi.user, 32);

      Serial.print("SAVING_CREDENTIALS: ");
      String savedCredentials = String(wifi.ssid) + ":" + String(wifi.password)  + ":" + String(wifi.user);
      Serial.println(savedCredentials);

      // Save succesful Wi-Fi credentials to EEPROM
      EEPROM.put(addr_global_index, wifi);
      EEPROM.commit();

      wait = millis();
      STATE = CLOSE_SERVER;
      // preConfigToMainLoop();
      // STATE = MAIN_LOOP;
    break;
    }
    case CLOSE_SERVER: {
      server.handleClient();

      // wait 5s and then close servers...
      long now = millis(); 
      // Serial.println(now - wait);
      if (now - wait <= 6000) {
        // Serial.println("waiting...");
      } else {
        Serial.println("Waited 6s -> disconnecting softAp");
        // Disconnect SOFT AP - paring completed!
        WiFi.softAPdisconnect(true); 

        preConfigToMainLoop();
        STATE = MAIN_LOOP;
      }
    break;
    }
    case WATER_PUMP: {
      //TODO: run function for waterPump, turn on the pin and wait for 5s -- then turn off the pin and reply to database a false.
      // firebase should also handle a trigger function? setTimeout if waterPump is true for more than 30s set it to false...
      unsigned long currentMillis = millis();

      // NON-BLOCKING LOOP - EXECUTING EVERY (X = intervalMAINLOOP) seconds
      if (currentMillis - previousMillisMAINLOOP >= intervalMAINLOOP) {
        previousMillisMAINLOOP = currentMillis;

        //TODO: if waterPump true, break to that state - activate waterPump for 5s ?? and afterwards postDeviceAction({waterPump: false, ledTape: null})
      
      }
    break;
    }
    case MAIN_LOOP: {
      unsigned long currentMillis = millis();

      if (currentMillis - previousMillisMAINLOOP >= intervalACTION) {
        getDeviceAction();
      }

      // NON-BLOCKING LOOP - EXECUTING EVERY (X = intervalMAINLOOP) seconds
      if (currentMillis - previousMillisMAINLOOP >= intervalMAINLOOP) {
        previousMillisMAINLOOP = currentMillis;

        // Call double reset detector loop method so often that it can recognise when the timeout expires.
        drd.loop(); // Use drd.stop() when you wish to no longer consider the next reset as a double reset.

        readAll();
        printAll();

        postReading();
      }
    break;
    }
  } 
}


// Failed to connect to establish internet connection.
// } else {
//   //TODO: Notify user / app by client-server communication.
//   Serial.println("Invalid WiFi Credentials, try again...");
//   ssid_post = ""; password_post = ""; user_post = "";
//   ESP.restart();
// }
// delay(5000);

//FIXME: ledPin should async ouput (ON/OFF) 
// digitalWrite(ledPin, HIGH);
// delay(1000);
// digitalWrite(ledPin, LOW);
// delay(1000);

//DHT SENSOR
//FIXME: Handle sensor reading 'nan'
// Serial.println(dht.readTemperature());
// Serial.println(dht.readHumidity()); 

//TODO: SAVE A LIST OF VALUES, RESET EACH DAY AND SAVE ITS AVERAGE ON ANOTHER LIST (LIST OF AVARAGES PER DAY - Counting From Day 1 of the plantation...
//- start saving values to an avg_lumi, avg_temp, etc... and after a whole hour upload to a separated space.
//- this separated space should then save the avg of each hour, and avg of each day...

//TODO: PRINT DATA TO MAINPANNEL DASHBOARD FASTER THAN 10SECONDS? ...SEPARATE IT FROM THE 10s LOOP...

//TODO: Refactor MAIN_LOOP algorithm 
// Serial.println(n);
// readAll();
// getAll();
// printAll();
// postDashboardValues(); // post only the actual humidity, temperature and luminosity to the MainPannel Culltive app Dashboard
// postAirHumidity();
// postLuminosity();
// postSoilHumidity();
// postTemperature();
// saveToDataArray(n);
// n = n + 1;


// TODO: Finish this postDevice Insntant Reading thing...
// This needs to be a firebase trigger...
// void postDeviceReading(){
//   HTTPClient https;
//   BearSSL::WiFiClientSecure client;
//   client.setInsecure();
//   long now = millis();
//   if(now >= checkDueTime) {
//     https.begin(client, "https://us-central1-culltive.cloudfunctions.net/api/reading");
//     https.addHeader("Content-Type", "application/json");
//     const int capacity = JSON_OBJECT_SIZE(12);
//     StaticJsonDocument<capacity>doc;
//     doc["air"].set(dht_humi);
//     doc["lumi"].set(ldr_lumi1); //TODO: Fix code by printing both lumi1 and lumi2 and also an average?
//     doc["soil"].set(soil_humi1); //TODO: Fix code by printing both lumi1 and lumi2 and also an average?
//     doc["temp"].set(dht_temp);
//     doc["deviceState"].set(device_state);
//     doc["waterLevel"].set(water_level_state);
//     // Declare a buffer to hold the result
//     char output[500];
//     // Produce a prettified JSON document
//     serializeJsonPretty(doc, output);
//     int httpsCode = https.POST(output);
//     //Check the returning code                                                                  
//     if (httpsCode > 0) {
//       // Get the request response payload
//       String payload = https.getString();
//       // payload.remove(0,1); // Remove "[]" characters from payload String
//       // payload.remove(payload.length() - 1);
//       Serial.println(payload);
//     }
//     checkDueTime = now + checkDelay;
//   }
//   https.end();
// }

// Serial.print("Saving Wi-Fi ssid: "); Serial.println(String(wifi.ssid));
// Serial.print("Saving Wi-Fi password: "); Serial.println(String(wifi.password));
// Serial.print("Saving Wi-Fi user: "); Serial.println(String(wifi.user));

// bool resetable = false; // flag that makes millis run code at the second time...

// if (millis() - previousMillisRESET >= intervalRESET){
//   previousMillisRESET = millis();
//   resetable = !resetable; //toggle reset to true, prints message, next run reset esp
//   if (resetable){
//     Serial.println("Restarting in 10s...");
//   } else {
//     // Reset credentials values / Restart ESP (try pairing again)
//     ssid_post = ""; password_post = ""; user_post = "";
//     STATE = WAITING_CREDENTIALS;
//     ESP.restart();
//   }
// }