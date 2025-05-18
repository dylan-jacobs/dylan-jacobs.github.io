---
permalink: /research/
title: 'My Research'
author_profile: true
redirect_from: 
---

My Research
------
[comment]: <> (I am driven to utilize engineering and mathematics to solve pressing societal problems. Growing up in Portland, Oregon, witnessing the devastating climate-change-induced wildfires on Pacific Northwest forests impressed upon me the necessity of mitigating global warming. Studying engineering and applied mathematics has motivated me to use my STEM background to slow climate change by researching renewable energy sources. )

#### Electrical engineering research - oscillatory wind-energy harvesting device
During spring 2024, I collaborated with Swarthmore professor [Dr. Emad Masroor](https://emadmasroor.github.io/) and other engineering students to develop a novel oscillatory wind-energy harvesting device. The project improved my technical skills in Arduino circuitry, CAD, and MATLAB, and advanced my experimental and theoretical knowledge of electromagnetic physics and fluid dynamics. It also motivated me to research the computational aspect of fluid dynamics and plasma physics, utilized in nuclear fusion energy generation. 

#### Computational fluid dynamics and numerical methods research
Since January 2024, I have been applying my experience in MATLAB and fluid dynamics to computational mathematics research under Swarthmore professor [Dr. Joseph Nakao](https://jhknakao.github.io/). Dr. Nakao’s numerical methods training--coupled with my MATLAB programming skills and experience in linear algebra, multivariable calculus, and differential equations classes--enabled my summer research implementing high-accuracy, partial differential equation (PDE) solvers for plasma models, like the Vlasov-Poisson and Fokker-Planck equations. This fall, I participated in a reading group, in which I, along with graduate students and professors from the University of Delaware and Swarthmore presented kinetic modeling journal papers, improving my ability to comprehend and present advanced computational mathematics literature. I am currently developing a novel high-accuracy, implicit, low-rank solver for the Vlasov-Dougherty-Fokker-Planck system in cylindrical coordinates, which has applications in plasma simulations. More general Vlasov-Fokker-Planck-type equations can be extended to model nuclear fusion, a research area I am especially drawn to because of its renewable energy applications. 

**Preliminary results**

<div style="display: flex; gap: 10px;">
  <figure>
    <img src="https://github.com/dylan-jacobs/computational-fluid-dynamics/blob/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/numerical_solution.jpg" alt="Numerical solution for Fokker-Planck system in cylindrical coordinates" width=150>
    <figcaption>Figure 1: Numerical solution for Fokker-Planck system in cylindrical coordinates solved with 2nd order implicit Runge-Kutta</figcaption>
  </figure>
  <figure>
    <img src="https://github.com/dylan-jacobs/computational-fluid-dynamics/blob/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/exact_solution.jpg" alt="Reference solution for Fokker-Planck system in cylindrical coordinates" width=150>
    <figcaption>Figure 2: Reference solution for Fokker-Planck system in cylindrical coordinates</figcaption>
  </figure>
  <figure>
    <img src="https://github.com/dylan-jacobs/computational-fluid-dynamics/blob/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/mass.jpg" alt="Mass conservation" width=150>
    <figcaption>Figure 3: Mass conservation</figcaption>
  </figure>
</div>
<div style="display: flex; gap: 10px;">
  <figure>
    <img src="https://github.com/dylan-jacobs/computational-fluid-dynamics/blob/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/relative_entropy.jpg" alt="Numerical solution for Fokker-Planck system in cylindrical coordinates" width=150>
    <figcaption>Figure 4: Relative entropy decay</figcaption>
  </figure>
  <figure>
    <img src="https://github.com/dylan-jacobs/computational-fluid-dynamics/blob/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/l1.jpg" alt="Reference solution for Fokker-Planck system in cylindrical coordinates" width=150>
    <figcaption>Figure 5: L1 decay</figcaption>
  </figure>
  <figure>
    <img src="https://github.com/dylan-jacobs/computational-fluid-dynamics/blob/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/minimum_values.jpg" alt="Mass conservation" width=150>
    <figcaption>Figure 6: Positivity preservation</figcaption>
  </figure>
</div>