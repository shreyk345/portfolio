---
title: "Bioluminescence"
date: "2025-04-01"
tags: ["Worldbuilding", "VR/XR", "Level Design"]
thumbnail: "/projects/bioluminescence/water1.avif"
description: "Building a virtual reality environment on Unity, optimised for MetaQuest."
featured: false
protected: false
problem: "Developing an immersive, authentic virtual reality experience."
solution: "Virtual reality world where player spawns in a bioluminescent cave, and exits onto a glowing beach with custom particles on entering the water, designed and optimised for VR."
prototypeUrl: "https://vrchat.com/home/launch?worldId=wrld_14c2db92-0c69-4a5a-a18d-25b11bec3d74"
duration: "10 weeks"
role: "VR Designer"
previewImages:
  - "/projects/bioluminescence/water2.avif"
  - "/projects/bioluminescence/beach.avif"
  - "/projects/bioluminescence/cave_entrance.avif"
---

## Background

In April 2025, I joined MAVERiC studio, the XR training and development studio at Origami Air Co. Having no major prior experience in XR development- specifically, Unity- my teammate and I set out to build a virtual environment that would replicate bioluminescence. Vaidehi Karve and I spent 10 weeks developing our environment.

The environment transitions from a glowing crystal cave to a tranquil bioluminescent beach, complete with sound system, invoking a sense of peace and tranquility. I wanted to capture the wonder of walking through bioluminescence for those who can't actually experience the magic in person.

As the XR Designer and Developer for the team, I used Unity and the VRChat SDK to create materials like Shader Graphs, VFX Graphs on the Universal Render Pipeline, and tried to optimise them as best as possible to run smoothly on the Meta Quest. We built the system entirely from scratch, gaining skills in level design and asset creation in addition to the package development required to create effects like footprints in the sand trailing behind the user when they walk, for example.

## Process

**Worldbuilding & Level Design:** Built the environment from scratch using Unity’s URP. Developed a glowing cave and beach system using modular assets, terrain sculpting, and lighting workflows optimized for standalone VR.

**Technical Art & VFX:** Designed a custom particle system and shader graphs to simulate natural bioluminescent effects. Implemented fog, bloom, color grading, and volumetric lighting to heighten immersion.

**Iteration & User Testing:** Over a two-month period, conducted user testing sessions to gather feedback on navigation, performance, and emotional response. Prototyped and refined interactions and lighting sequences for comfort and visual cohesion.

**Optimization:** Tuned materials, draw calls, and post-processing to ensure smooth performance on Meta Quest while maintaining visual richness.

<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:2em 0">
  <figure style="margin:0">
    <img src="/projects/bioluminescence/cave_entrance.avif" alt="Cave Entrance" style="width:100%; border-radius:10px" />
    <figcaption style="font-size:14px; opacity:0.6; margin-top:2px; text-align:left"> Player Spawn Point </figcaption>
  </figure>
  <figure style="margin:0">
    <img src="/projects/bioluminescence/beach.avif" alt="Beach" style="width:100%; border-radius:10px" />
    <figcaption style="font-size:14px; opacity:0.6; margin-top:2px; text-align:left">In-world Beach</figcaption>
  </figure>
</div>

<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:2em 0">
  <figure style="margin:0">
    <img src="/projects/bioluminescence/shells.avif" alt="Shells" style="width:100%; border-radius:10px" />
    <figcaption style="font-size:14px; opacity:0.6; margin-top:2px; text-align:left"> Custom Shell Designs scattered across world </figcaption>
  </figure>
  <figure style="margin:0">
    <img src="/projects/bioluminescence/water2.avif" alt="Custom Glow" style="width:100%; border-radius:10px" />
    <figcaption style="font-size:14px; opacity:0.6; margin-top:2px; text-align:left">Glow Effect on entering water</figcaption>
  </figure>
</div>

## Reflections

This project taught me how physical context shapes digital interaction. The most technically capable solution (audio cues) was the least trusted — users needed visual confirmation.
 