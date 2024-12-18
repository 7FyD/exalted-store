module.exports = {
  root: true,
  extends: ["plugin:@next/next/recommended", "@payloadcms"],
  ignorePatterns: ["**/payload-types.ts"],
  plugins: ["prettier"],
  rules: {
    "no-console": "off",
    "linebreak-style": 0,
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
