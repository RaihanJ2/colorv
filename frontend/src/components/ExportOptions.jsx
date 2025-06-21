import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function ExportOptions({ colors }) {
  const [exportFormat, setExportFormat] = useState("css");
  const [copied, setCopied] = useState(false);

  const generateCSS = () => {
    return `:root {\n${colors
      .map((color, i) => `  --color-${i + 1}: ${color.hex};`)
      .join("\n")}\n}`;
  };

  const generateSCSS = () => {
    return `${colors
      .map((color, i) => `$color-${i + 1}: ${color.hex};`)
      .join("\n")}`;
  };

  const getFormattedCode = () => {
    switch (exportFormat) {
      case "css":
        return generateCSS();
      case "scss":
        return generateSCSS();
      default:
        return generateCSS();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFormattedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      className="bg-gray-500 p-6 rounded-lg shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.4,
        type: "spring",
        stiffness: 80,
      }}
    >
      <motion.h3
        className="text-xl font-semibold text-gray-200 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        Export Palette
      </motion.h3>

      <motion.div
        className="flex gap-6 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      >
        <motion.label
          className="flex items-center text-gray-200 gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <input
            type="radio"
            value="css"
            checked={exportFormat === "css"}
            onChange={() => setExportFormat("css")}
            className="text-blue-500"
          />
          CSS Variables
        </motion.label>

        <motion.label
          className="flex items-center text-gray-200 gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <input
            type="radio"
            value="scss"
            checked={exportFormat === "scss"}
            onChange={() => setExportFormat("scss")}
            className="text-blue-500"
          />
          SCSS Variables
        </motion.label>
      </motion.div>

      <motion.div
        className="bg-gray-900 text-gray-200 p-4 rounded-md mb-4 overflow-x-auto relative"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{
          delay: 0.8,
          duration: 0.4,
          height: { type: "spring", stiffness: 100 },
        }}
        layout
      >
        <AnimatePresence mode="wait">
          <motion.pre
            key={exportFormat}
            className="font-mono text-sm text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {getFormattedCode()}
          </motion.pre>
        </AnimatePresence>
      </motion.div>

      <motion.button
        className="px-4 py-2 bg-gray-800 border border-gray-200 text-gray-200 rounded-md transition duration-200"
        onClick={copyToClipboard}
        whileHover={{
          scale: 1.05,
          backgroundColor: "#1f2937", // darker gray on hover
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              Copied!
            </motion.span>
          ) : (
            <motion.span
              className="cursor-pointer"
              key="copy"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              Copy to Clipboard
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
