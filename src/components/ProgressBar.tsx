"use client";

import React from "react";

interface ProgressBarProps {
  current: number;
  target: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, target }) => {
  const percentage = target > 0 ? (current / target) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  const formattedPercentage = clampedPercentage.toFixed(2);

  // Determine color based on progress
  let progressColor = "bg-blue-500";
  if (clampedPercentage >= 100) {
    progressColor = "bg-green-500";
  } else if (clampedPercentage >= 75) {
    progressColor = "bg-yellow-500";
  } else if (clampedPercentage >= 50) {
    progressColor = "bg-blue-500";
  } else if (clampedPercentage >= 25) {
    progressColor = "bg-indigo-500";
  } else {
    progressColor = "bg-purple-500";
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span>Progress</span>
        <span>{formattedPercentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className={`${progressColor} h-4 rounded-full transition-width duration-500`}
          style={{ width: `${clampedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
