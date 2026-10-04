import { motion, AnimatePresence } from 'framer-motion';

interface QueueVisualizerProps {
  items: any[];
}

const QueueVisualizer: React.FC<QueueVisualizerProps> = ({ items }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 relative">
      <div className="flex border-t-4 border-b-4 border-green-500 w-full max-w-3xl h-32 p-4 items-center overflow-x-hidden bg-gray-900/50 backdrop-blur">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="min-w-20 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 mx-2 rounded shadow-lg flex items-center justify-center text-lg border border-green-400"
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-8 flex justify-between w-full max-w-3xl text-gray-400 font-mono">
        <div>Front (Dequeue here)</div>
        <div>Rear (Enqueue here)</div>
      </div>
      <div className="mt-4 text-gray-400 font-mono">
        Size: {items.length}
      </div>
    </div>
  );
};

export default QueueVisualizer;
