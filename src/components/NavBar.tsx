import { SignedIn, UserButton } from '@clerk/nextjs';
import { AppShell, Button } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { theme } from '~/config/theme';
import { IconPlus } from '@tabler/icons-react';

const { colors, black } = theme;

type Props = {
  onReset: () => void;
  waiting?: boolean;
};

export const NavBar = ({ onReset, waiting }: Props) => {
  const [mobileOpened, { open, close }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 750em)');
  const { colors, white } = theme;
  const iconPlus = <IconPlus size={15} />;

  return (
    <AppShell.Navbar
      p='md'
      bg={colors?.darkPink?.[6]}
      style={{
        borderColor: colors?.darkPink?.[9],
      }}
    >
      {mobileOpened ? (
        <Button
          mt='xl'
          variant='white'
          color={colors?.darkPink?.[6]}
          onClick={close}
        >
          Close
        </Button>
      ) : null}
      <Button
        mt='xl'
        variant='white'
        color={colors?.darkPink?.[6]}
        leftSection={iconPlus}
        justify='center'
        disabled={waiting}
        onClick={onReset}
      >
        Start New Chat
      </Button>
      {mobileOpened ? (
        <SignedIn>
          <UserButton />
        </SignedIn>
      ) : null}
    </AppShell.Navbar>
  );
};
