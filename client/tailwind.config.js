/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    ],
    darkMode: '',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: colors.green,
                secondary: colors.lime,
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        function ({ addVariant }) {
            addVariant('child', '& > *')
            addVariant('child-hover', '& > *:hover')
        }
    ],
}

