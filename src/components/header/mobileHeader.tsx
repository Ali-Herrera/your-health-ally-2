import {
  Header as MantineHeader,
  Flex,
  Button,
  Drawer,
  Group,
  Space,
  Stack,
  Title,
  Loader,
  Menu,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { SignedIn, UserButton } from '@clerk/nextjs';
import {
  IconDotsVertical,
  IconFileDownload,
  IconMenu2,
  IconMessage,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import PinkLogo from '../../../public/logo/logo-pink-dark.png';
import logoIcon from '../../../public/icon/heart-pink.png';
import Image from 'next/image';
import { ReactNode } from 'react';
import { theme } from '~/config/theme';
import { api } from '~/utils/api';
import { MenuItem } from '@mantine/core/lib/Menu/MenuItem/MenuItem';

type HeaderProps = {
  children?: ReactNode;
  onStartNewChat: () => void;
};

export const HeaderMobile: React.FC<HeaderProps> = ({
  children,
  onStartNewChat,
}) => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const [opened, { open, close }] = useDisclosure(false);
  const { white, black } = theme;
  const iconPlus = <IconPlus size={15} />;
  const { data: chatsData, error: chatsError } = api.chat.getAll.useQuery();

  return (
    <MantineHeader height={80} ml={mobileScreen ? 'px' : '250px'}>
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
          <Stack justify='center' align='center' spacing='md'>
            <Space h='lg' />

            <Group position='apart' sx={{ alignContent: 'center' }}>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <Button ml='lg' leftIcon={iconPlus} onClick={onStartNewChat}>
                New Chat
              </Button>
            </Group>
            <Space />

            <Title order={3}>Previous Chats</Title>
            {chatsData ? (
              chatsData.map((chat: any) => (
                //    {chat.slug}
                <Flex
                  key={chat.id}
                  align='center'
                  justify='center'
                  sx={{ padding: '5px' }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'black',
                      marginRight: '10px',
                    }}
                  >
                    {chat.title}
                  </span>
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
                        sx={{ color: black, backgroundColor: 'transparent' }}
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
                          <IconMessage
                            style={{ width: '16px', height: '16px' }}
                          />
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
                          <IconTrash
                            style={{ width: '16px', height: '16px' }}
                          />
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
                <Loader color={black} />
              </Flex>
            )}
          </Stack>
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
