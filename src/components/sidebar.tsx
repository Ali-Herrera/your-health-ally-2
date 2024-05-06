import { Box, Button, Flex, Space } from '@mantine/core';
import { theme } from '../config/theme';
import { useState, useEffect } from 'react';
import { chatRouter } from '~/server/api/routers/chats/create-chat';
import { api } from '~/utils/api';
import { Text } from '@mantine/core';

type Props = {
  onStartNewChat: () => void;
};

export const Sidebar = ({ onStartNewChat }: Props) => {
  const { colors } = theme;
  // Use useQuery to fetch the list of chats
  const { data: chatsData, error: chatsError } = api.chat.getAll.useQuery();

  useEffect(() => {
    if (chatsError) {
      console.error('Error fetching chats:', chatsError);
    }
  }, [chatsError]);

  return (
    <Flex
      justify='flex-start'
      align='center'
      direction='column'
      sx={{
        margin: '0',
        padding: '10px',
        position: 'fixed',
        width: '250px',
        height: '100%',
        zIndex: 20,
        top: '0',
        left: '0',
        overflowX: 'hidden',
        backgroundColor: colors?.darkPink?.[6],
      }}
    >
      <Space h='lg' />
      <Box h={100} sx={{ borderBottom: colors?.darkPink?.[9] }}>
        {/* Add the onStartNewChat prop to the Button component */}
        <Button onClick={onStartNewChat}>Start New Chat</Button>
      </Box>
      {/* Display the list of chats */}
      <Box mt={20}>
        <Text variant='h4'>Chats:</Text>
        {chatsData ? (
          <ul>
            {chatsData.map((chat: any) => (
              <li key={chat.id}>
                <Text>{chat.title}</Text>
                <Text>{chat.description}</Text>
              </li>
            ))}
          </ul>
        ) : (
          <Text>Loading...</Text>
        )}
      </Box>
    </Flex>
  );
};
