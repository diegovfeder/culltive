/** @file culltive.ino
    @brief A console driver.

    This whole file implements the firmware for the
    first Culltive product.
    Important details about its implementation
    should go in these comments.

    @author Diego V. Feder (@diegovfeder)
    @bug No know bugs.
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
// #include <ESP8266WiFiMulti.h>
#include <Ticker.h>
#include <WiFiClientSecure.h>


// ------------------------------------------------------- //
//                     CONSTANTS / VARIABLES
// ------------------------------------------------------- //

/*RTC Memory Address for the DoubleResetDetector*/
#define DRD_ADDRESS 0
/*Total gap in seconds for DoubleResetDetector*/
#define DRD_TIMEOUT 10
DoubleResetDetector drd(DRD_TIMEOUT, DRD_ADDRESS);

/*DHT - Humidity + Temperature Sensor*/
#define DHTTYPE DHT22       
#define DHTPIN D2 // DHT pinned to GPIO4 (D2)
DHT dht(DHTPIN, DHTTYPE);   

/*Allocate a 512-byte-array flash-mem into cache in RAM*/
#define EEPROM_SIZE 512

/**WiFi Credentials
  IMPORTANT: Change the Access Point SSID for every product.
*/
String ssid_ap = "CB-XXXX";   
String password_ap = "culltive";

/*Server*/
ESP8266WebServer server;

/*IP*/
IPAddress ip(192,168,11,4);
IPAddress gateway(192,168,11,1);
IPAddress subnet(255,255,255,0);

// Ticker ticker;

// Other stuff
long checkDueTime;
int checkDelay = 15000; // 60 x 1000 (1 minute)


// ------------------------------------------------------- //
//                     FUNCTIONS / METHODS
// ------------------------------------------------------- //

void getDevices(){
  HTTPClient https;
  BearSSL::WiFiClientSecure client;
  client.setInsecure();
  long now = millis();
  if(now >= checkDueTime) {
    https.begin(client, "https://us-central1-culltive.cloudfunctions.net/api/devices");
    // https.begin("https://us-central1-culltive.cloudfunctions.net/api/devices");
    int httpsCode = https.GET();
    //Check the returning code                                                                  
    if (httpsCode > 0) {
      // Get the request response payload
      String payload = https.getString();
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
      String qrCode = doc["qrCode"];
      String productType = doc["productType"];
      String assignedUser = doc["assignedUser"];
      String geolocation = doc["geolocation"];
      String version = doc["version"];
      String createdAt = doc["createdAt"];
      String wifiStatus = doc["wifiStatus"];

      Serial.println("deviceId: " + deviceId);
      Serial.println("qrCode: " + qrCode);
      Serial.println("productType: " + productType);
      Serial.println("assignedUser: " + assignedUser);
      Serial.println("geolocation: " + geolocation);
      Serial.println("version: " + version);
      Serial.println("createdAt: " + createdAt);
      Serial.println("wifiStatus: " + wifiStatus);
      Serial.println("--------------");
    }

    checkDueTime = now + checkDelay;
  }
  
  https.end();
}

void postDevice(){
  HTTPClient https;
  BearSSL::WiFiClientSecure client;
  client.setInsecure();
  long now = millis();
  if(now >= checkDueTime) {
    https.begin(client, "https://us-central1-culltive.cloudfunctions.net/api/reading");
    https.addHeader("Content-Type", "application/json");
    // https.addHeader("Authorization", "Bearer ...");
    // char json[] = "{\"qrCode\": \"CB-0001\"}";
    int httpsCode = https.POST("{\"qrCode\": \"CB-0001\"}");
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

void postReading(){
  HTTPClient https;
  BearSSL::WiFiClientSecure client;
  client.setInsecure();
  long now = millis();
  if(now >= checkDueTime) {
    https.begin(client, "https://us-central1-culltive.cloudfunctions.net/api/reading");
    https.addHeader("Content-Type", "application/json");
    // https.addHeader("Authorization", "Bearer ...");
    // char json[] = "{\"qrCode\": \"CB-0001\"}";
    int httpsCode = https.POST("{\"qrCode\": \"CB-0001\"}");
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

bool connectToWiFi(String ssid, String pw) {
  bool timeOut = false;
  bool wifiSuccess = false;

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

void clearEEPROM() {
  for (int addr = 0; addr < 512; addr++) {
    EEPROM.write(addr, 0);
  }
}

// ------------------------------------------------------- //
//                     SETUP CONFIG
// ------------------------------------------------------- //
void setup() {

  // START SERIAL
  Serial.begin(115200);
  while (!Serial) delay(1000);
  Serial.println();

  // START DHT SENSOR
  dht.begin();

  // HANDLING EEPROM
  EEPROM.begin(EEPROM_SIZE); // commit SIZE bytes of ESP8266 flash for "EEPROM" emulation
  //TODO: IF THE EEPROM IS READING SOME WEIRD VALUES, RESET EEPROM AND CUT TO NEXT STATE
  //TODO: VALIDATE EEPROM SAVED DATA
  //TODO: BREAK FROM CONNECTING STATE AND GO BACK TO INITIAL OR CLEAN EEPROM IF NOT CONNECTING
  //TODO: CREATE A NOT CONNECTING VALIDATION 

  // DOUBLE RESET CHECK
  if (drd.detectDoubleReset()) {
    
    Serial.println("Double Reset Detected");
    clearEEPROM(); 
    EEPROM.commit();
  } else {
    Serial.println("No Double Reset Detected");
  }

  WiFi.setAutoConnect(true);
  // Try connecting to the home network
  if (connectToWiFi("TECHNO", "MELODICO")) {   
    //...
  } else {
    //...
  }
}


// ------------------------------------------------------- //
//                     MAIN LOOP
// ------------------------------------------------------- //
void loop() {
  // Call the double reset detector loop method every so often, so that it can recognise when the timeout expires.
  // Use drd.stop() when you wish to no longer consider the next reset as a double reset.
  drd.loop();

  //DHT SENSOR
  //FIXME: Sensor reading 'nan'
  Serial.println(dht.readTemperature());
  Serial.println(dht.readHumidity()); 

  // getDevices();
  // postReading();

  delay(5000);
}

/*POST*/
// StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
// JsonObject& JSONencoder = JSONbuffer.createObject();

// JSONencoder["value"] = value_var;
// char JSONmessageBuffer[300];
// JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));

// HTTPClient http;    //Declare object of class HTTPClient

// http.begin("API end point here");      //Specify request destination
// http.addHeader("Content-Type", "application/json");  //Specify content-type header

// int httpCode = http.POST(JSONmessageBuffer);   //Send the request
// String payload = http.getString();