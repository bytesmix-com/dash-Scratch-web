import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalContentProps,
  ModalHeader,
  ModalOverlay,
  Text,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { SvgIcon } from "app/core/components";
import React, { ReactNode } from "react";

interface Props extends ModalContentProps {
  useDisclosureReturn: UseDisclosureReturn;
  title: string;
  children: ReactNode | ReactNode[];
}

export const ModalLayout = ({
  useDisclosureReturn,
  title,
  children,
  ...rest
}: Props) => {
  const { isOpen, onClose } = useDisclosureReturn;
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent overflow="clip" w="360px" {...rest}>
        <ModalHeader bg="neutral.50" h={20} py="11px" px="16px">
          <HStack justify="space-between">
            <Text variant="body-4" color="neutral.700">
              {title}
            </Text>
            <Button
              size="xs"
              p={0}
              boxSize="24px"
              variant="unstyled"
              bg="white"
              shadow="lg"
              onClick={onClose}
            >
              <SvgIcon boxSize="full" name="icon/close" />
            </Button>
          </HStack>
        </ModalHeader>

        <ModalBody p={0}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
