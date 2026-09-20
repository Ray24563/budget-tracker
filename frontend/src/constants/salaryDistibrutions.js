const mayaPercentage = import.meta.env.VITE_MAYA_PERCENTAGE
const bpiPercentage = import.meta.env.VITE_BPI_PERCENTAGE
const goTymePercentage = import.meta.env.VITE_GOTYME_PERCENTAGE
const mariBankPercentage = import.meta.env.VITE_MARIBANK_PERCENTAGE

export const SALARY_DISTRIBUTION = [
  { savings: "Maya",      percentage: mayaPercentage },
  { savings: "BPI",       percentage: bpiPercentage },
  { savings: "GoTyme",    percentage: goTymePercentage },
  { savings: "MariBank",  percentage: mariBankPercentage },
];