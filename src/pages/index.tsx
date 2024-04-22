import { Box, Group } from '@mantine/core';
import { Welcome } from '../components/Welcome';
import { Footer } from '~/components/footer';
import React from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import ChatInterface from '~/components/Chat/ChatInterface';
import { api } from '~/utils/api';

export default function Home() {
  const { isLoaded, user } = useUser();

  // const { data } = api.chats.getAll.useQuery();

  return (
    <>
      {isLoaded && !user && (
        <>
          <Welcome />
          <Group className='h-screen'>
            <UserButton afterSignOutUrl='/' />
          </Group>
        </>
      )}
      {isLoaded && user && (
        <Box>
          <ChatInterface userId={user.id} />
          <Footer />
        </Box>
      )}
    </>
  );
}
