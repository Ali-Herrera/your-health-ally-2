import {
  Header as MantineHeader,
  Flex,
  Button,
  Drawer,
  Group,
  Space,
  Stack,
  Title,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { IconMenu2, IconPlus } from '@tabler/icons-react';
import PinkLogo from '../../../public/logo/logo-pink-dark.png';
import logoIcon from '../../../public/icon/heart-pink.png';
import Image from 'next/image';
import { ReactNode } from 'react';
import { theme } from '~/config/theme';

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
