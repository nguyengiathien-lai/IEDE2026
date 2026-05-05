// import { useEffect, useState } from "react";
// import Header from "./components/Header";
// import StatCard from "./components/StatCard";
// import PredictionForm from "./components/PredictionForm";
// import ResultPanel from "./components/ResultPanel";
// import { fetchOptions, predictDemand } from "./services/predictionService";

// const initialForm = {
//   region: "",
//   month_num: "",
//   day_num: "",
//   drink_category: "",
//   store_location_type: "",
//   order_channel: "",
// };

// function App() {
//   const [options, setOptions] = useState({});
//   const [formData, setFormData] = useState(initialForm);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const loadOptions = async () => {
//       try {
//         const data = await fetchOptions();
//         setOptions(data);
//       } catch (err) {
//         setError("Failed to load available options from backend.");
//       }
//     };

//     loadOptions();
//   }, []);
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const payload = {
//         ...formData,
//         month_num: Number(formData.month_num),
//         day_num: Number(formData.day_num),
//       };

//       const data = await predictDemand(payload);
//       setResult(data);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Prediction failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-shell">
//       <Header />

//       <section className="stats-grid">
//         <StatCard label="Model Type" value="Random Forest" />
//         <StatCard label="Prediction Scope" value="Micro Demand" />
//         <StatCard label="Input Factors" value="6 Features" />
//       </section>

//       <section className="dashboard-grid">
//         <PredictionForm
//           formData={formData}
//           options={options}
//           onChange={handleChange}
//           onSubmit={handleSubmit}
//           loading={loading}
//         />

//         <ResultPanel result={result} error={error} />
//       </section>
//     </div>
//   );
// }

// export default App;

import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import ScenarioTabs from "./components/ScenarioTabs";
import PredictionForm from "./components/PredictionForm";
import ResultPanel from "./components/ResultPanel";
import { fetchOptions, predictDemand } from "./services/predictionService";

const initialForm = {
  region: "",
  month_num: "",
  day_num: "",
  drink_category: "",
  store_location_type: "",
  order_channel: "",
  customer_age_group: "",
  is_rewards_member: "",
  order_hour: "",
};

function App() {
  const [scenario, setScenario] = useState("micro_demand");
  const [options, setOptions] = useState({});
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await fetchOptions();
        setOptions(data);
      } catch {
        setError("Failed to load available options from backend.");
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    setResult(null);
    setError("");
    setFormData(initialForm);
  }, [scenario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildPayload = () => {
    const common = { scenario };

    if (scenario === "micro_demand") {
      return {
        ...common,
        region: formData.region,
        month_num: Number(formData.month_num),
        day_num: Number(formData.day_num),
        drink_category: formData.drink_category,
        store_location_type: formData.store_location_type,
        order_channel: formData.order_channel,
      };
    }

    if (scenario === "daily_volume") {
      return {
        ...common,
        region: formData.region,
        month_num: Number(formData.month_num),
        day_num: Number(formData.day_num),
        order_channel: formData.order_channel,
      };
    }

    // const isRewardsMember = (formData.is_rewards_member === "True"? 1 : 0);

    return {
      ...common,
      region: formData.region,
      customer_age_group: formData.customer_age_group,
      is_rewards_member: formData.is_rewards_member,
      order_hour: Number(formData.order_hour),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await predictDemand(buildPayload());
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const scenarioLabel = useMemo(() => {
    if (scenario === "micro_demand") return "Micro Demand";
    if (scenario === "daily_volume") return "Daily Volume";
    return "Channel Choice";
  }, [scenario]);

  return (
    <div className="page-shell">
      <Header />

      {/* <section className="stats-grid">
        <StatCard label="Models" value="3 Scenarios" />
        <StatCard label="Active Scenario" value={scenarioLabel} />
        <StatCard label="Algorithm Mix" value="RF Regressor + Classifier" />
      </section> */}

      <ScenarioTabs scenario={scenario} onChange={setScenario} />

      <section className="dashboard-grid">
        <PredictionForm
          scenario={scenario}
          formData={formData}
          options={options}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <ResultPanel result={result} error={error} />
      </section>
    </div>
  );
}

export default App;