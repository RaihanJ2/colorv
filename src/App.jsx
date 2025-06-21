import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import ColorPalette from "./components/ColorPallete";
import ExportOptions from "./components/ExportOptions";
import ColorUploader from "./components/ColorUploader";
import "./index.css";

function App() {
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateRandomPalette();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateRandomPalette = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        body: JSON.stringify({
          model: "default",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch color palette");
      }

      const data = await response.json();
      setColors(
        data.result.map((rgb) => ({
          rgb: rgb,
          hex: rgbToHex(rgb[0], rgb[1], rgb[2]),
        }))
      );
    } catch (err) {
      setError("Failed to generate palette. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const handleImageUpload = async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = async (e) => {
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const pixelData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          ).data;
          const sampledColors = sampleColorsFromImage(pixelData);

          try {
            const response = await fetch(import.meta.env.VITE_API_URL, {
              method: "POST",
              body: JSON.stringify({
                model: "default",
                input: sampledColors.slice(0, 3).map((c) => [c.r, c.g, c.b]),
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to fetch color palette");
            }

            const data = await response.json();
            setColors(
              data.result.map((rgb) => ({
                rgb: rgb,
                hex: rgbToHex(rgb[0], rgb[1], rgb[2]),
              }))
            );
          } catch (err) {
            setError(
              "Failed to generate palette from image. Please try again."
            );
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const sampleColorsFromImage = (pixelData) => {
    const colorMap = {};

    for (let i = 0; i < pixelData.length; i += 4 * 50) {
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];

      const colorKey = `${Math.round(r / 10)},${Math.round(
        g / 10
      )},${Math.round(b / 10)}`;

      if (!colorMap[colorKey]) {
        colorMap[colorKey] = { r, g, b, count: 0 };
      }
      colorMap[colorKey].count++;
    }

    return Object.values(colorMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
            }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{
              duration: 0.5,
              ease: [0.6, -0.05, 0.01, 0.99],
              opacity: { duration: 0.4 },
            }}
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 15px rgba(255,255,255,.9)",
            }}
            className="cursor-default codystar-regular text-9xl font-bold text-gray-100 mb-2"
          >
            ColorV
          </motion.div>
          <motion.p
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{
              duration: 0.5,
              ease: [0.6, -0.05, 0.01, 0.99],
              opacity: { duration: 0.4 },
            }}
            className="text-gray-400 text-xl"
          >
            Generate harmonious color schemes for your next project
          </motion.p>
        </header>

        <main>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              className={`px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={generateRandomPalette}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate New Palette"}
            </button>

            <ColorUploader onUpload={handleImageUpload} isLoading={isLoading} />
          </div>

          {error && (
            <div className="text-red-500 text-center mb-6">{error}</div>
          )}

          <ColorPalette colors={colors} />

          <ExportOptions colors={colors} />
        </main>

        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>Built with React + Tailwind + Colormind API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
