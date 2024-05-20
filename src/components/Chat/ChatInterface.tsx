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
  const { isLoaded, user } = useUser();
  const [currentChat, setCurrentChat] = useState<string | null>(null); // Update the type of currentChat
  const startNewChatMutation = api.chat.startNewChat.useMutation();

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

  const handleStartNewChat = async () => {
    try {
      // Call the startNewChat mutation to create a new chat on the server
      await startNewChatMutation.mutate();
      const newChatId = startNewChatMutation.data?.chatId ?? '';
      setCurrentChat(newChatId);

      // Reset the chatItems state to clear the UI
      setChatItems([]);
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  };

  console.log('User ID:', user?.id);

  return (
    <Box>
      {isLoaded && user && (
        <>
          {mobileScreen ? (
            <HeaderMobile onStartNewChat={handleStartNewChat} />
          ) : (
            <Header />
          )}
          {mobileScreen ? null : (
            <Sidebar onStartNewChat={handleStartNewChat} />
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
