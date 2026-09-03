import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "node_modules/**", "design_handoff_cachewraith_portfolio/**"] },
  ...next,
];

export default config;
