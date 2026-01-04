---
title: "FM Radio Receiver"
date: December 5 2025
excerpt: "Variable power supply comprising a buck converter, Schottky diode, and inductor.<br/><img src='/images/project_icons/ENGR-072/radio-pcb-final.png' width='500'>"
collection: portfolio-archive
categories: electronics
---

# FM Radio Receiver
> Dylan Jacobs & Aaron Dubois

## Project Goal:
Create an analog usable FM radio receiver.

## Background: Oscillators:
There are a few different methods to generate oscillatory signals. Some common ones include RC Relaxation Oscillators, Crystal Oscillators, ICs, and LC Oscillators. Since we want our device to be as "analog" as possible, we avoided ICs and Crystal Oscillators. LC Oscillators are also better suited for high frequencies compared to RC Relaxation Oscillators [1].

## Background: Colpitts Oscillator:
<figure>
  <img src="/images/project_icons/ENGR-072/radio-oscillator.png" width="300">
  <figcaption>Colpitts oscillator schematic [1].</figcaption>
</figure>
The Colpitts Oscillator comes in multiple different shapes and sizes, but in the example shown above [1], the LC tank circuit uses its resonant frequency to select the frequency of oscillation

$$f=\frac{1}{2\pi \sqrt{LC_{eq}}}$$

where $C_{eq}$ is the equivalent capacitance resulting from the 22pF variable capacitor and the parasitic capacitances from the first BJT. Together, these capacitances and the 4-turn inductor form the oscillator. This oscillating signal is mixed with the incoming radio frequency received from the antenna. Both signal and oscillator voltages sum together so that the input signal to the T1 BJT can be represented as 

$$v_{BE}(t) = v_{RF}(t) + v_{LO}(t)$$

The collector current for the BJT is nonlinear and can be specifically represented using the equation 

$$I_C=I_Se^{v_{BE}/v_T}$$

where $v_T$ represents the thermal voltage of the transistor. We can expand the exponent into a Taylor series, and from the 

$$(v_{RF}(t) + v_{LO}(t))^2$$

term we observe that the resulting signal contains both the RF and LO signals, as well as their sums. Moreover, because both signals can be represented as sinusoids with respective frequencies $\omega_{RF}, \omega_{LO}$, we can use the trigonometric identity 

$$\cos(\omega_{RF}t)\cos(\omega_{LO}t) = \frac{1}{2}[\cos((\omega_{RF}-\omega_{LO})t) + \cos((\omega_{RF}+\omega_{LO})t)]$$

to obtain the sum and difference signals. When the local oscillator frequency LO is close to the incoming RF signal frequency RF, the difference frequency will be small. We can use the bandpass filter comprising C1, R2, and C2 to filter out all other signals, thereby obtaining only the signal with a frequency close to that of the local oscillator. This enables us to isolate our desired, tunable radio frequency signals.

## Our Design:
<figure>
  <img src="/images/project_icons/ENGR-072/radio-schematic.png" width="300">
  <figcaption>Radio schematic [2].</figcaption>
</figure>

We used this FM radio receiver schematic as inspiration for our circuit design. The Colpitts oscillator is composed of two radio-frequency bipolar-junction transistors, a 4-turn air-core inductor, and a variable 22-pF capacitor. The signal from the antenna is added to the local oscillator’s signal and filtered through a bandpass filter before being sent through a volume control voltage divider and into the LM386 for audio amplification. We use a 22kΩ logarithmic potentiometer for volume control. Bypass capacitors are used throughout the circuit for noise filtration. Moreover, we maximize the LM386 audio gain by placing a 10μF capacitor between pins 1 and 8. We power the circuit with a 9V battery.

## Custom Parts (Antennas, Variable Capacitor & Inductors):

To physically realize this design, we had to make an inductor out of wire, attach a large antenna to receive the FM signal, and find obscure parts such as the variable 22pF capacitor. The variable capacitor and inductor are shown below.
<p float="left">
  <img src="/images/project_icons/ENGR-072/radio-oscillator-pcb.jpg" width="45%" />
  <img src="/images/project_icons/ENGR-072/radio-tuner-pcb.jpg" width="45%" />
</p>

## PCB Design

Our final PCB design is shown below. While designing the PCB, we took care to ensure to the RF traces did not run perpendicularly to each other to avoid interference. We also tried to isolate the RF components from the rest of the board by excluding their area from the grounded copper pour covering the rest of the board. We also followed best practices for PCB design, avoiding ground loops, keeping traces short, and avoiding unnecessary vias.
<figure>
  <img src="/images/project_icons/ENGR-072/radio-pcb-final.png" width="300">
  <figcaption>PCB design in Fusion360.</figcaption>
</figure>

## End Result:
<p float="left">
  <img src="/images/project_icons/ENGR-072/radio-final1.jpg" width="45%" />
  <img src="/images/project_icons/ENGR-072/radio-final2.jpg" width="45%" />
</p>
Our final product is currently only producing static noise whose volume is adjustable, but is unable to be tuned to pick up or output any meaningful audio signal.

### Troubleshooting and potential problems

Incoming RF signal too weak?

We tested outside to try to receive commercial FM signals better. We also tried on the roof of Singer Hall, where we connected to a pre-installed antenna; however, we were unsure if we had the proper configuration/if it was set up properly for our application, and the test did not improve performance.

We tested next to Swarthmore's radio station to guarantee a strong signal (Parrish 4th). We observed slightly louder static, though only slightly.

We briefly attempted to create an FM transmitter with a Raspberry Pi, but we decided that our other tests likely ruled out our main problem being a weak incoming RF signal. We thought that even if the circuit amplification were weak, we would still be able to hear something discernible when adjusting and unplugging/plugging in the antenna, which we did not observe. 

Local oscillator not working?

Attempted oscilloscope probing at multiple locations in our circuit, but could not discern a meaningful signal from the oscilloscope, suggesting that either our local oscillator was not functioning correctly, or the oscilloscope could not operate accurately on the order of 100MHz.

Is the antenna too far from the resonant length?

Incoming RF signal is ~100MHz  --> ~3m in wavelength.

Ideally, we should have a 3m long antenna, but half and quarter multiples of 1.5m and 0.75m should also work.

We tried cutting the antenna to 0.75m and 0.6m, but did not observe an improvement in signal capture nor audio output besides static.

General troubleshooting

We also attempted classic troubleshooting processes like checking traces, values of components, and connections. We also tried various variable capacitors, manipulated our inductor, measured the voltages on the LM386, and ensured the functionality of the speaker.

References:

[1] Scherz, Paul, and Simon Monk. Practical Electronics for Inventors. Available from: Swarthmore College, (4th Edition). McGraw-Hill Professional, 2016.

[2] Designing FM Receiver Circuit | Complete Circuit Explanation