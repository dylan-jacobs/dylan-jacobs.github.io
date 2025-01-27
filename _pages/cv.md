---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
* B.S. in General Engineering, B.A. in Applied Mathematics, Swarthmore College, 2027 (expected)

  Relevant coursework:
  * Electrical circuit analysis, mechanics, data structures & algorithms, computer engineering
  * Ordinary & partial differential equations, numerical methods for differential equations, directed reading group on tensors
  
  GPA: 3.95/4.00

Work & research experience
======
* Jan 2024—present: Applied Mathematics Research Assistant                                                                
  * Utilizing principles of **computational fluid dynamics and numerical methods** to research high-order 
  accurate methods for time-dependent partial differential equations (PDEs), **plasma/kinetic models.** 
  * Using **MATLAB** to implement PDE-solvers 
  * Presenting research results at Swarthmore Sigma Xi poster session.  
  * Developing a novel low-rank, structure-preserving, highly accurate integrator for the Vlasov-Fokker-
  Planck equation in cylindrical coordinates; documenting research results in LaTeX journal 

* Dec 2023—May 2024: Electrical Engineering Research Assistant                                                        
  * Researched electrical and aerospace science behind oscillatory wind-energy devices to develop a 
  novel, small-scale wind-energy harvester. 
  * Used MATLAB and **Arduino** to record and analyze voltage data from electromagnetic induction. 
  * Simulations done using **Arduino, MATLAB** and **ViscousFlow.**

* Jun 2022—Aug 2022: Software Engineering Intern, Oregon Health and Science University            
  * Developed mobile Android app in Kotlin 
  * Attended and presented weekly project updates and machine learning meetings; presented 
  machine-learning paper to reading group.
  
Skills
======
* **Programming Languages**: Python, MATLAB, Java, C++, C#, Kotlin 
* **Software**: VSCode, MATLAB, Git, SolidWorks, AutoCAD, MS Office 
* **Foreign Languages**: Spanish (Fluent), Global Seal of Biliteracy (2022)

Projects
======
<ul>{% for post in site.portfolio reversed %}
  {% include archive-single-cv.html %}
  {% endfor %} </ul>

[Publications
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>]: #

[Talks
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>]: #
  

[Teaching
======
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>]: #