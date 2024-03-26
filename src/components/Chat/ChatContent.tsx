import { Box, Stack, Group, Avatar, Skeleton, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { type Author } from '~/utils/types';
// import { UserChat } from "./User";
// import { AIChat } from "./AI";
import { UserButton } from '@clerk/nextjs';
import { theme } from '~/config/theme';

export type ChatItem = {
  author: Author;
  content?: string;
  isError?: boolean;
};

export type Props = {
  chatItems: ChatItem[];
  onReset: () => void;
  loading: boolean;
};

export const ChatContent = ({ chatItems, onReset, loading }: Props) => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const { black } = theme;

  // Check if any user messages exist
  const userMessageExists = chatItems.some(
    (item) => item.author === 'User' && item.content
  );

  return (
    <Box ml={mobileScreen ? '0' : '250px'} h='65vh' sx={{ overflow: 'scroll' }}>
      <Stack spacing='md'>
        {loading ? (
          <>
            {chatItems.map((chatItem: ChatItem, index: number) => (
              <Box key={index}>
                {chatItem.author === 'User' ? (
                  <Group p='xl' sx={{ backgroundColor: '#E5E5E5' }}>
                    <UserButton />
                    <Text c='dimmed'>{chatItem.content}</Text>
                  </Group>
                ) : (
                  <Group p='xl'>
                    <Avatar size={32} alt='ChatGBT' variant='gradient' mb='sm'>
                      AI
                    </Avatar>
                    <Text c={black}>{chatItem.content}</Text>
                  </Group>
                )}
              </Box>
            ))}
            <Group p='xl'>
              <Skeleton height={32} circle />
              <Skeleton height={8} radius='xl' />
              <Skeleton height={8} radius='xl' width='70%' />
            </Group>
          </>
        ) : (
          chatItems.map((chatItem: ChatItem, index: number) => (
            <Box key={index}>
              {chatItem.author === 'User' ? (
                <Group p='xl' sx={{ backgroundColor: '#E5E5E5' }}>
                  <UserButton />
                  <Text c='dimmed'>{chatItem.content}</Text>
                </Group>
              ) : (
                <Group p='xl'>
                  <Avatar size={32} alt='ChatGBT' variant='gradient' mb='sm'>
                    AI
                  </Avatar>
                  <Text c={black}>{chatItem.content}</Text>
                </Group>
              )}
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
};
