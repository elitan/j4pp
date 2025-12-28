/** @type {import('prettier').Config} */
const config = {
  overrides: [
    {
      files: ['*.sql'],
      options: {
        parser: 'sql',
        plugins: ['prettier-plugin-sql'],
        language: 'postgresql',
        keywordCase: 'lower',
        dataTypeCase: 'lower',
        functionCase: 'lower',
        identifierCase: 'lower',
      },
    },
  ],
};

export default config;
