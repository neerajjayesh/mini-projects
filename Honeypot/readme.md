# ESP8266 Honeypot

A simple **WiFi Honeypot** for ESP8266 with credential storage using **LittleFS**.  
When users connect to the AP, they are redirected to a styled signup page where they enter **name, mobile, and password**. Data is stored and can be viewed or cleared via the web interface.

---

## Features
- Captive portal with DNS redirection  
- Landing page with custom UI  
- Stores credentials in `/SavedFile.txt` (LittleFS)  
- Admin pages:  
  - `/creds` → View saved credentials  
  - `/clear` → Delete credentials  

---

## Setup
1. Flash code to ESP8266 (NodeMCU).  
2. Connect to WiFi **`Guest WiFi`**.  
3. Browser requests redirect to signup form.  

---

⚠️ **For educational use only. Do not use for real credential collection.**
