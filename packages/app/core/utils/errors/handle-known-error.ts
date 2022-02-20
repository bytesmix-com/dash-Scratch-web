import { createStandaloneToast } from "@chakra-ui/react";
import theme from "app/core/theme";

export const handleKnownError = (code: string): boolean => {
  const toast = createStandaloneToast({ theme });
  if (code === "BAD_USER_INPUT") {
    toast({
      title: "Bad input!",
      description: "Please try again.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return true;
  }

  if (code === "FORBIDDEN") {
    window.location.href = "/login";
    return true;
  }

  return false;
};

export default handleKnownError;
