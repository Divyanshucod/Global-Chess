/** @type {import('tailwindcss').config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'custom-bg':'#262728'
      },
      screens:{
         'md1':'1000px',
         'md2':'950px',
        'ssm':'380px',
      }
    },
  },
  plugins: [],
}

