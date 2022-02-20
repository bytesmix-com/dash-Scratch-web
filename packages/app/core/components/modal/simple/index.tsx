import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalContentProps,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import React, { ComponentProps, ReactNode } from "react";

export interface ModalSimpleProps extends ModalContentProps {
  useDisclosureReturn: UseDisclosureReturn;
  header?: string;
  description?: string;
  children?: ReactNode | ReactNode[];
  buttonProps?: ComponentProps<typeof Button>;
  cancelButtonProps?: ComponentProps<typeof Button>;
}

const ModalSimple = ({
  useDisclosureReturn,
  header,
  description,
  children,
  buttonProps,
  cancelButtonProps,
  ...props
}: ModalSimpleProps) => {
  const initialRef = React.useRef<HTMLInputElement>(null);
  const { isOpen, onClose } = useDisclosureReturn;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialRef}
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius={4} {...props}>
        <ModalHeader pt={4} px={5} pb={0}>
          <Heading fontWeight="semibold" fontSize="xl">
            {header}
          </Heading>
          <Text fontWeight="medium" fontSize="sm" color="gray.200">
            {description}
          </Text>
        </ModalHeader>

        <ModalBody px={5} pt={4} pb={8}>
          {children}
        </ModalBody>
        <ModalFooter bg="gray.900" borderBottomRadius={4}>
          <Button
            size="sm"
            variant="ghost"
            mr={3}
            onClick={onClose}
            _focus={{
              boxShadow: "none",
            }}
            {...cancelButtonProps}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            bg="green.500"
            color="gray.900"
            borderRadius={4}
            {...buttonProps}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalSimple;
