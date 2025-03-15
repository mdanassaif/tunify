import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-white w-[85%] max-w-md p-6 rounded-xl shadow-xl overflow-y-auto relative"
      >
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-extrabold text-[#2dd4bf]">About Tunify</h2>
          <button
            onClick={onClose}
            className="text-[#2dd4bf] hover:text-[#0f766e] focus:outline-none"
            aria-label="Close Modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              className="transition-transform transform hover:rotate-90"
            >
              <path
                fill="currentColor"
                d="m12 12.708l3.246 3.246q.14.14.344.15q.204.01.364-.15t.16-.354q0-.194-.16-.354L12.708 12l3.246-3.246q.14-.14.15-.344q.01-.204-.15-.364t-.354-.16q-.194 0-.354.16L12 11.292L8.754 8.046q-.14-.14-.344-.15q-.204-.01-.364.15t-.16.354q0 .194.16.354L11.292 12l-3.246 3.246q-.14.14-.15.344q-.01.204.15.364t.354.16q.194 0 .354-.16L12 12.708ZM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924q-1.216-1.214-1.925-2.856Q3 13.87 3 12.003q0-1.866.708-3.51q.709-1.643 1.924-2.859q1.214-1.216 2.856-1.925Q10.13 3 11.997 3q1.866 0 3.51.708q1.643.709 2.859 1.924q1.216 1.214 1.925 2.856Q21 10.13 21 11.997q0 1.866-.708 3.51q-.709 1.643-1.924 2.859q-1.214 1.216-2.856 1.925Q13.87 21 12.003 21Z"
              />
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div className="text-sm text-gray-700">
          <div className="w-full">
            <div className="w-full mb-5">
              <Image
                src="/musiclover.png"
                width={30}
                height={30}
                alt="App Image"
                layout="responsive"
                className="w-full h-full rounded-lg shadow-md"
              />
            </div>
          </div>
          <b className='uppercase font-extrabold'>
            Welcome to Tunify Music Player
          </b>
          <p className="mt-4">
            <strong>You can:</strong>
          </p>
          <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
            <li>Listen to Popular Songs</li>
            <li>Shuffle & Repeat songs</li>
            <li>Enjoy Background Animations</li>
            <li>Search Songs</li>
            <li>Switch between Light/Dark Themes</li>
            <li>Can Upload own Favorite Songs easily</li>
          </ul>

          <p className="mt-6 border-t pt-4 text-center text-gray-500">
          Need icons? Explore  {''}
            <a
              href="https://freesvgicons.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 underline hover:text-green-700"
            >
              Free SVG Icons
            </a>
            
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;