import { motion, AnimatePresence } from 'framer-motion';

interface StackVisualizerProps {
  items: any[];
}

const StackVisualizer: React.FC<StackVisualizerProps> = ({ items }) => {
  return (
    <div className="flex flex-col items-center justify-end h-full w-full p-8 relative">
      <div className="border-l-4 border-r-4 border-b-4 border-blue-500 rounded-b-lg w-64 h-96 p-2 flex flex-col-reverse items-center justify-start overflow-hidden bg-gray-900/50 backdrop-blur">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              initial={{ y: -300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 mb-2 rounded shadow-lg flex items-center justify-center text-lg border border-blue-400"
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-4 text-gray-400 font-mono">
        Size: {items.length}
      </div>
    </div>
  );
};

export default StackVisualizer;
