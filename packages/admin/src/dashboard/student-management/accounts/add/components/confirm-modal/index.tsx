import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import React from "react";

interface ConfirmModalProps extends UseDisclosureReturn {
  studentCount: number;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  studentCount,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>학생관리</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text variant="heading-3" textAlign="center">
            {`총 ${studentCount}명의 학생이`}
          </Text>
          <Text variant="heading-3" textAlign="center">
            추가되었습니다.
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center" pb={9}>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            돌아가기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
