import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Loader,
  Menu,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { theme } from '../config/theme';
import { api } from '~/utils/api';
import {
  IconDotsVertical,
  IconFileDownload,
  IconMessage,
  IconTrash,
} from '@tabler/icons-react';

type Props = {
  onStartNewChat: () => void;
};

export const Sidebar = ({ onStartNewChat }: Props) => {
  const { colors, white, black } = theme;
  const [noPreviousChats, setNoPreviousChats] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Use useQuery to fetch the list of chats
  const { data: chatsData, error: chatsError } = api.chat.getAll.useQuery();

  useEffect(() => {
    if (chatsError) {
      console.error('Error fetching chats:', chatsError);
      setNoPreviousChats(true);
      setErrorMessage('Error fetching data from server.');
    }
  }, [chatsError]);

  // If there are no previous chats, display a message
  useEffect(() => {
    const timer = setTimeout(() => {
      setNoPreviousChats(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [chatsData]);

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
        backgroundColor: colors?.darkPink?.[9],
      }}
    >
      <Box h={100}>
        <Button
          onClick={onStartNewChat}
          mt='xl'
          mb='sm'
          sx={{ backgroundColor: colors?.darkPink?.[6] }}
        >
          Start New Chat
        </Button>
      </Box>

      <Box ml='md' mr='md' w='90%'>
        <Title order={3} c={white}>
          Previous Chats
        </Title>
        <Divider my='sm' color={white} />
      </Box>
      <ScrollArea h='95vh' ml='md' mr='md' p={0}>
        {errorMessage && (
          <Flex
            justify='flex-start'
            align='center'
            direction='column'
            mt='sm'
            p='xs'
            sx={{
              backgroundColor: '#E5E5E5',
              borderRadius: '10px',
            }}
          >
            <Text fz={14} fw={500} c={black}>
              {errorMessage}
            </Text>
          </Flex>
        )}

        {chatsData &&
          chatsData.map((chat: any) => (
            <Flex
              key={chat.id}
              align='center'
              justify='space-between'
              ml='md'
              mr='md'
              mb='sm'
              pl={8}
              pr={2}
              sx={{
                backgroundColor: 'rgba(229,229,229,0.9)',
                borderRadius: '10px',
                width: '225px',
              }}
            >
              <Text truncate='end' fz={14} fw={700} c={black} tt={'capitalize'}>
                {chat.title}
              </Text>
              <Menu position='bottom' shadow='lg' withArrow>
                <Menu.Target>
                  <Button
                    p={0}
                    m={0}
                    w='fit-content'
                    sx={{
                      color: colors?.darkPink?.[6],
                      backgroundColor: 'transparent',
                      '&:hover': {
                        color: colors?.pink?.[3],
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <IconDotsVertical
                      style={{ width: '20px', height: '20px' }}
                    />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown sx={{ width: '200px' }}>
                  <Menu.Label>
                    <Text truncate='end' fw={700} tt={'capitalize'}>
                      {chat.description}
                    </Text>
                  </Menu.Label>
                  <Menu.Divider />
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
          ))}

        {!chatsData &&
          (noPreviousChats ? (
            <Flex
              justify='flex-start'
              align='center'
              direction='column'
              mt='sm'
              p='xs'
              sx={{
                backgroundColor: '#E5E5E5',
                borderRadius: '10px',
              }}
            >
              <Text fz={14} fw={700} c={black}>
                No chat history found.
              </Text>
            </Flex>
          ) : (
            <Flex
              justify='center'
              align='center'
              mt='sm'
              sx={{ height: '100%' }}
            >
              <Loader color={white} size='lg' />
            </Flex>
          ))}
      </ScrollArea>
    </Flex>
  );
};
