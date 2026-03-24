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
  const [mode, setMode] = useState("drag");
  const [distance, setDistance] = useState(1);

  const getK = () => {
    if (medium === "air") return 0.5;
    if (medium === "water") return 2;
    return 0;
  };

  const getFriction = (v, d) => {
    if (mode === "drag") {
      return getK() * v * v;
    }

    // Magnetic friction (conceptual model)
    const k = 10;
    return k * Math.sin(d * 2) * Math.exp(-d * 0.3);
  };

  // Graph values
  const values = Array.from({ length: 11 }, (_, i) => i);

  const dragValues = values.map((v) => getK() * v * v);

  const magneticValues = values.map(
    (d) => 10 * Math.sin(d * 2) * Math.exp(-d * 0.3),
  );

  const data = {
    labels: values,
    datasets: [
      ...(mode !== "magnetic"
        ? [
            {
              label: "Drag",
              data: dragValues,
              borderColor: "cyan",
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 0,
            },
          ]
        : []),

      ...(mode !== "drag"
        ? [
            {
              label: "Magnetic",
              data: magneticValues,
              borderColor: "purple",
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 0,
            },
          ]
        : []),

      {
        label: "Current Value",
        data:
          mode === "drag"
            ? values.map((v) =>
                v === velocity ? getFriction(v, distance) : null,
              )
            : mode === "magnetic"
              ? values.map((d) =>
                  d === Math.round(distance) ? getFriction(0, d) : null,
                )
              : values.map((v) =>
                  v === velocity ? getFriction(v, distance) : null,
                ),
        backgroundColor: "red",
        borderColor: "red",
        pointRadius: 8,
        showLine: false,
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
        ticks: { color: "white" },
        grid: { color: "gray" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "gray" },
      },
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 30px rgba(0,255,255,0.2)",
        }}
      >
        <h1>Friction Simulator</h1>

        {/* Mode Selector */}
        <div style={{ marginBottom: "15px" }}>
          <label>Mode: </label>
          <select onChange={(e) => setMode(e.target.value)}>
            <option value="drag">Fluid Drag</option>
            <option value="magnetic">Magnetic</option>
            <option value="compare">Compare</option>
          </select>
        </div>

        {/* Velocity (only for drag) */}
        {(mode === "drag" || mode === "compare") && (
          <div>
            <label>Velocity: {velocity}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "cyan",
                marginTop: "10px",
              }}
            />
          </div>
        )}

        {/* Medium (only for drag) */}
        {(mode === "drag" || mode === "compare") && (
          <div style={{ marginTop: "15px" }}>
            <label>Medium: </label>
            <select onChange={(e) => setMedium(e.target.value)}>
              <option value="air">Air</option>
              <option value="water">Water</option>
              <option value="vacuum">Vacuum</option>
            </select>
          </div>
        )}

        {/* Distance (only for magnetic) */}
        {(mode === "magnetic" || mode === "compare") && (
          <div style={{ marginTop: "15px" }}>
            <label>Distance: {distance.toFixed(1)}</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "cyan",
                marginTop: "10px",
              }}
            />
          </div>
        )}

        {/* Output */}
        <h2 style={{ marginTop: "20px", color: "cyan" }}>
          Friction Force:{" "}
          {mode === "drag"
            ? getFriction(velocity, distance).toFixed(2)
            : getFriction(0, distance).toFixed(2)}
        </h2>

        {/* Graph */}
        <div style={{ marginTop: "40px" }}>
          <Line data={data} options={options} />
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              borderRadius: "15px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
            }}
          >
            {mode === "drag" && (
              <>
                <h3 style={{ color: "cyan" }}>Fluid Drag (v² Relationship)</h3>
                <p>
                  As velocity increases, drag force increases quadratically.
                  This means doubling the velocity results in four times the
                  resistance.
                </p>
                <p>
                  The smooth upward curve shows how resistance grows rapidly at
                  higher speeds due to increased particle collisions.
                </p>
              </>
            )}

            {mode === "magnetic" && (
              <>
                <h3 style={{ color: "purple" }}>
                  Magnetic Non-Contact Friction
                </h3>
                <p>
                  This model represents friction without physical contact. The
                  force varies with distance due to interactions between
                  magnetic domains.
                </p>
                <p>
                  The wave-like pattern shows peaks and dips, while the overall
                  decrease represents weakening interaction as distance
                  increases.
                </p>
                <p style={{marginTop:"20px"}}>
                  The magnetic friction curve exhibits spikes due to the
                  oscillatory nature of the sine component in the equation,
                  combined with an exponential decay factor. The sine term
                  causes the force to fluctuate, producing periodic peaks and
                  dips that represent variations in magnetic domain interactions
                  as distance changes. At smaller distances, the exponential
                  decay has minimal effect, allowing the sine function to
                  produce larger spikes. As distance increases, the exponential
                  term gradually reduces the overall magnitude of the force,
                  causing the spikes to diminish over time. This results in a
                  wave-like pattern with decreasing amplitude, reflecting how
                  magnetic interactions can vary non-linearly while weakening
                  with increasing separation.
                </p>
              </>
            )}

            {mode === "compare" && (
              <>
                <h3 style={{ color: "cyan" }}>Comparison Insight</h3>
                <p>
                  The cyan curve (drag) increases smoothly with velocity, while
                  the purple curve (magnetic) fluctuates with distance.
                </p>
                <p>
                  This highlights how different physical mechanisms produce very
                  different friction behaviors, even without direct contact.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
