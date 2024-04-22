// ChatInterface.tsx
import { Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ChatContent, type ChatItem } from '~/components/Chat/ChatContent';
import { ChatInput } from '~/components/Chat/ChatInput';
import { Footer } from '~/components/footer';
import { api } from '~/utils/api';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Sidebar } from '../sidebar';
import { HeaderMobile } from '../header/mobileHeader';
import { Header } from '../header';

interface ChatInterfaceProps {
  userId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId }) => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [waiting, setWaiting] = useState<boolean>(false);
  const { user: loggedInUser } = useUser();

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

    generatedTextMutation.mutate({ prompt });
  };

  const handleReset = () => {
    setChatItems([]);
    resetMutation.mutate();
  };

  const { isLoaded, user } = useUser();

  return (
    <Box>
      {isLoaded && user && (
        <>
          {mobileScreen ? <HeaderMobile onReset={handleReset} /> : <Header />}
          {mobileScreen ? null : <Sidebar onReset={handleReset} />}
          <ChatContent
            chatItems={chatItems}
            // onReset={handleReset}
            loading={waiting}
          />
          <ChatInput
            onUpdate={handleUpdate}
            waiting={waiting}
            userId={userId}
          />
          <Footer />
        </>
      )}
    </Box>
  );
};

export default ChatInterface;
