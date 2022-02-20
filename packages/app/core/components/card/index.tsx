import { Box, BoxProps, useStyleConfig } from "@chakra-ui/react";
import React from "react";

export interface CardProps extends BoxProps {
  variant?: string;
}

const Card = ({ variant, children, ...rest }: CardProps) => {
  const styles = useStyleConfig("Card", { variant });
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
};

export default Card;
