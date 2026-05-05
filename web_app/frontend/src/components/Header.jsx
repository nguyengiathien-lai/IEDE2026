// import { Coffee } from "lucide-react";

// function Header() {
//   return (
//     <header className="header-card">
//       <div className="brand-wrap">
//         <div className="brand-icon">
//           <Coffee size={26} />
//         </div>
//         <div>
//           <p className="eyebrow">Machine Learning Dashboard</p>
//           <h1>Food & Beverage Demand Prediction</h1>
//           <p className="subtext">
//             Estimate product demand from store, time, and channel inputs.
//           </p>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

import { Coffee } from "lucide-react";

function Header() {
  return (
    <header className="header-card">
      <div className="brand-wrap">
        <div className="brand-icon">
          <Coffee size={26} />
        </div>
        <div>
          {/* <p className="eyebrow">Machine Learning Dashboard</p> */}
          <h1>Food & Beverage Prediction Center</h1>
          {/* <p className="subtext">
          
          </p> */}
        </div>
      </div>
    </header>
  );
}

export default Header;