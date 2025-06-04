"use client";

import { useState } from "react";

const MiniButtonRow = ({miniButtonLabels}:{miniButtonLabels: string[]}) => {
  const [active, setActive] = useState(miniButtonLabels[0]);

  return(
      <div className="mt-4 flex justify-center flex-wrap">
        {
          miniButtonLabels.map((label, index) => (
            <button 
            key={index}
            onClick={() => setActive(label)}
            className={`text-sm font-medium transition-all duration-200 ml-1 mr-1 px-3 py-1.5 
            ${
              label === active
                ? "bg-white text-black rounded-md shadow"
                : "bg-gray-500 rounded-md shadow text-white hover:text-gray-300"
            }`}
            >
              {label}
            </button>
          ))
        }
      </div>
  )
}

export default MiniButtonRow