/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                xs: '300px',
            },
            colors: {
                primary: {
                    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
                    50: 'rgb(var(--color-primary) / 0.05)',
                    100: 'rgb(var(--color-primary) / 0.1)',
                    500: 'rgb(var(--color-primary) / 1)',
                    700: 'rgb(var(--color-primary) / 0.8)',
                },
                secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
                accent: 'rgb(var(--color-accent) / <alpha-value>)',
            },
        },
    },
    plugins: [],
}