---
title: "Vlasov-Fokker-Planck plasma model solver"
date: January 2026
excerpt: "Current research project under Swarthmore Professor Joseph Nakao: solving the Vlasov-Fokker-Planck plasma model using a low-rank, structure-preserving framework in cylindrical coordinates.<br/><img src='/images/project_icons/VFP/solution_time_200.jpg' width='500'>"
collection: portfolio
categories: cfd
---
[Github Repository](https://github.com/dylan-jacobs/computational-fluid-dynamics/tree/main/Vlasov-Fokker-Planck-Solver)


### The model
We are interested in solving the Vlasov-Fokker-Planck (VFP) equation to model single-ion plasmas in 1 spatial and 2 velocity dimensions in cylindrical coordinates:

$$

\begin{cases}
\partial_t f + \mathbf{v} \cdot \nabla_x f + \mathbf{E} \cdot \nabla_v f = C_{\alpha \alpha}(f, f) + C_{\alpha e}(f, f)\\
C(f, f) = \nabla_v \cdot \Big( (\mathbf{v} - \mathbf{u})f + \left(\mathbf{D} \nabla f \right)\Big), \quad (\mathbf{x}, \mathbf{v}) \in \Omega = \Omega_{x} \times \Omega{v}, \quad t > 0 
\end{cases}
$$

where the solution $f(x, v_\perp, v_\parallel, t)$ is the ion probability density function in space and velocity  
$\mathbf{E}$ = electric field  
$C_{\alpha \alpha}(f, f)$ = ion-ion advection-diffusion Fokker-Planck collision operator.  
$C{\alpha e}(f, f)$ = ion-electron advection-diffusion Fokker-Planck collision operator.

<img src="/images/project_icons/VFP/cylinder.png" width="300">

This equation is also coupled with the fluid electron pressure equation. All systems depend on the system's zeroth, first, and second moments: mass/number density $n$, momentum $nu_{\parallel}$, and ion temperature $T_\alpha$, as well as the electron temperature $T_e$.

### Numerical discretization
We discretize the Vlasov-Fokker-Planck equation over a spatial and velocity mesh:  
Spatial mesh: Cells $[x_{i-\frac{1}{2}}, x_{i+\frac{1}{2}}] $  
Velocity mesh: Cells $ [v_{\perp,  j-\frac{1}{2}}, v_{\perp, j+\frac{1}{2}}] \times [v_{\parallel,  l-\frac{1}{2}}, v_{\parallel, l+\frac{1}{2}}]$

$$  f_{i}^{k+1} + \Delta t\Big(E^{k+1}_{\parallel}\frac{\partial f^{k+1}_{i}}{\partial v_{\parallel}} - C_{\alpha \alpha}^{k+1} - C_{\alpha e}^{k+1} \Big) = f_{i}^k - \frac{\Delta t}{\Delta x}v_{||}\left(\hat{f}^k_{i + \frac{1}{2}} - \hat{f}^k_{i - \frac{1}{2}}\right)
$$

where the numerical fluxes $\hat{f}^k_{i \pm \frac{1}{2}}$ are computed using a standard first-order upwinding scheme to determine the system's velocity in the $x$ dimension.  

### Storage complexity and the curse of dimensionality

Naively, the full-rank solution with spatial size $N_x$ and velocity size $N_v$, the storage complexity is $\mathcal{O}(N_x N_v^2)$, or $\mathcal{O}(N^3)$ if $N_x = N_v = N$.

To avoid the curse of dimensionality, i.e. prohibitively large storage complexity due our equation's high-dimensionality, we use a low-rank framework to numerically solve the time-dependent partial differential equation. In plasma physics applications, the solution is typically low-rank in velocity and we can decompose the solution into its bases in $V_{\perp}$ and $V_{\parallel}$ and singular values:

$$\mathbf{f}^{k}_i = \mathbf{V}_\perp^{k}\mathbf{S}^{k}(\mathbf{V}_\parallel^k)^T$$

Assuming low-rank structure ($r \ll N_v$) $\to$ Storage complexity reduction: $\mathcal{O}(N_x(r^2+2N_vr))$  

### Newton method and fluid solver

Because the stiff collision and Lorentz force operators require us to use implicit Runge-Kutta methods, we need to compute the moments $(n^{k+1}), ((nu_{\parallel})^{k+1}), (T_\alpha^{k+1}), (T_e^{k+1})$ at future time-steps. Thus, we incorporate a fluid solver that explicitly solves the VFP and fluid electron pressure equation system, analytically integrated to model the zeroth, first, and second moments. We use temporally second-order diagonally implicit Runge Kutta (DIRK2) method to compute these moments at future timesteps.

| Quantity   | Δt    | L1 (global) | Mass   | Momentum | Ion Temp | Electron Temp |
|-----------|-------|-------------|--------|----------|----------|---------------|
| L1 error  | 0.20  | 0.148       | 0.956  | 0.128    | 0.983    | 0.563         |
|           | 0.10  | 0.037       | 0.240  | 0.032    | 0.245    | 0.139         |
|           | 0.05  | 0.009       | 0.060  | 0.008    | 0.061    | 0.034         |
|           | 0.025 | 0.002       | 0.015  | 0.002    | 0.015    | 0.009         |
| Order     | 0.20 → 0.10  | 2.007 | 1.992 | 2.014 | 2.003 | 2.023 |
|           | 0.10 → 0.05  | 2.003 | 1.996 | 2.006 | 2.002 | 2.011 |
|           | 0.05 → 0.025 | 2.001 | 1.998 | 2.003 | 2.001 | 2.005 |


### Timestepping procedure
**At each timestep** $t^k$:  
* Compute moments at next timestep $(n^{k+1}), ((nu_{\parallel})^{k+1}), (T_\alpha^{k+1}), (T_e^{k+1})$ using Newton method
* **At each spatial node** $(x_i)$:

  * Compute numerical fluxes $(\hat{f}^k_{i \pm \frac{1}{2}})$
  * Compute electric field:  
    $$
    E_{\parallel}^{k+1} = \dfrac{1}{q_{e}n_{e}^{k+1}} \dfrac{(n_{e}T_{e})_{i+1}^{k+1} - (n_eT_{e})_{i-1}^{k+1}}{2 \Delta x}
    $$ 

  * Compute collision operators $(C_{\alpha\alpha}^{k+1}, C_{\alpha e}^{k+1})$
  * Solve for $(f_i^{k+1})$ using low-rank projection [1]:

    **Basis update**  
      $K^k = V_\perp^k S^k (V_{\parallel}^k)^T V_{\parallel,\star}^{k+1}$  

      $L^k = V_\parallel^k (S^k)^T (V_\perp^k)^T V_{\perp,\star}^{k+1}$  
  
    **Galerkin projection**  
      $S^k = (V_{\perp,\star}^{k+1})^T V_\perp^k S^k (V_\parallel^k)^T V_{\parallel,\star}^{k+1}$  

  * Solve for $(K^{k+1}, L^{k+1}, S^{k+1} \mapsto V_\perp^{k+1}, V_\parallel^{k+1}, S^{k+1})$
  * Apply conservative truncation procedure [2]



## Numerical Tests
We test our solver on a standing shock problem, where the solution is initialized as a Maxwellian moments (mass, momentum, energy) at each spatial node are initialized as hyperbolic tanget equations in space
 
Numerical solution at time t=200:
------
<img src="https://github.com/dylan-jacobs/computational-fluid-dynamics/blob/main/Vlasov-Fokker-Planck-Solver/Plots/solution_time_200.jpg?raw=true" width="400">

Mass, momentum, and energy conservation (up to truncation tolerance):
------
<img src="https://github.com/dylan-jacobs/computational-fluid-dynamics/blob/main/Vlasov-Fokker-Planck-Solver/Plots/conservation.jpg?raw=true" width="400">

Mass, momentum, and energy of the system across space, evolved over time.
------
<p float="left">
  <img src="/images/project_icons/VFP/moments_time_0.jpg" width="30%" />
  <img src="/images/project_icons/VFP/moments_time_50.jpg" width="30%" />
  <img src="/images/project_icons/VFP/moments_time_200.jpg" width="30%" />
</p>


Most recently presented at SIAM NNP 2025 Conference poster session:
------
<embed src='/files/SIAM_NNP_Poster_2025.pdf' type='application/pdf' width='100%' height='600px'>


### References
[1] Nakao, J., Qiu, J.M. and Einkemmer, L., 2025. Reduced Augmentation Implicit Low-rank (RAIL) integrators for advection-diffusion and Fokker–Planck models. SIAM Journal on Scientific Computing, 47(2), pp.A1145-A1169.\\

[2] Guo, W. and Qiu, J.M., 2024. A Local Macroscopic Conservative (LoMaC) low rank tensor method for the Vlasov dynamics. Journal of Scientific Computing, 101(3), p.61.



## The Dougherty-Fokker-Planck Equation
During Fall 2024, as a first step, I worked to develop a low-rank, implicit, structure-preserving solver for the spatially homogeneous 0D2V (zero spatial, two velocity dimensions) Dougherty-Fokker-Planck equation:

$$
\begin{cases}
    f_t = \nabla_v \cdot \Big( (\mathbf{v} - \mathbf{u})f + \left(\mathbf{D} \nabla f \right)\Big), \quad \mathbf{v} \in \Omega, t > 0 \\
    f(\mathbf{v}; t=0) = f_0(\mathbf{v}), \quad \mathbf{v} \in \Omega
\end{cases}
$$

in cylindrical coordinates with assumed azimuthal symmetry. $ \mathbf{D} $ is the anisotropic diffusion tensor and $ \mathbf{u} $ is the bulk velocity. While the above equation is spatially homogeneous, future goals involve solving the spatially inhomogeneous 1D2V Vlasov-Dougherty-Fokker-Planck equation.

The preliminary results below demonstrate preservation of mass, high-order drive to the correct equilibrium solution (L1 decay), and positivity preservation for the probability distribution. Note that mass and positive are preserved to the system's truncation tolerance $ 10 ^{-6} $, and the numerical solution's L1 decay and relative entropy drivee to the same tolerance, indicating physical relevance.

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
    <img src="https://raw.githubusercontent.com/dylan-jacobs/computational-fluid-dynamics/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/relative_entropy.jpg" alt="Numerical solution for Fokker-Planck system in cylindrical coordinates" width=250>
    <figcaption>Relative entropy decay</figcaption>
  </figure>
  <figure>
    <img src="https://raw.githubusercontent.com/dylan-jacobs/computational-fluid-dynamics/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/l1.jpg" alt="Reference solution for Fokker-Planck system in cylindrical coordinates" width=250>
    <figcaption>L1 drive to equilibrium</figcaption>
  </figure>
  <figure>
    <img src="https://raw.githubusercontent.com/dylan-jacobs/computational-fluid-dynamics/main/Fokker-Planck%20Solver/Cylindrical%20Coordinates/Implicit/Plots/RK2/minimum_values.jpg" alt="Mass conservation" width=250>
    <figcaption>Positivity preservation</figcaption>
  </figure>
</div>


# Electrical engineering research - oscillatory wind-energy harvesting device
During spring 2024, I collaborated with Swarthmore professor [Dr. Emad Masroor](https://emadmasroor.github.io/) and other engineering students to develop a novel oscillatory wind-energy harvesting device. The project improved my technical skills in Arduino circuitry, CAD, and MATLAB, and advanced my experimental and theoretical knowledge of electromagnetic physics and fluid dynamics. It also motivated me to research the computational aspect of fluid dynamics and plasma physics, utilized in nuclear fusion energy generation. 
