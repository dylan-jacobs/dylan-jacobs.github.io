---
title: "Vlasov-Fokker-Planck plasma model solver"
date: November 2025
excerpt: "Current research project under Swarthmore Professor Joseph Nakao: solving the Vlasov-Fokker-Planck plasma model using a low-rank, structure-preserving framework in cylindrical coordinates.<br/><img src='/images/project_icons/VFP/solution_time_200.jpg' width='500'>"
collection: portfolio
---
[Github Repository](https://github.com/dylan-jacobs/computational-fluid-dynamics/tree/main/Vlasov-Fokker-Planck-Solver)

We are interested in solving the Vlasov-Fokker-Planck equation to model single-ion plasmas in 1 spatial and 2 velocity dimensions in cylindrical coordinates:

$$
    \frac{\partial f}{\partial t} +
    v_{||}\frac{\partial f}{\partial x} + 
    E_{||}\frac{\partial f}{\partial v_{||}} = C_{\alpha\alpha}(f) + C_{\alpha e}(f)
$$

To avoid the curse of dimensionality, i.e. prohibitively large storage complexity due our equation's high-dimensionality, we use a low-rank framework to numerically solve the time-dependent partial differential equation.

Numerical solution at time t=200:
------
<img src="https://github.com/dylan-jacobs/computational-fluid-dynamics/blob/main/Vlasov-Fokker-Planck-Solver/Plots/solution_time_200.jpg?raw=true" width="400">

Mass, momentum, and energy conservation (up to truncation tolerance):
------
<img src="https://github.com/dylan-jacobs/computational-fluid-dynamics/blob/main/Vlasov-Fokker-Planck-Solver/Plots/conservation.jpg?raw=true" width="400">


Most recently presented at SIAM NNP 2025 Conference poster session:
------
<embed src='/files/SIAM_NNP_Poster_2025.pdf' type='application/pdf' width='100%' height='600px'>
