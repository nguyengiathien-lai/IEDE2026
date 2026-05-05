// function ResultPanel({ result, error }) {
//   return (
//     <div className="panel-card result-panel">
//       <div className="panel-header">
//         <h2>Prediction Result</h2>
//         <p>Business interpretation of the model output.</p>
//       </div>

//       {error && <div className="error-box">{error}</div>}

//       {!error && !result && (
//         <div className="placeholder-box">
//           Enter store conditions and click <strong>Predict Demand</strong>.
//         </div>
//       )}

//       {!error && result && (
//         <div className="result-content">
//           <div className="result-main">
//             <span className="result-label">Predicted Demand</span>
//             <h3>{result.predicted_demand}</h3>
//           </div>

//           <div className="result-row">
//             <span className="chip">{result.demand_level}</span>
//           </div>

//           <div className="recommendation-box">
//             <h4>Recommendation</h4>
//             <p>{result.recommendation}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ResultPanel;

function ResultPanel({ result, error }) {
  return (
    <div className="panel-card result-panel">
      <div className="panel-header">
        <h2>Prediction Result</h2>
        <p>Business-friendly interpretation of the selected scenario.</p>
      </div>

      {error && <div className="error-box">{error}</div>}

      {!error && !result && (
        <div className="placeholder-box">
          Choose a scenario, fill in the inputs, and click <strong>Run Scenario</strong>.
        </div>
      )}

      {!error && result && (
        <div className="result-content">
          <div className="result-main">
            <span className="result-label">{result.prediction_label}</span>
            <h3>{result.prediction_value}</h3>
          </div>

          <div className="recommendation-box">
            <h4>Business Insight</h4>
            <p>{result.insight}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultPanel;