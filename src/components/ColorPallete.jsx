import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function ColorPalette({ colors }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [colorKeys, setColorKeys] = useState([]);

  useEffect(() => {
    if (colors.length > 0) {
      setColorKeys(colors.map((_, i) => `color-${Date.now()}-${i}`));
    }
  }, [colors]);

  const copyToClipboard = (index, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {colorKeys.length > 0 &&
          colors.map((color, index) => (
            <motion.div
              key={colorKeys[index]}
              className="rounded-lg overflow-hidden shadow-md h-36 cursor-pointer"
              style={{ backgroundColor: color.hex }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0.9,
                opacity: 0,
                transition: { duration: 0.2 },
              }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
                type: "spring",
                stiffness: 120,
                damping: 10,
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              <motion.div
                className="mt-auto bg-gray-900 bg-opacity-90 p-3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.05 + 0.1,
                  duration: 0.2,
                }}
              >
                <div
                  className="font-semibold text-lg text-gray-100 cursor-pointer relative"
                  onClick={() => copyToClipboard(index, color.hex)}
                >
                  <motion.span
                    key={`hex-${color.hex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {color.hex}
                  </motion.span>

                  <AnimatePresence>
                    {copiedIndex === index && (
                      <motion.span
                        className="absolute right-0 text-xs bg-gray-800 text-white px-2 py-1 rounded"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <motion.div
                  className="text-sm text-gray-500"
                  key={`rgb-${color.rgb.join()}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  rgb({color.rgb.join(", ")})
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
      </AnimatePresence>
    </motion.div>
  );
}
