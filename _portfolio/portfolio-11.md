---
title: "Audio Equalizer PCB"
date: November 2025
excerpt: "Audio equalizer printed circuit board (PCB) built using 3rd-order active Butterworth filters to independently adjust bass, mid, and treble frequency ranges of songs.<br/><img src='/images/project_icons/VFP/solution_time_200.jpg' width='500'>"
collection: portfolio
---

# Audio Equalizer
> Dylan Jacobs & Aaron Dubois  
> November 2025

## Project Goal:
Create a multi-band audio equalizer that lets a user play beautiful music through a speaker and adjust the gain of each band independently and collectively.

## End Result:
<video width="600" controls>
  <source src="/files/videos/audio_equalizer_demo1.mov" type="video/mov">
</video>
<video width="600" controls>
  <source src="/files/videos/audio_equalizer_demo2.mov" type="video/mov">
</video>

### Circuit Design:
We used third order Butterworth filters to create Low Pass (Bass), Band Pass (Mid), and High Pass (Treble) “bands” whose gain could be separately adjusted. We implemented the filters with LT1057’s. Note: our band pass filter consisted of sequential low pass and high pass third order Butterworth filters. Below is the circuit schematic for our low pass filter.

![3rd-order, active low-pass filter used to isolate the bass frequencies](\images\project_icons\ENGR-072\audio-eq-low-pass-filter.png)

We also used a summing amplifier whose relative weights were determined by potentiometers as shown below. Also, we established a virtual ground at 6V to allow the LT1057’s to operate from 12V as if we were using ±6 V rails.

![Summing amplifier schematic used to recombine all frequency bands via weighted sum.](\images\project_icons\ENGR-072\audio-eq-summing-amp.png)

Lastly, we used an audio Jack for input and LM386 Audio Amplifier to drive a speaker through a JST pin connector.

## Prototyping and Testing:

After successfully prototyping and testing our circuit on a breadboard, we had our PCB design manufactured, and then we assembled the components and placed it in our enclosure.

![Final PCB](\images\project_icons\ENGR-072\audio-eq-PCB.png)
