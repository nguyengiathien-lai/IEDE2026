const scenarioMeta = {
  micro_demand: {
    title: "Scenario 1",
    subtitle: "Micro Demand",
  },
  daily_volume: {
    title: "Scenario 2",
    subtitle: "Daily Volume",
  },
  channel_choice: {
    title: "Scenario 3",
    subtitle: "Channel Choice",
  },
};

function ScenarioTabs({ scenario, onChange }) {
  return (
    <div className="tabs-wrap">
      {Object.entries(scenarioMeta).map(([key, meta]) => (
        <button
          key={key}
          type="button"
          className={`tab-btn ${scenario === key ? "active" : ""}`}
          onClick={() => onChange(key)}
        >

        <span>{meta.title}</span>
          <strong>{meta.subtitle}</strong>
        </button>
      ))}
    </div>
  );
}

export default ScenarioTabs;