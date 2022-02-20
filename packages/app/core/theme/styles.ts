export const styles = {
  global: {
    "html, body, #root": {
      height: "full",
    },
    "*:focus": {
      // disable chakra-ui blue outline
      boxShadow: "none !important",
    },
    "*": {
      letterSpacing: "-0.02em",
    },
    ".chakra-form__required-indicator": {
      color: "#1060FC !important",
    },
  },
};
