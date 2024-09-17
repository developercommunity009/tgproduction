/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {screens:{
      "sm":"320px",
      "2xl":"1400px",
      
      
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },},
  },
  plugins: [],
}

