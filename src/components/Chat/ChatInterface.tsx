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
import { Author } from '~/utils/types';
import { set } from 'zod';

interface ChatInterfaceProps {
  userId: string; // Define the userId prop
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId }) => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const [chatItems, setChatItems] = useState([] as ChatItem[]);
  const [waiting, setWaiting] = useState<boolean>(false);

  const handleUpdate = (
    prompt: string,
    chatId: string,
    // userId: string // Include userId as a parameter
    author: Author
  ) => {
    setWaiting(true);

    setChatItems((prevChatItems) => [
      ...prevChatItems,
      { content: prompt, author: author },
    ]);

    setWaiting(false);
  };

  const resetMutation = api.ai.reset.useMutation();

  const handleReset = () => {
    setChatItems([]);
    resetMutation.mutate();
  };

  const { isLoaded, user } = useUser();

  console.log('User ID:', user?.id);

  return (
    <Box>
      {isLoaded && user && (
        <>
          {mobileScreen ? <HeaderMobile onReset={handleReset} /> : <Header />}
          {mobileScreen ? null : (
            <Sidebar
              onStartNewChat={function (): void {
                throw new Error('Function not implemented.');
              }} /*onReset={handleReset}*/
            />
          )}
          <ChatContent
            chatItems={chatItems}
            // onReset={handleReset}
            loading={waiting}
          />
          <ChatInput
            onUpdate={handleUpdate}
            waiting={waiting}
            userId={user.id}
          />
        </>
      )}
    </Box>
  );
};

export default ChatInterface;
