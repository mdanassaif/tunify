// src/components/icons/TunifyLogo.tsx
import React from 'react';

interface IconProps {
  className?: string;
}

export const TunifyLogo: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    width="30" 
    height="30"  
    viewBox="0 0 1200 1200"
    className={className}
  >
    <path 
      fill="currentColor" 
      d="m750.588 371.765l230.588-145.882L755.293 0L609.412 324.706L524.706 70.588L298.824 221.176l188.234 150.588H58.824v301.178h75.294V1200h931.763V672.941h75.295V371.765H750.588zm23.756-272.854l118.195 118.195l-241.1 152.89L774.344 98.911zm-279.832 59.675l66.739 200.216l-166.848-133.477l100.109-66.739zm30.194 966.12H209.412v-475.35h315.294v475.35zm0-527.06H134.118V447.059h390.588v150.587zm465.882 527.06H675.293v-475.35h315.295v475.35zm75.293-527.06H675.293V447.059h390.588v150.587z"
    />
  </svg>
);