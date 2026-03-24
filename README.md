# Non-Contact Friction Simulator

A simple physics-based simulation that models fluid drag and magnetic friction using a velocity-dependent equation and distance dependant equation respectively.

---

## Equations Used

### 1. Fluid Drag (Non-Contact Friction in Medium)

F = k · v²

- F → Drag force  
- v → Velocity  
- k → Constant based on medium (air, water, vacuum)

---

### 2. Magnetic Non-Contact Friction (Conceptual Model)

F = k · sin(2d) · e^(-0.3d)

- F → Magnetic friction force  
- d → Distance between surfaces  
- k → Scaling constant  
- sin(2d) → Oscillatory interaction 
- e^(-0.3d) → Exponential decay with distance

---

### 3. Compare Mode

Displays both:
- Drag force as a function of velocity  
- Magnetic friction as a function of distance

## Concept

### Fluid Drag Friction (Velocity based)

From the real-world drag equation, where drag force increases with the square of velocity.

As velocity increases:
- More particles collide with the object
- Each collision transfers more momentum

This results in a rapid increase in resistance (drag force).

### Magnetic Non-Contact Friction (Distance-Based)

Unlike fluid drag, this form of friction occurs without physical contact and depends on interactions between magnetic domains.

As distance changes:
- Magnetic interactions fluctuate, creating peaks and dips in force  
- The overall effect weakens with increasing distance  

This results in an oscillatory force that decays over distance.

---



