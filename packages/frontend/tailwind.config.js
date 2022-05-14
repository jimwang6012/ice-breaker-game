module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "ice-0": "#DDEEF8",
        "ice-2": "#9EBFE0",
        "ice-3": "#5C83A0",
        "ice-5": "#0478A1",
        "ice-6": "#003853",
        "ice-7": "#041F32",
        "ice-8": "#768EAA",
      },
      margin: {
        "128px": "128px",
      },
      backgroundImage: {
        "water-background": "url('../public/water.gif')",
        "ice-full": "url('../public/ice0.png')",
        "ice-broken": "url('../public/ice9.png')",
      },
    },
  },
  plugins: [],
};
