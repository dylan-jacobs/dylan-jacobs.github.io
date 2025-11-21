---
title: "Light-Controlled Solar Panel"
date: October 2025
excerpt: "An analog PCB that uses two phototransistors situated on either side of a solar panel to control a motor that rotates the solar panel toward the light to optimize its power output..<br/><img src='/images/project_icons/ENGR-072/solar-pcb.png' width='500'>"
collection: portfolio
---

# Light-controlled solar panel
> Aaron Dubois & Dylan Jacobs

## Project goal:
Develop an analog circuit that uses two phototransistors situated on either side of a solar panel to control a motor that rotates the solar panel toward the light to optimize its power output.

## Circuit schematic
<figure>
  <img src="/images/project_icons/ENGR-072/solar-schematic.png" width="300">
  <figcaption>Schematic in Fusion360.</a></figcaption>
</figure>

Each phototransistor’s resistance decreases as it is increasingly exposed to light. We can this integrate these phototransistors into voltage dividers and compare their output voltages against each other using comparators. We use Schmidt triggers to prevent jerky, unsteady rotation when the phototransistor output voltages are similar. This is shown in the diagram below:

<figure>
  <img src="/images/project_icons/ENGR-072/solar-schmidt.png" width="300">
  <figcaption>Image credit: FDominec, 29 March 2007, Wikipedia. This file is licensed under the <a href="https://en.wikipedia.org/wiki/Creative_Commons">Creative Commons</a> <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.en">Attribution-Share Alike 3.0 Unported license.</a></figcaption>
</figure>


**Input U:** signal from one phototransistor (black) compared against a steady voltage reference (red), which, in practice, is the other phototransistor’s voltage.

**Section A:** oscillatory, unsteady output from a single comparator.

**Section B:** more stable output from a Schmidt trigger with thresholds depicted as the green dashed lines.

The Schmidt trigger outputs are passed into the H-bridge, which drives the motor in the direction with the higher phototransistor voltage, smoothed out by the Schmidt trigger.

## Breadboard Prototyping
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/H_wOXdVU70k"
  frameborder="0" 
  allowfullscreen>
</iframe>

## PCB
<figure>
  <img src="/images/project_icons/ENGR-072/solar-pcb.png" width="300">
  <figcaption>PCB designed in Fusion360.</figcaption>
</figure>

## Final product
We integrated our PCBs into the solar panel, wiring the motor, phototransistors, and Li-Ion batteries into their respective PCB inputs and tested the panel outside. 

<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/GV3YykGODKE"
  frameborder="0" 
  allowfullscreen>
</iframe>
