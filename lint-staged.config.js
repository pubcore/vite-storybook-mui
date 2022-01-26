module.exports = {
  "*.{ts,tsx}": [() => "tsc --noEmit -p tsconfig.json", "eslint --cache --fix"],
  "**/*": "prettier --write  \n--ignore-unknown",
};
