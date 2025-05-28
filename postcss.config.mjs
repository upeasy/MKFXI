const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'oklab-function': true,
      },
    },
  },
};

export default config;