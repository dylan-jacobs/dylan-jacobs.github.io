---
permalink: /research/
title: 'My Research'
author_profile: true
math: true
redirect_from: 
---

My Research
------

### Electrical engineering research - oscillatory wind-energy harvesting device
During spring 2024, I collaborated with Swarthmore professor [Dr. Emad Masroor](https://emadmasroor.github.io/) and other engineering students to develop a novel oscillatory wind-energy harvesting device. The project improved my technical skills in Arduino circuitry, CAD, and MATLAB, and advanced my experimental and theoretical knowledge of electromagnetic physics and fluid dynamics. It also motivated me to research the computational aspect of fluid dynamics and plasma physics, utilized in nuclear fusion energy generation. 

### Computational fluid dynamics and numerical methods research
Since January 2024, I have been applying my experience in MATLAB and fluid dynamics to computational mathematics research under Swarthmore professor [Dr. Joseph Nakao](https://jhknakao.github.io/). Dr. Nakao’s numerical methods training--coupled with my MATLAB programming skills and experience in linear algebra, multivariable calculus, and differential equations classes--enabled my summer research implementing high-accuracy, partial differential equation (PDE) solvers for plasma models, like the Vlasov-Poisson and Fokker-Planck equations. This fall, I participated in a reading group, in which I, along with graduate students and professors from the University of Delaware and Swarthmore presented kinetic modeling journal papers, improving my ability to comprehend and present advanced computational mathematics literature. I am currently developing a novel high-accuracy, implicit, low-rank solver for the Vlasov-Dougherty-Fokker-Planck system in cylindrical coordinates, which has applications in plasma simulations. More general Vlasov-Fokker-Planck-type equations can be extended to model nuclear fusion, a research area I am especially drawn to because of its renewable energy applications. 

**Preliminary results**

{% raw %}
I have achieved preliminary results for the Vlasov-Dougherty-Fokker-Planck system solver in cylindrical coordinates. I have solved the basic Fokker-Planck system.

Plasma dynamics and fusion interaction models require systems of nonlinear PDEs. However, analytically solving nonlinear PDEs is often impossible, and experiments are resource-intensive, necessitating high-accuracy numerical solutions. Ideally, these solutions must capture sharp gradients, conserve physical structures (e.g. mass, momentum, energy), and maintain the positivity of the solution. Numerical solutions also suffer from the curse of dimensionality: increasing the numerical solution's dimensions causes exponential growth in computational cost. Plasma systems of interest are described in up to six-dimensional phase space–plus time–via probability density function \( f(x, v, t) \), which describes the likelihood particles exist at position \( \mathbf{x} \in \mathbb{R}^3 \) with velocity \( \mathbf{v} \in \mathbb{R}^3 \) at time \( t > 0 \). 

As a first step, my algorithm solves the spatially homogeneous 0D2V (zero spatial, two velocity dimensions) Dougherty-Fokker-Planck equation

\[
\begin{cases}
    f_t = \nabla_v \cdot \Big( (\mathbf{v} - \mathbf{u})f + \left(\mathbf{D} \nabla f \right)\Big), \quad \mathbf{v} \in \Omega, t > 0 \\
    f(\mathbf{v}; t=0) = f_0(\mathbf{v}), \quad \mathbf{v} \in \Omega
\end{cases}
\]

in cylindrical coordinates with assumed azimuthal symmetry. \( \mathbf{D} \) is the anisotropic diffusion tensor and \( \mathbf{u} \) is the bulk velocity. While the above equation is spatially homogeneous, future goals involve solving the spatially inhomogeneous 1D2V Vlasov-Dougherty-Fokker-Planck equation.

The preliminary results below demonstrate preservation of mass, high-order drive to the correct equilibrium solution (L1 decay), and positivity preservation for the probability distribution. Note that mass and positivity are preserved to the system's truncation tolerance \( 10^{-6} \), and the numerical solution's L1 decay and relative entropy drive to the same tolerance, indicating physical relevance.
{% endraw %}

<div style="display: flex; gap: 10px;">
  <figure>
    <img src="https://raw.githubusercontent.com/dylan-jacobs/computational-fluid-dynamics/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/numerical_solution.jpg" alt="Numerical solution for Fokker-Planck system in cylindrical coordinates" width=250>
    <figcaption>Numerical solution (RK2)</figcaption>
  </figure>
  <figure>
    <img src="https://raw.githubusercontent.com/dylan-jacobs/computational-fluid-dynamics/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/exact_solution.jpg" alt="Reference solution for Fokker-Planck system in cylindrical coordinates" width=250>
    <figcaption>Reference solution</figcaption>
  </figure>
  <figure>
    <img src="https://raw.githubusercontent.com/dylan-jacobs/computational-fluid-dynamics/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/mass.jpg" alt="Mass conservation" width=250>
    <figcaption>Mass conservation</figcaption>
  </figure>
</div>

<div style="display: flex; gap: 10px;">
  <figure>
    <img src="https://raw.githubusercontent.com/dylan-jacobs/computational-fluid-dynamics/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/relative_entropy.jpg" alt="Relative entropy decay" width=250>
    <figcaption>Relative entropy decay</figcaption>
  </figure>
  <figure>
    <img src="https://raw.githubusercontent.com/dylan-jacobs/computational-fluid-dynamics/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/l1.jpg" alt="L1 decay" width=250>
    <figcaption>L1 drive to equilibrium</figcaption>
  </figure>
  <figure>
    <img src="https://raw.githubusercontent.com/dylan-jacobs/computational-fluid-dynamics/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/minimum_values.jpg" alt="Positivity preservation" width=250>
    <figcaption>Positivity preservation</figcaption>
  </figure>
</div>

{% raw %}
We are currently working to extend this **implicit, low-rank** solver to the **1D2V Vlasov-Dougherty-Fokker-Planck** system in cylindrical coordinates.

\[
\begin{cases}
\partial_t f + \mathbf{v} \cdot \nabla_x f + \mathbf{E} \cdot \nabla_v f = C(f, f) \\
C(f, f) = \nabla_v \cdot \Big( (\mathbf{v} - \mathbf{u})f + \left(\mathbf{D} \nabla f \right)\Big), \quad (\mathbf{x}, \mathbf{v}) \in \Omega = \Omega_{x} \times \Omega_{v}, \quad t > 0 
\end{cases}
\]

where \( C(f, f) \) is the advection-diffusion Fokker-Planck operator.
{% endraw %}