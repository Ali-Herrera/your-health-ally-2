import { Box, Stack, Group, Avatar, Skeleton, Text, List } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { type Author } from '~/utils/types';
// import { UserChat } from "./User";
// import { AIChat } from "./AI";
import { UserButton } from '@clerk/nextjs';
import { theme } from '~/config/theme';
import { useState, useEffect, useRef } from 'react';

export type ChatItem = {
  author: Author;
  content?: string;
  isError?: boolean;
};

export type Props = {
  chatItems: ChatItem[];
  // onReset: () => void;
  loading: boolean;
};

export const ChatContent = ({ chatItems, loading }: Props) => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const { black } = theme;

  // State to track if any user messages exist
  const [userMessageExists, setUserMessageExists] = useState(false);

  // Check if any user messages exist
  const checkUserMessages = () => {
    const exists = chatItems.some(
      (item) => item.author === 'User' && item.content
    );
    setUserMessageExists(exists);
  };

  // Ref for scrolling to bottom
  const endOfChatRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of chat
  const scrollToBottom = () => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Call the function to check user messages when component mounts or chat items change
  useEffect(() => {
    checkUserMessages();
    scrollToBottom();
  }, [chatItems]);

  return (
    <Box
      ml={mobileScreen ? '0' : '250px'}
      h='65vh'
      sx={{ overflowY: 'scroll', maxWidth: '100%' }}
    >
      <Stack spacing='md'>
        {/* Render initial prompt only if no user messages exist */}
        {!userMessageExists && (
          <Group p='xl' sx={{ backgroundColor: '#E5E5E5' }}>
            <Avatar size={32} alt='ChatGBT' variant='gradient' mb='sm'>
              AI
            </Avatar>
            <Text c={black}>
              I am an intelligent advisor that can provide information regarding
              people's health. I answer questions about health-related
              conditions and symptoms, and how to prepare for doctors
              appointments. This is for educational purposes only. Please see
              your healthcare provider for medical treatment.
            </Text>
          </Group>
        )}

        {/* Display skeleton loading animation if loading */}
        {loading && (
          <Group p='xl'>
            <Skeleton height={32} circle />
            <Skeleton height={8} radius='xl' />
            <Skeleton height={8} radius='xl' width='70%' />
          </Group>
        )}

        {/* Render chat items */}
        {chatItems.map((chatItem: ChatItem, index: number) => (
          <Box key={index}>
            {chatItem.author === 'User' ? (
              <Group p='xl' sx={{ backgroundColor: '#E5E5E5' }}>
                <UserButton />
                {chatItem.content?.includes('\n') ? (
                  <Text
                    component='pre'
                    sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                  >
                    {chatItem.content}
                  </Text>
                ) : chatItem.content?.startsWith('- ') ? (
                  <List>
                    {chatItem.content.split('\n').map((item, idx) => (
                      <List.Item key={idx}>{item}</List.Item>
                    ))}
                  </List>
                ) : (
                  <Text>{chatItem.content}</Text>
                )}
              </Group>
            ) : (
              <Group p='xl'>
                <Avatar size={32} alt='ChatGBT' variant='gradient' mb='sm'>
                  AI
                </Avatar>
                {/* <Text c={black}>{chatItem.content}</Text> */}
                {chatItem.content?.includes('\n') ? (
                  <Text
                    component='pre'
                    sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                  >
                    {chatItem.content}
                  </Text>
                ) : chatItem.content?.startsWith('- ') ? (
                  <List>
                    {chatItem.content.split('\n').map((item, idx) => (
                      <List.Item key={idx}>{item}</List.Item>
                    ))}
                  </List>
                ) : (
                  <Text>{chatItem.content}</Text>
                )}
              </Group>
            )}
          </Box>
        ))}

        {/* Empty div to scroll to when necessary */}
        <div ref={endOfChatRef} />
      </Stack>
    </Box>
  );
};
