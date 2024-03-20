// import { SignedIn, UserButton } from '@clerk/nextjs';
import { AppShell, Group, Burger } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { theme } from '~/config/theme';
import PinkLogo from '../../public/logo/logo-pink-dark.png';
import Image from 'next/image';

export const Header = () => {
  const [mobileOpened, { open, close }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 750em)');
  const { colors, white } = theme;

  return (
    <AppShell.Header bg={white} withBorder={false}>
      <Group
        m='sm'
        justify={isMobile ? 'space-between' : 'flex-start'}
        style={{ alignContent: 'center' }}
      >
        <Burger
          aria-label='Toggle navigation'
          opened={mobileOpened}
          onClick={open}
          hiddenFrom='sm'
          size='sm'
          m='sm'
        />
        <Image
          src={PinkLogo}
          alt='Your Health Ally Logo'
          //Original Size 1920 by 1080...Reduced to 96 by 54 (5% of original size)
          width={96}
          height={54}
        />
        {/* <SignedIn>
          <UserButton />
        </SignedIn> */}
      </Group>
    </AppShell.Header>
  );
};
