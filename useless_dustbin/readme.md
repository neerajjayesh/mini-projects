# Useless Dustbin

This project was built as part of the **"JustBuild"** event, which encouraged participants to create fun, quirky, and completely **useless products**.

## What it does
- The lid **stays open** by default.  
- When it detects an object like a hand approaching within 15 cm, it **closes automatically**.  
- As soon as the object is gone, it **opens again** — making the closing action totally pointless.  


## Components Used
- Arduino  
- Ultrasonic Sensor (HC-SR04)  
- Servo Motor  
- Some jumper wires and power supply  

## How it works
1. Ultrasonic sensor measures distance.  
2. If something gets too close, the servo moves to close the lid.  
3. Once the object moves away, the lid opens again.  
