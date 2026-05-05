// function PredictionForm({ formData, options, onChange, onSubmit, loading }) {
//   return (
//     <div className="panel-card">
//       <div className="panel-header">
//         <h2>Prediction Input</h2>
//         <p>Fill in the business context to generate a forecast.</p>
//       </div>

//       <form className="form-grid" onSubmit={onSubmit}>
//         <div className="field-group">
//           <label>Region</label>
//           <select name="region" value={formData.region} onChange={onChange} required>
//             <option value="">Select region</option>
//             {options.region?.map((item) => (
//               <option key={item} value={item}>{item}</option>
//             ))}
//           </select>
//         </div>

//         <div className="field-group">
//           <label>Month</label>
//           <select name="month_num" value={formData.month_num} onChange={onChange} required>
//             <option value="">Select month</option>
//             {options.month_num?.map((item) => (
//               <option key={item} value={item}>{item}</option>
//             ))}
//           </select>
//         </div>

//         <div className="field-group">
//           <label>Day of Week</label>
//           <select name="day_num" value={formData.day_num} onChange={onChange} required>
//             <option value="">Select day</option>
//             <option value="1">Monday</option>
//             <option value="2">Tuesday</option>
//             <option value="3">Wednesday</option>
//             <option value="4">Thursday</option>
//             <option value="5">Friday</option>
//             <option value="6">Saturday</option>
//             <option value="7">Sunday</option>
//           </select>
//         </div>

//        <div className="field-group">
//           <label>Drink Category</label>
//           <select name="drink_category" value={formData.drink_category} onChange={onChange} required>
//             <option value="">Select drink category</option>
//             {options.drink_category?.map((item) => (
//               <option key={item} value={item}>{item}</option>
//             ))}
//           </select>
//         </div>

//         <div className="field-group">
//           <label>Store Location Type</label>
//           <select name="store_location_type" value={formData.store_location_type} onChange={onChange} required>
//             <option value="">Select store location type</option>
//             {options.store_location_type?.map((item) => (
//               <option key={item} value={item}>{item}</option>
//             ))}
//           </select>
//         </div>

//         <div className="field-group">
//           <label>Order Channel</label>
//           <select name="order_channel" value={formData.order_channel} onChange={onChange} required>
//             <option value="">Select order channel</option>
//             {options.order_channel?.map((item) => (
//               <option key={item} value={item}>{item}</option>
//             ))}
//           </select>
//         </div>

//         <button className="primary-btn" type="submit" disabled={loading}>
//           {loading ? "Predicting..." : "Predict Demand"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default PredictionForm;



const dayOptions = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

function PredictionForm({ scenario, formData, options, onChange, onSubmit, loading }) {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Prediction Input</h2>
        <p>The fields below change automatically based on the selected scenario.</p>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        {(scenario === "micro_demand" || scenario === "daily_volume" || scenario === "channel_choice") && (
          <div className="field-group">
            <label>Region</label>
            <select name="region" value={formData.region} onChange={onChange} required>
              <option value="">Select region</option>
              {options.region?.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        )}

        {(scenario === "micro_demand" || scenario === "daily_volume") && (
          <>
            <div className="field-group">
              <label>Month</label>
              <select name="month_num" value={formData.month_num} onChange={onChange} required>
                <option value="">Select month</option>
                {options.month_num?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Day of Week</label>
              <select name="day_num" value={formData.day_num} onChange={onChange} required>
                <option value="">Select day</option>
                {dayOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {scenario === "micro_demand" && (
          <>
            <div className="field-group">
              <label>Drink Category</label>
              <select name="drink_category" value={formData.drink_category} onChange={onChange} required>
                <option value="">Select drink category</option>
                {options.drink_category?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Store Location Type</label>
              <select name="store_location_type" value={formData.store_location_type} onChange={onChange} required>
                <option value="">Select store location type</option>
                {options.store_location_type?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Order Channel</label>
              <select name="order_channel" value={formData.order_channel} onChange={onChange} required>
                <option value="">Select order channel</option>
                {options.order_channel?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {scenario === "daily_volume" && (
          <div className="field-group">
            <label>Order Channel</label>
            <select name="order_channel" value={formData.order_channel} onChange={onChange} required>
              <option value="">Select order channel</option>
              {options.order_channel?.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        )}

        {scenario === "channel_choice" && (
          <>
            <div className="field-group">
              <label>Customer Age Group</label>
              <select name="customer_age_group" value={formData.customer_age_group} onChange={onChange} required>
                <option value="">Select age group</option>
                {options.customer_age_group?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Rewards Member</label>
              <select name="is_rewards_member" value={formData.is_rewards_member} onChange={onChange} required>
                <option value="">Select membership status</option>
                {options.is_rewards_member?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Order Hour</label>
              <select name="order_hour" value={formData.order_hour} onChange={onChange} required>
                <option value="">Select hour</option>
                {options.order_hour?.map((item) => (
                  <option key={item} value={item}>{item}:00</option>
                ))}
              </select>
            </div>
          </>
        )}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Run Scenario"}
        </button>
      </form>
    </div>
  );
}

export default PredictionForm;


