import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Header as MantineHeader,
  Accordion,
  Box,
  Divider,
  Drawer,
  Group,
  Flex,
  Loader,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SignedIn, UserButton } from '@clerk/nextjs';
import {
  IconHistory,
  IconFileDownload,
  IconMenu2,
  IconMessage,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import PinkLogo from '../../../public/logo/logo-pink-dark.png';
import logoIcon from '../../../public/icon/heart-pink.png';
import { ReactNode } from 'react';
import { theme } from '~/config/theme';
import { api } from '~/utils/api';

type HeaderProps = {
  children?: ReactNode;
  onStartNewChat: () => void;
  onRevisitChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
};

export const HeaderMobile: React.FC<HeaderProps> = ({
  children,
  onStartNewChat,
  onRevisitChat,
  onDeleteChat,
}) => {
  const { white, black, colors } = theme;
  const [opened, { open, close }] = useDisclosure(false);
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

  const handleRevisitChat = (chatId: string) => {
    // Call the function passed from the parent component
    onRevisitChat(chatId);
  };

  return (
    <MantineHeader height={80}>
      <Flex m='md' direction='row' align='center' justify='space-between'>
        <Image
          src={PinkLogo}
          alt='Your Health Ally Logo'
          width={96}
          height={54}
        />
        {/* DRAWER OPEN */}
        <Drawer
          opened={opened}
          onClose={close}
          position='left'
          size='100%'
          title={
            <Image
              src={logoIcon}
              alt='Your Health Ally Logo'
              style={{ width: '100px', height: '100px' }}
            />
          }
          sx={{
            root: {
              backgroundColor: white,
              margin: '0',
              padding: '0',
            },
            // HEADER + CLOSE BUTTON STYLES
            '& .mantine-Drawer-header': {
              margin: '10px 20px 10px 15px',
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
            },

            '& .mantine-Drawer-close svg': {
              color: black,
              transform: 'scale(1.75)',
              stroke: 'currentColor',
              strokeWidth: '1',
            },
            '& .mantine-Drawer-close': {
              outline: 'none',
              border: 'none',
              backgroundColor: white,
            },
            ['& .mantine-Drawer-close:hover']: {
              backgroundColor: white,
            },
            ['& .mantine-Drawer-close:active']: {
              backgroundColor: white,
            },
            ['& .mantine-Drawer-close svg:focus']: {
              outline: 'none',
              border: 'none',
              backgroundColor: white,
            },
          }}
        >
          <Box>
            <Group position='apart' p={10}>
              <Title order={3}>Account</Title>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </Group>

            <Divider my='sm' color={black} sx={{ opacity: '.25' }} />
          </Box>

          <Box>
            <UnstyledButton
              onClick={onStartNewChat}
              sx={{
                width: '100%',
                padding: '10px',
                cursor: 'pointer',
                '&:active': { backgroundColor: '#E5E5E5', borderRadius: '5px' },
              }}
            >
              <Group position='apart' w='100%'>
                <Title order={3} color={black}>
                  Start New Chat
                </Title>
                <IconPlus
                  stroke={1.5}
                  style={{ height: '30px', width: '30px' }}
                />
              </Group>
            </UnstyledButton>

            <Divider my='sm' color={black} sx={{ opacity: '.25' }} />
          </Box>

          <Box>
            <Group position='apart' p={10}>
              <Title order={3}>Previous Chats</Title>
              <IconHistory
                stroke={1.5}
                style={{ height: '30px', width: '30px' }}
              />
            </Group>
          </Box>

          {errorMessage && (
            <Box pt={10} pb={10} ml='lg' mr='lg'>
              <Title order={4} color={colors?.red?.[6]}>
                {errorMessage}
              </Title>
            </Box>
          )}

          {chatsData &&
            chatsData.map((chat: any) => (
              <Accordion key={chat.id}>
                <Accordion.Item
                  value={`${chat.description}` || 'Chat description is missing'}
                >
                  <Accordion.Control>
                    <Text truncate='end' fw={700} c={black} tt={'capitalize'}>
                      {chat.description}
                    </Text>
                  </Accordion.Control>

                  <Accordion.Panel sx={{ textIndent: 'none', padding: '0px' }}>
                    {/* SAVE TO PDF */}
                    <UnstyledButton
                      sx={{
                        color: black,
                        cursor: 'pointer',
                        padding: '5px',
                        margin: '2px',
                        '&:active': {
                          backgroundColor: '#E5E5E5',
                          borderRadius: '5px',
                        },
                      }}
                    >
                      <Group spacing={2} align='center' position='center'>
                        <IconFileDownload
                          style={{ width: '16px', height: '16px' }}
                        />
                        <Text fz={16}>Save to PDF</Text>
                      </Group>
                    </UnstyledButton>

                    {/* REVISIT */}
                    <UnstyledButton
                      onClick={() => handleRevisitChat(chat.id)}
                      sx={{
                        color: black,
                        cursor: 'pointer',
                        padding: '5px',
                        margin: '2px',
                        '&:active': {
                          backgroundColor: '#E5E5E5',
                          borderRadius: '5px',
                        },
                      }}
                    >
                      <Group spacing={2} align='center' position='center'>
                        <IconMessage
                          style={{ width: '16px', height: '16px' }}
                        />
                        <Text fz={16}>Revisit Chat</Text>
                      </Group>
                    </UnstyledButton>

                    {/* DELETE */}
                    <UnstyledButton
                      sx={{
                        color: black,
                        cursor: 'pointer',
                        padding: '5px',
                        margin: '2px',
                        '&:active': {
                          backgroundColor: '#E5E5E5',
                          borderRadius: '5px',
                        },
                      }}
                      onClick={() => onDeleteChat(chat.id)}
                    >
                      <Group spacing={2} align='center' position='center'>
                        <IconTrash
                          style={{
                            width: '16px',
                            height: '16px',
                          }}
                        />
                        <Text fz={16}>Delete Chat</Text>
                      </Group>
                    </UnstyledButton>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            ))}

          {!chatsData &&
            (noPreviousChats ? (
              <Box pt={10} pb={10} ml='lg' mr='lg'>
                <Title order={4} color='rgba( 26, 25, 16, .75)'>
                  No chat history found.
                </Title>
              </Box>
            ) : (
              <Flex justify='center' align='center' mt={10}>
                <Loader color={black} size='md' />
              </Flex>
            ))}
        </Drawer>

        {/* DRAWER CLOSED - DEFAULT */}
        <Group align='center' position='left'>
          <IconMenu2
            stroke={2.5}
            size='30px'
            onClick={open}
            style={{ color: black }}
            aria-label='Sidebar Menu'
          />
        </Group>
      </Flex>
    </MantineHeader>
  );
};
