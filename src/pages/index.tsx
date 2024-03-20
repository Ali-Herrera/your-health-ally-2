import Head from 'next/head';

import { Button } from '@mantine/core';

import { api } from '~/utils/api';

import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavBar } from '~/components/NavBar';
import { Header } from '~/components/Header';
import { ChatContent } from '~/components/ChatContent';
import { ChatInput } from '~/components/ChatInput';

export default function Home() {
  const hello = api.post.hello.useQuery({ text: 'from tRPC' });
  const [opened, { toggle }] = useDisclosure();
  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding='md'
      >
        {/* <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
          <div>Logo</div>
        </AppShell.Header> */}
        <Header />

        <NavBar />

        <AppShell.Main>
          <ChatContent chatItems={[]} />
          <ChatInput onUpdate={() => {}} />
        </AppShell.Main>
      </AppShell>
    </>
  );
}
