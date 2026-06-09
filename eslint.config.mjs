import taeyoon from "eslint-config-taeyoon";

export default [
  {
    ignores: [".pnp.*", ".yarn/**", "dist/**", "node_modules/**"],
  },
  ...taeyoon,
];
