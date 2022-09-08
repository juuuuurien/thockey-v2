import React from "react";

const Spinner: React.FC = () => {
  return (
    <svg className={`spinner z-50 my-10`} viewBox="0 0 50 50">
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      ></circle>
    </svg>
  );
};

export default Spinner;
