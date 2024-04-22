# Reaction-Diffusion Simulation

This is a reaction-diffusion simulation implemented in JavaScript using the p5.js library.

## Overview

Reaction-diffusion systems are mathematical models that describe how the concentration of one or more substances distributed in space changes under the influence of two processes: diffusion and reaction. These systems can generate a wide range of complex and visually appealing patterns, often resembling biological forms.

## Usage

To use the simulation:
- Drag mouse clicking 'D' to add more substance b.
- Press the 'Space' key to start/pause the simulation.
- Press the 'R' key to reset the simulation.

## How to Run

To run the simulation locally:
1. Clone this repository.
2. Open the `index.html` file in a web browser.

Alternatively, you can run the code on the [p5.js web editor](https://editor.p5js.org/) or any online JavaScript editor.

## Parameters

You can adjust the following parameters in the code to modify the simulation behavior:
- `D_A`: Diffusion rate of substance A.
- `D_B`: Diffusion rate of substance B.
- `FEED`: Rate at which substance A is added to the system.
- `K`: Rate at which substance B is removed from the system.

## Credits

This simulation is based on the work of Karl Sims. The code structure and some implementation details are adapted from [Antonio Loquercio's p5.js sketch](https://editor.p5js.org/antolab/sketches/7P59v_3lk).
