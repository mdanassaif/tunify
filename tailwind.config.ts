import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        border: 'border 4s ease infinite',
      },
      keyframes: {
        border: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
 
     
          animation: {
            'spin-slow': 'spin 3s linear infinite',
            'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }
 
  
  },
  plugins: [],
};
export default config;
