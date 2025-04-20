import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function ColorUploader({ onUpload, isLoading }) {
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match("image.*")) {
      onUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      }}
    >
      <motion.label
        className={`px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow border border-gray-200 inline-block ${
          isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        whileHover={
          !isLoading
            ? {
                scale: 1.05,
                backgroundColor: "#f3f4f6", // light gray hover color
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }
            : {}
        }
        whileTap={!isLoading ? { scale: 0.95 } : {}}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        transition={{ duration: 0.2 }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
        />
        <motion.div
          className="flex items-center justify-center"
          animate={{
            gap: isHovering && !isLoading ? "8px" : "4px",
          }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-image"
            animate={{
              rotate: isHovering && !isLoading ? 10 : 0,
              scale: isHovering && !isLoading ? 1.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </motion.svg>
          <span>{isLoading ? "Processing..." : "Extract from Image"}</span>
        </motion.div>
      </motion.label>
    </motion.div>
  );
}
