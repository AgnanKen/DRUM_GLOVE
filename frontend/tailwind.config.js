/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#15171c",
          panel: "#1d1f26",
          panelHover: "#23262f",
          border: "#2b2e37",
          borderLight: "#3d4250",
          cyan: "#35c3ff",
          green: "#7af0c4",
          amber: "#ffb46b",
          red: "#ff5370",
          purple: "#c792ea",
          textMuted: "#8e95a5",
          textBright: "#e6e8ee"
        }
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "Courier New", "monospace"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        glowCyan: "0 0 15px -3px rgba(53, 195, 255, 0.4)",
        glowGreen: "0 0 15px -3px rgba(122, 240, 196, 0.4)",
        glowAmber: "0 0 20px -2px rgba(255, 180, 107, 0.6)",
      }
    },
  },
  plugins: [],
}
