import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                dark: {
                    "bg-primary": "#1a1a1a",
                    "bg-secondary": "#2d2d2d",
                    "text-primary": "#ffffff",
                    "text-secondary": "#a0a0a0",
                },
            },
            animation: {
                'fadeIn': 'fadeIn 0.3s ease-in-out',
                'scale-102': 'scale-102 0.3s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'scale-102': {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.02)' },
                },
            },
            scale: {
                '102': '1.02',
            },
        },
    },

    plugins: [forms],
};
