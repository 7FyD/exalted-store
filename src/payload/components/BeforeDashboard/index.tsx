import React from "react";
import { Link } from "react-router-dom";

import "./index.scss";

const baseClass = "before-dashboard";

const BeforeDashboard: React.FC = () => {
  return (
    <div className="font-medium text-center">
      <Link target="_blank" rel="noopener noreferrer" href="https://7fyd.dev">
        7FyD.dev
      </Link>
    </div>
  );
};

export default BeforeDashboard;
