import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../app/globals.css'
import Modal from '../components/ModalBox';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleThemeToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className={`
      flex justify-between items-center p-5 
      ${isDarkMode 
        ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-black' 
        : 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300'
      } 
      shadow-lg transition-all duration-300
    `}>
      {/* Tunify Logo with Hover Effect */}
      <div 
        onClick={() => setShowModal(true)} 
        className={`
          cursor-pointer 
          
          flex items-center space-x-2
        `}
      >
       

        <svg xmlns="http://www.w3.org/2000/svg"   width="40" 
          height="40"  viewBox="0 0 512 512"   className={`
            ${isDarkMode ? 'text-green-400' : 'text-green-600'}
            transition-colors duration-300
          `}><path fill="currentColor" d="M190.83 20.24v15.262h136.225l-37.823 19.69H190.83v236.53c-16.15-20.85-41.408-34.314-69.736-34.314c-48.594 0-88.19 39.588-88.19 88.176s39.596 88.176 88.19 88.176c44.44 0 81.35-33.11 87.336-75.934a88.263 88.263 0 0 0 1.59-16.69h-.5v-138.03h229.947v143.273c-16.156-20.733-41.344-34.11-69.58-34.11c-48.594 0-88.192 39.59-88.192 88.177c0 48.588 39.598 88.176 88.192 88.176c45.258 0 82.704-34.34 87.633-78.31a88.46 88.46 0 0 0 1.134-14.122h-.498V185.753H267.814l37.825-19.69h152.516v-26.535h-191.61L476.983 20.24H190.83zm18.69 63.492h117.556l-117.556 66.64V83.73zm-88.426 192.364c37 0 67.066 28.642 69.35 65.04H51.745c2.283-36.398 32.348-65.04 69.348-65.04zm248.793 54.863c37.065 0 67.173 28.743 69.36 65.23H300.524c2.19-36.487 32.3-65.23 69.364-65.23z"/></svg>
        <span 
          className={`
            font-bold text-xl 
            ${isDarkMode ? 'text-white' : 'text-gray-800'}
            transition-colors duration-300
          `}
        >
          Tunify
        </span>
      </div>

      {/* Theme Toggle Button with Advanced Animation */}
      <button
        onClick={handleThemeToggle}
        className={`
          p-3 rounded-full 
          transform transition-all duration-500
          hover:shadow-xl hover:scale-110
          ${isDarkMode 
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }
          ${isAnimating ? 'rotate-180 scale-75' : ''}
        `}
      >
        {isDarkMode ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="25" 
            height="25" 
            viewBox="0 0 2048 2048" 
            className="animate-spin-slow"
          >
            <path 
              fill="currentColor" 
              d="M960 512q93 0 174 35t142 96t96 142t36 175q0 93-35 174t-96 142t-142 96t-175 36q-93 0-174-35t-142-96t-96-142t-36-175q0-93 35-174t96-142t142-96t175-36zm0 768q66 0 124-25t101-69t69-102t26-124q0-66-25-124t-69-101t-102-69t-124-26q-35 0-64 7v626q29 7 64 7zm64-896H896V0h128v384zM896 1536h128v384H896v-384zm1024-640v128h-384V896h384zM384 1024H0V896h384v128zm123-426L236 326l90-90l272 271l-91 91zm906 724l271 272l-90 90l-272-271l91-91zm0-724l-91-91l272-271l90 90l-271 272zm-906 724l91 91l-272 271l-90-90l271-272z"
            />
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="25" 
            height="25" 
            viewBox="0 0 24 24" 
            className="animate-pulse"
          >
            <path 
              fill="currentColor" 
              d="M12.058 20q-3.334 0-5.667-2.333Q4.058 15.333 4.058 12q0-3.038 1.98-5.27Q8.02 4.5 10.942 4.097q.081 0 .159.006t.153.017q-.506.706-.801 1.57q-.295.865-.295 1.811q0 2.667 1.866 4.533q1.867 1.867 4.534 1.867q.952 0 1.813-.295q.862-.295 1.548-.801q.012.075.018.153q.005.078.005.158q-.384 2.923-2.615 4.904T12.057 20Zm0-1q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.158 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5.058 12q0 2.9 2.05 4.95t4.95 2.05Zm-.25-6.75Z"
            />
          </svg>
        )}
      </button>

      {/* Modal Rendering */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Header;