---
title: "Vlasov-Fokker-Planck plasma model solver"
date: November 2025
excerpt: "Current research project under Swarthmore Professor Joseph Nakao: solving the Vlasov-Fokker-Planck plasma model using a low-rank, structure-preserving framework in cylindrical coordinates.<br/><img src='/images/project_icons/VFP/solution_time_200.jpg' width='500'>"
collection: portfolio
---
[Github Repository](https://github.com/dylan-jacobs/computational-fluid-dynamics/tree/main/Vlasov-Fokker-Planck-Solver)

### The model:
We are interested in solving the Vlasov-Fokker-Planck equation to model single-ion plasmas in 1 spatial and 2 velocity dimensions in cylindrical coordinates:

$$
    \frac{\partial f}{\partial t} +
    v_{||}\frac{\partial f}{\partial x} + 
    E_{||}\frac{\partial f}{\partial v_{||}} = C_{\alpha\alpha}(f) + C_{\alpha e}(f)
$$

where the solution $f(x, v_\perp, v_\parallel, t)$ is the ion probability density function in space and velocity  
$E_{\parallel}$ = electric field in parallel ($x$) dimension  
Coupled with fluid electron pressure equation.

<img src="/images/project_icons/VFP/cylinder.png" width="300">

### Numerical discretization:
Spatial mesh: Cells $[x_{i-\frac{1}{2}}, x_{i+\frac{1}{2}}] $  
Velocity mesh: Cells $ [v_{\perp,  j-\frac{1}{2}}, v_{\perp, j+\frac{1}{2}}] \times [v_{\parallel,  l-\frac{1}{2}}, v_{\parallel, l+\frac{1}{2}}]$

$$  f_{i}^{k+1} + \Delta t\Big(E^{k+1}_{\parallel}\frac{\partial f^{k+1}_{i}}{\partial v_{\parallel}} - C_{\alpha \alpha}^{k+1} - C_{\alpha e}^{k+1} \Big) = f_{i}^k - \frac{\Delta t}{\Delta x}v_{||}\left(\hat{f}^k_{i + \frac{1}{2}} - \hat{f}^k_{i - \frac{1}{2}}\right)
$$

Naively, the full-rank solution with spatial size $N_x$ and velocity size $N_v$, the storage complexity is $\mathcal{O}(N_x N_v^2)$, or $\mathcal{O}(N^3)$ if $N_x = N_v = N$.

To avoid the curse of dimensionality, i.e. prohibitively large storage complexity due our equation's high-dimensionality, we use a low-rank framework to numerically solve the time-dependent partial differential equation. In plasma physics applications, the solution is typically low-rank in velocity and we can decompose the solution into its bases in $V_{\perp}$ and $V_{\parallel}$ and singular values:

$$\mathbf{f}^{k}_i = \mathbf{V}_\perp^{k}\mathbf{S}^{k}(\mathbf{V}_\parallel^k)^T$$

Assuming low-rank structure ($r \ll N_v$) $\to$ Storage complexity reduction: $\mathcal{O}(N_x(r^2+2N_vr))$  

### Timestepping procedure:
**At each timestep** $t^k$:  
* Compute moments at next timestep $(n^{k+1}), ((nu_{\parallel})^{k+1}), (T_\alpha^{k+1}), (T_e^{k+1})$ using Newton method
* **At each spatial node** $(x_i)$:

  * Compute numerical fluxes $(\hat{f}^k_{i \pm \frac{1}{2}})$
  * Compute electric field:
    $E_{\parallel}^{k+1} = \frac{1}{q_e n_e^{k+1}}\frac{(n_eT_e)*{i+1}^{k+1} - (n_eT_e)*{i-1}^{k+1}}{2 \Delta x}$
  * Compute collision operators $(C_{\alpha\alpha}^{k+1}, C_{\alpha e}^{k+1})$
  * Solve for $(f_i^{k+1})$ using low-rank projection [1]:

    **Basis update**  
    $K^k = V_\perp^k S^k (V_\parallel^k)^T V_{\parallel,*}^{k+1}$  
    $L^k = V_\parallel^k (S^k)^T (V_\perp^k)^T V_{\perp,*}^{k+1}$
 
    **Galerkin projection**  
    $S^k = (V_{\perp,*}^{k+1})^T V_\perp^k S^k (V_\parallel^k)^T V_{\parallel,*}^{k+1}$

  * Solve for $(K^{k+1}, L^{k+1}, S^{k+1} \mapsto V_\perp^{k+1}, V_\parallel^{k+1}, S^{k+1})$
  * Apply conservative truncation procedure [2]



## Numerical Tests:
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
  <img src="images/VFP/moments_time_0.jpg" width="30%" />
  <img src="images/VFP/moments_time_50.jpg" width="30%" />
  <img src="images/VFP/moments_time_200.jpg" width="30%" />
</p>


Most recently presented at SIAM NNP 2025 Conference poster session:
------
<embed src='/files/SIAM_NNP_Poster_2025.pdf' type='application/pdf' width='100%' height='600px'>


### References:
[1] Nakao, J., Qiu, J.M. and Einkemmer, L., 2025. Reduced Augmentation Implicit Low-rank (RAIL) integrators for advection-diffusion and Fokker–Planck models. SIAM Journal on Scientific Computing, 47(2), pp.A1145-A1169.\\

[2] Guo, W. and Qiu, J.M., 2024. A Local Macroscopic Conservative (LoMaC) low rank tensor method for the Vlasov dynamics. Journal of Scientific Computing, 101(3), p.61.