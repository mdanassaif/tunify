import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../app/globals.css'
import Modal from '../components/ModalBox';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const handleTunifyClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='flex justify-between p-5'>

      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 50 50" onClick={() => setShowModal(true)} className='cursor-pointer underline'>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="#344054" stroke-width="3" d="M25.104 28.125h-.208" />
          <path stroke="#344054" stroke-width="2" d="M25 18.75v-4.167" />
          <path stroke="#306CFE" stroke-width="2" d="M41.667 6.25H8.333A2.083 2.083 0 0 0 6.25 8.333v27.084A2.083 2.083 0 0 0 8.333 37.5h8.334v6.25l10.416-6.25h14.584a2.083 2.083 0 0 0 2.083-2.083V8.333a2.083 2.083 0 0 0-2.083-2.083" />
        </g>
      </svg>

      {showModal && <Modal onClose={() => setShowModal(false)} />}




      <button
        onClick={toggleTheme}
        className={`p-2 rounded-full   hover:shadow-lg transition-all duration-300`}
      >
        {isDarkMode ? <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 2048 2048">
          <path fill="currentColor" d="M960 512q93 0 174 35t142 96t96 142t36 175q0 93-35 174t-96 142t-142 96t-175 36q-93 0-174-35t-142-96t-96-142t-36-175q0-93 35-174t96-142t142-96t175-36zm0 768q66 0 124-25t101-69t69-102t26-124q0-66-25-124t-69-101t-102-69t-124-26q-35 0-64 7v626q29 7 64 7zm64-896H896V0h128v384zM896 1536h128v384H896v-384zm1024-640v128h-384V896h384zM384 1024H0V896h384v128zm123-426L236 326l90-90l272 271l-91 91zm906 724l271 272l-90 90l-272-271l91-91zm0-724l-91-91l272-271l90 90l-271 272zm-906 724l91 91l-272 271l-90-90l271-272z" />
        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12.058 20q-3.334 0-5.667-2.333Q4.058 15.333 4.058 12q0-3.038 1.98-5.27Q8.02 4.5 10.942 4.097q.081 0 .159.006t.153.017q-.506.706-.801 1.57q-.295.865-.295 1.811q0 2.667 1.866 4.533q1.867 1.867 4.534 1.867q.952 0 1.813-.295q.862-.295 1.548-.801q.012.075.018.153q.005.078.005.158q-.384 2.923-2.615 4.904T12.057 20Zm0-1q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.158 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5.058 12q0 2.9 2.05 4.95t4.95 2.05Zm-.25-6.75Z" />
        </svg>}
      </button>

    </div>


  );
};

export default Header;