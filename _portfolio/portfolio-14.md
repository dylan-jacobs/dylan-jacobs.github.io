---
title: "Adjustable Power Supply"
date: December 5 2025
excerpt: "Variable power supply comprising a buck converter, Schottky diode, and inductor.<br/><img src='/images/project_icons/ENGR-072/lp4-pcb.png' width='500'>"
collection: portfolio
categories: electronics
---

# Variable power supply
> Dylan Jacobs and Aaron Dubois

## Project goal:
Create a variable power supply using a 12V input to a barrel jack connector and a buck converter with an adjustable reference voltage to change the voltage output, which is accessible via a JST pin connector. Four indicator lights are surface-mounted to indicate the output voltage levels at specified voltages of 3.3V, 5V, 9V, and 12V. Lastly, our color scheme is primarily red and green in the spirit of the holidays.

## Circuit schematic and theory

### The buck converter
**LM2956:** We use the adjustable LM2956 buck converter as the basis for our variable power supply. This IC adjusts its output voltage until it matches the feedback pin, and we can utilize this behavior to create a potentiometer-adjustable power supply. Its output voltage is also "chopped" into a 150kHz square wave. We use this feature to store magnetic energy in the inductor, reducing the energy wasted as heat. 

<figure>
  <img src="/images/project_icons/ENGR-072/lp4-schematic1.png" width="300">
  <figcaption>Schematic in Fusion360.</figcaption>
</figure>

**Schottky diode:** We reverse-bias a Schottky diode between the LM2596 output and GND. When the LM2956 switching regulator is switched on in the "high" state, the diode acts simply as a reverse-biased diode, preventing the output voltage from shorting to GND. In this state, the inductor stores energy in its magnetic field. However, when the LM2956 switches off, the inductor forces current to continue flowing through itself and thus pushes current through the diode, which completes the circuit driven by the inductor. 

We use a Schottky diode because it has a low junction threshold voltage, making it useful for this low-power voltage regulator. It is also able to detect the high-frequency (150kHz) signal from the LM2596, which ordinary p-n diodes could not handle. Finally, Schottky diodes have low-voltage drops and high current density, rendering them ideal for efficient power supplies, because they generate less waste heat.

**Potentiometer and voltage divider:** the 10kΩ potentiometer is used in the voltage divider to adjust the feedback into the LM2596, enabling us to vary the output voltage.

**Output capacitor:** The capacitor acts (with the inductor) as a low-pass LC filter to smooth the output, resulting in a smooth DC voltage.


### Comparators and LED indicators:
To indicate the current output voltage, we use 4 LEDs and 4 comparators, each with its own voltage-divider-controlled reference voltage. We power the LEDs (in series with 1kΩ resistors) from the 12V power input using n-channel MOSFETs whose gates are controlled by the comparators' outputs. Thus, when the buck converter's output voltage exceeds 3.3V, for instance, the 3.3V LED will turn on. 
<figure>
  <img src="/images/project_icons/ENGR-072/lp4-schematic2.png" width="300">
  <figcaption>Schematic in Fusion360.</figcaption>
</figure>

## Breadboard Prototyping
<iframe 
  width="560"
  height="315" 
  src="https://www.youtube.com/embed/cJYjukGp5Do"
  frameborder="0" 
  allowfullscreen>
</iframe>
<p float="left">
  <img src="/images/project_icons/ENGR-072/lp4-breadboard.jpg" />
</p>

## PCB Design and CAD Enclosure
We designed both the PCB and 3D printed enclosure in Fusion360. We chose an open-top enclosure with a flat sliding pin that secures the PCB inside.  
<p float="left">
  <img src="/images/project_icons/ENGR-072/lp4-pcb.png" width="45%" />
  <img src="/images/project_icons/ENGR-072/lp4-enclosure.png" width="45%" />
</p>

## Final product
Below, we have a video of the working Christmas variable power supply.

<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/jHDlcQIMX3k"
  frameborder="0"
  allowfullscreen>
</iframe>

Lastly, here is a picture of the pcb inside our enclosure:
<figure>
  <img src="/images/project_icons/ENGR-072/lp4-enclosure-pcb.jpg" width="300">
  <figcaption>Schematic in Fusion360.</figcaption>
</figure>