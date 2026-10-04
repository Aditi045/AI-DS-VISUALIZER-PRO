import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkedListVisualizerProps {
  items: any[];
}

const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ items }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 relative overflow-x-auto">
      <div className="flex items-center bg-gray-900/50 backdrop-blur p-8 rounded-xl border border-gray-700 min-w-max">
        <div className="text-gray-400 font-bold mr-4">HEAD</div>
        <AnimatePresence>
          {items.map((item, index) => (
            <React.Fragment key={`${item}-${index}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-16 h-16 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full shadow-lg flex items-center justify-center text-lg border-2 border-purple-400"
              >
                {item}
              </motion.div>
              {index < items.length - 1 && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 40, opacity: 1 }}
                  className="h-1 bg-purple-400 mx-2 flex items-center"
                >
                  <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-purple-400 ml-auto transform translate-x-1" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
          {items.length > 0 && (
            <React.Fragment>
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 40, opacity: 1 }}
                  className="h-1 bg-gray-500 mx-2 flex items-center"
                >
                  <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-500 ml-auto transform translate-x-1" />
                </motion.div>
                <div className="text-gray-500 font-bold ml-2">NULL</div>
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
