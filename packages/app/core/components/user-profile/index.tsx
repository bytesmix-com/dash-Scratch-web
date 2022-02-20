import {
  Avatar,
  AvatarProps,
  HStack,
  Stack,
  StackProps,
  Text,
  TextProps,
} from "@chakra-ui/react";
import React from "react";

// TODO: user model
interface UserProfileProps extends StackProps {
  email: string;
  nickname?: string;
  avatarProps?: AvatarProps;
  nicknameProps?: TextProps;
  emailProps?: TextProps;
}

const UserProfile = ({
  email,
  nickname,
  avatarProps,
  nicknameProps,
  emailProps,
  ...props
}: UserProfileProps) => (
  <HStack minW={0} {...props}>
    <Avatar
      boxSize={8}
      name={email}
      getInitials={(name) => name.substring(0, 2)}
      sx={{
        ".chakra-avatar__initials": { fontSize: "sm" },
      }}
      {...avatarProps}
    />
    <Stack spacing={0} minW={0}>
      <Text fontWeight="medium" fontSize="sm" isTruncated {...nicknameProps}>
        {nickname}
      </Text>
      <Text fontWeight="regular" fontSize="xs" isTruncated {...emailProps}>
        {email}
      </Text>
    </Stack>
  </HStack>
);

export default UserProfile;
