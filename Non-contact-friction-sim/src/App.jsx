import { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [velocity, setVelocity] = useState(0);
  const [medium, setMedium] = useState("air");

  const getK = () => {
    if (medium === "air") return 0.5;
    if (medium === "water") return 2;
    return 0;
  };

  const getFriction = (v) => {
    return getK() * v * v;
  };

  // Graph
  const velocities = Array.from({ length: 11 }, (_, i) => i);
  const frictionValues = velocities.map((v) => getFriction(v));

  const data = {
    labels: velocities,
    datasets: [
      {
        label: "Friction vs Velocity",
        data: frictionValues,
        borderColor: "cyan",
        backgroundColor: "cyan",
        pointRadius: 0, // hide all default points
      },
      {
        label: "Current Value",
        data: velocities.map((v) => (v === velocity ? getFriction(v) : null)),
        borderColor: "red",
        backgroundColor: "red",
        pointRadius: 6,
        showLine: false, // only show dot
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "gray",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "gray",
        },
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Friction Simulator</h1>

      <div>
        <label>Velocity: {velocity}</label>
        <input
          type="range"
          min="0"
          max="10"
          value={velocity}
          onChange={(e) => setVelocity(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Medium:</label>
        <select onChange={(e) => setMedium(e.target.value)}>
          <option value="air">Air</option>
          <option value="water">Water</option>
          <option value="vacuum">Vacuum</option>
        </select>
      </div>

      <h2>Friction Force: {getFriction(velocity)}</h2>

      <div style={{ width: "500px", marginTop: "30px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default App;
