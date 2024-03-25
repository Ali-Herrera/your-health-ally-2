import { Box, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Welcome } from '../components/welcome';
import { Sidebar } from "~/components/Sidebar/sidebar";
import { Header } from "~/components/Header";
import { Footer } from "~/components/footer";
import { ChatContent, type ChatItem } from "~/components/Chat/ChatContent";
import { ChatInput } from "~/components/Chat/ChatInput";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import React from "react";
import { UserButton, useUser } from '@clerk/nextjs';


export default function Home() {
	const isMobile = useMediaQuery("(max-width: 480px)");

	const [chatItems, setChatItems] = useState<ChatItem[]>([]);
	const [waiting, setWaiting] = useState<boolean>(false);
	const scrollToRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(
      () => scrollToRef.current?.scrollIntoView({ behavior: 'smooth' }),
      100
    );
  };

  const generatedTextMutation = api.ai.generateText.useMutation({
    onSuccess: (data) => {
      setChatItems([
        ...chatItems,
        {
          content: data.generatedText,
          author: 'AI',
        },
      ]);
    },

    onError: (error) => {
      setChatItems([
        ...chatItems,
        {
          content: error.message ?? 'An error occurred',
          author: 'AI',
          isError: true,
        },
      ]);
    },

		onSettled: () => {
			setWaiting(false);
			scrollToBottom();
		},
	});

	const resetMutation = api.ai.reset.useMutation();

	const handleUpdate = (prompt: string) => {
		setWaiting(true);

    setChatItems([
      ...chatItems,
      {
        content: prompt.replace(/\n/g, '\n\n'),
        author: 'User',
      },
    ]);

    scrollToBottom();

    console.log('User sent a message:', prompt);
    console.log('Before calling mutate:', chatItems);
    console.log('Prompt value:', prompt);

    generatedTextMutation.mutate({ prompt });

		console.log("After calling mutate:", chatItems);
	};
	const handleReset = () => {
		setChatItems([]);
		resetMutation.mutate();
	};

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
      {''}
      {isLoaded && user && (
        <Box>
          <Header />
          {isMobile ? null : <Sidebar />}
          <ChatContent chatItems={chatItems} />
          <ChatInput onUpdate={handleUpdate} />
          <Footer />
        </Box>
      )}
    </>
  );}