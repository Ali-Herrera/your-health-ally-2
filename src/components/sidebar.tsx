import {
  Box,
  Button,
  Flex,
  Loader,
  Space,
  Title,
  Paper,
  Menu,
  Stack,
  Tooltip,
} from '@mantine/core';
import { theme } from '../config/theme';
import { useState, useEffect } from 'react';
import { chatRouter } from '~/server/api/routers/chats/create-chat';
import { api } from '~/utils/api';
import { Text } from '@mantine/core';
import {
  IconTrash,
  IconFileDownload,
  IconMessage,
  IconDotsVertical,
} from '@tabler/icons-react';

type Props = {
  onStartNewChat: () => void;
};

export const Sidebar = ({ onStartNewChat }: Props) => {
  const { colors, white } = theme;
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
      <Box
        sx={{
          // backgroundColor: white,
          width: '100%',
        }}
      >
        <Title order={3} ta='center' c={white}>
          Previous Chats
        </Title>

        {chatsData ? (
          chatsData.map((chat: any) => (
            //    {chat.slug}
            <Flex
              key={chat.id}
              align='center'
              justify='center'
              sx={{ padding: '5px' }}
            >
              <Text truncate='end' fz={14} fw={500} c={white} mr={10}>
                {chat.title}
              </Text>
              <Menu
                position='left-start'
                offset={-1}
                withArrow
                arrowOffset={15}
                width={200}
                shadow='lg'
                radius='lg'
              >
                <Menu.Target>
                  <Button
                    p={0}
                    m={0}
                    sx={{ color: white, backgroundColor: 'transparent' }}
                  >
                    <IconDotsVertical
                      style={{ width: '20px', height: '20px' }}
                    />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown
                  sx={{
                    transform: 'translateX(30%)',
                  }}
                >
                  <Menu.Label>Description</Menu.Label>
                  <Menu.Item>{chat.description}</Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Options</Menu.Label>
                  <Menu.Item
                    icon={
                      <IconMessage style={{ width: '16px', height: '16px' }} />
                    }
                  >
                    Revisit Chat
                  </Menu.Item>
                  <Menu.Item
                    icon={
                      <IconFileDownload
                        style={{ width: '16px', height: '16px' }}
                      />
                    }
                  >
                    Save Chat to PDF
                  </Menu.Item>
                  <Menu.Item
                    icon={
                      <IconTrash style={{ width: '16px', height: '16px' }} />
                    }
                  >
                    Delete Chat
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          ))
        ) : (
          <Flex
            justify='flex-start'
            align='center'
            direction='column'
            m={10}
            sx={{
              width: '100%',
            }}
          >
            <Loader color={white} />
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
