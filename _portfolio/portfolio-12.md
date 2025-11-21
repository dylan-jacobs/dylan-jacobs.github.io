---
title: "Temperature-Controlled Fan"
date: October 2025
excerpt: "A battery-powered, Arduino-integrated PCB that adjusts a fan's speed depending on the environment's ambient temperature, measured by a thermistor.<br/><img src='/images/project_icons/ENGR-072/fan-PCB.png' width='500'>"
collection: portfolio
---

# Temperature-controlled fan
> Dylan Jacobs & Aaron Dubois

## Project goal:
Create a battery-powered, Arduino-integrated PCB that adjusts a fan’s speed depending on the environment’s ambient temperature, measured by a thermistor. The PCB should display both the recorded temperature and fan speed on an LCD screen.

## Circuit schematic
![Circuit schematic in Fusion360](\images\project_icons\ENGR-072\fan-schematic.png)

The circuit is powered by 2 LiPo batteries in series, each with a nominal voltage of 3.7V. The thermistor is part of a voltage divider whose output is measured by Arduino pin A0.

The fan has four wires: Vcc, GND, tachometer, and PWM. We use the tachometer to measure the fan’s speed and control its speed using an Arduino PWM pin.

## Arduino code
```
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);

float temperature;
float voltage_adc;
float voltage;
float resistance;
volatile long fan_speed = 0;
volatile long encoder_counts = 0;
unsigned long lastFanPulse = 0;
unsigned long fanPulseInterval = 0;
volatile bool newPulse = false;

const float VCC = 5.0;
#define THERMISTOR_PIN A0
#define FAN_PWM_PIN 3
#define FAN_TACHOMETER_PIN 2

// resistance table from thermistor datasheet
const float RT_Table[] { 87.237, 62.264, 44.854, 32.599, 23.893, 17.654, 13.098, 9.8059, 7.4266, 5.6677, 4.3213, 3.3208, 2.5842, 2.0238, 1.5858, 1.2507, 1.0000, 0.7964, 0.64053, 0.51772, 0.41958, 0.34172, 0.27877, 0.22861, 0.18872, 0.15645, 0.13012, 0.10863, 0.091115, 0.0767, 0.064867, 0.055047, 0.046797, 0.039904, 0.034255, 0.029498, 0.025488 };

int Temp_Table[36];

void interrupt1() {
  encoder_counts++;
  fanPulseInterval = (micros() - lastFanPulse);
  lastFanPulse = micros();
  newPulse = true;
}

void setup() {
  // put your setup code here, to run once:
  lcd.init();
  lcd.backlight();

  // pinmodes
  pinMode(FAN_PWM_PIN, OUTPUT);
  pinMode(FAN_TACHOMETER_PIN, INPUT_PULLUP);
  pinMode(THERMISTOR_PIN, INPUT);

  // set up Serial communication for printing
  Serial.begin(9600);

  // temperature table with every 5 degrees Celsius from -55 to 125
  for (int i = 0; i < 36; i++) {
    Temp_Table[i] = -55 + 5*i;
  }

  // set up interrupt
  attachInterrupt(digitalPinToInterrupt(FAN_TACHOMETER_PIN), interrupt1, CHANGE);
  lastFanPulse = micros();
}

void loop() {
  // put your main code here, to run repeatedly:
  voltage_adc = analogRead(THERMISTOR_PIN);
  voltage = VCC*(voltage_adc / 1023.0); 

  resistance = (VCC/voltage) - 1;
  temperature = interpolate_temperature(resistance);

  if (newPulse){
    noInterrupts();
    unsigned long interval = fanPulseInterval;
    newPulse = false;
    interrupts();

    // our fan tachometers record voltage spikes  twice per rotation
    fan_speed = 2*60.0e6 / interval; 
  }

  // LCD display
  lcd.clear(); 
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(temperature);
  lcd.print(" C");

  lcd.setCursor(0, 1);
  lcd.print("Speed: ");
  lcd.print(fan_speed); 
  lcd.print(" RPM");

  // drive fan
  analogWrite(FAN_PWM_PIN, 255*(temperature - 25)/5); //the speed of the fan is prop to (255-arg2)/255
  delay(1000);
}

// finds the resistance in the table and interpolates to find temperature
float interpolate_temperature(float R) {
  for (int i = 0; i < 36; i++) {
    if (R > RT_Table[i+1]) {
      float T1 = Temp_Table[i];
      float T2 = Temp_Table[i+1];
      float R1 = RT_Table[i];
      float R2 = RT_Table[i+1];

      return T1 + (R - R1)*(T2 - T1)/(R2 - R1);
    }
  }
}
```

## Breadboard prototyping
![](\images\project_icons\ENGR-072\fan-breadboard1.jpg)
![](\images\project_icons\ENGR-072\fan-breadboard2.jpg)

## PCB
The fan is mounted to the board, above a hole drilled into the PCB to facilitate airflow from the region we are interested in cooling. The LiPo batteries plug into ports J1 and J2 and the LCD screen and fan are wired to the header pins below the LiPo sockets.
![PCB designed in Fusion360](\images\project_icons\ENGR-072\fan-PCB.png)

<video width="600" controls>
  <source src="/files/videos/fan_demo.mp4" type="video/mp4">
</video>