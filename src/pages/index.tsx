import { Box, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Welcome } from '../components/Welcome';
import { Sidebar } from '../components/sidebar';
import { Header } from '~/components/header';
import { HeaderMobile } from '~/components/header/mobileHeader';
import { Footer } from '~/components/footer';
import { ChatContent, type ChatItem } from '~/components/Chat/ChatContent';
import { ChatInput } from '~/components/Chat/ChatInput';
import { api } from '~/utils/api';
import { useRef, useState } from 'react';
import React from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import ChatInterface from '~/components/Chat/ChatInterface';

export default function Home() {
  const mobileScreen = useMediaQuery('(max-width: 480px)');

  // const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  // const [waiting, setWaiting] = useState<boolean>(false);

  // const generatedTextMutation = api.ai.generateText.useMutation({
  //   onSuccess: (data) => {
  //     setChatItems([
  //       ...chatItems,
  //       {
  //         content: data.generatedText,
  //         author: 'AI',
  //       },
  //     ]);
  //   },

  //   onError: (error) => {
  //     setChatItems([
  //       ...chatItems,
  //       {
  //         content: error.message ?? 'An error occurred',
  //         author: 'AI',
  //         isError: true,
  //       },
  //     ]);
  //   },

  //   onSettled: () => {
  //     setWaiting(false);
  //   },
  // });

  // const resetMutation = api.ai.reset.useMutation();

  // const handleUpdate = (prompt: string) => {
  //   setWaiting(true);

  //   setChatItems([
  //     ...chatItems,
  //     {
  //       content: prompt.replace(/\n/g, '\n\n'),
  //       author: 'User',
  //     },
  //   ]);

  //   console.log('User sent a message:', prompt);
  //   console.log('Before calling mutate:', chatItems);
  //   console.log('Prompt value:', prompt);

  //   generatedTextMutation.mutate({ prompt });

  //   console.log('After calling mutate:', chatItems);
  // };
  // const handleReset = () => {
  //   setChatItems([]);
  //   resetMutation.mutate();
  // };

  const { isLoaded, user } = useUser();
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
          {/* {mobileScreen ? <HeaderMobile onReset={handleReset} /> : <Header />} */}
          {/* {mobileScreen ? null : <Sidebar onReset={handleReset} />}
          <ChatContent
            chatItems={chatItems}
            onReset={handleReset}
            loading={waiting}
          />
          <ChatInput onUpdate={handleUpdate} waiting={waiting} /> */}
          <ChatInterface />
          <Footer />
        </Box>
      )}
    </>
  );
}
