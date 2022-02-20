export const Button = {
  variants: {
    primary: {
      bg: "blue.500",
      color: "white",
      borderWidth: "1px",
      borderColor: "blue.500",
      _hover: {
        bg: "blue.600",
      },
      _active: {
        boxShadow: "0 0 0 2px #FFFFFF, 0 0 0 4px #1060FC !important",
      },
    },
    "primary-line": {
      bg: "white",
      color: "blue.500",
      borderWidth: "1px",
      borderColor: "blue.500",
      _hover: {
        bg: "blue.50",
        color: "blue.600",
        borderWidth: "1px",
        borderColor: "blue.600",
      },
      _active: {
        bg: "white",
        boxShadow: "0 0 0 2px #FFFFFF, 0 0 0 4px #1060FC !important",
      },
    },
  },
};
