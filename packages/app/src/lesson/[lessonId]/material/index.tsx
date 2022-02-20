/* eslint-disable react/jsx-one-expression-per-line */
import {
  Button,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { SvgIcon } from "app/core/components";
import { FileModel } from "app/generated/api/react-query";
import _ from "lodash";
import React from "react";

interface MaterialProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  materials: FileModel[];
}

export const Material = ({ materials }: MaterialProps) => {
  const getName = (name: string) => {
    if (name.length <= 7) return name;
    return `${name.slice(0, -4).slice(0, 7)}...${name.slice(-3)}`;
  };
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (_.isEmpty(materials)) return <></>;
  if (materials.length <= 2) {
    return (
      <>
        {materials.map((material) => (
          <Button
            key={material.id}
            color="blue.500"
            variant="unstyled"
            h="fit-content"
          >
            <Link href={material.url}>
              <HStack spacing={1}>
                <SvgIcon name="icon/download" boxSize={6} />
                <Text variant="body-2">{material.fileName}</Text>
              </HStack>
            </Link>
          </Button>
        ))}
      </>
    );
  }
  return (
    <Menu isLazy>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Button}
            size="sm"
            variant="unstyled"
            color="blue.500"
          >
            <HStack spacing={0}>
              <Text>강의자료 {materials.length}개</Text>
              <SvgIcon
                name="icon/chevron_up"
                boxSize="20px"
                transform={`rotate(${isOpen ? "0" : "180"}deg)`}
              />
            </HStack>
          </MenuButton>
          <MenuList
            p={1}
            border="none"
            shadow="2xl"
            minW={0}
            maxH={44}
            overflow="scroll"
            sx={{
              "&::-webkit-scrollbar-track": {
                bg: "transparent",
              },
              "&::-webkit-scrollbar": {
                height: "8px",
                width: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                bg: "blackAlpha.200",
                borderRadius: "20px",
              },
            }}
          >
            {materials.map((material) => (
              <MenuItem
                borderRadius={6}
                key={material.id}
                _hover={{ color: "blue.500", bg: "none" }}
              >
                <Link href={material.url}>
                  <HStack spacing={1}>
                    <SvgIcon name="icon/download" boxSize={6} />
                    <Text variant="body-1" maxW="120px">
                      {getName(material.fileName)}
                    </Text>
                  </HStack>
                </Link>
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};
