/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ["prettier-plugin-sql", "prettier-plugin-tailwindcss"],

  // prettier options
  endOfLine: "lf",
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,

  // prettier-plugin-sql options
  formatter: "sql-formatter",
  language: "postgresql",
  keywordCase: "lower",
  dataTypeCase: "lower",
  functionCase: "lower",
  identifierCase: "lower",
};

export default config;
