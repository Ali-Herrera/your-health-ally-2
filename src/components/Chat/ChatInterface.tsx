import { Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ChatContent, type ChatItem } from '~/components/Chat/ChatContent';
import { ChatInput } from '~/components/Chat/ChatInput';
import { api } from '~/utils/api';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Sidebar } from '../sidebar';
import { HeaderMobile } from '../header/mobileHeader';
import { Header } from '../header';
import { Author } from '~/utils/types';

interface ChatInterfaceProps {
  userId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId }) => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [waiting, setWaiting] = useState<boolean>(false);
  const { isLoaded, user } = useUser();
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const startNewChatMutation = api.chat.startNewChat.useMutation();

  const handleUpdate = (prompt: string, chatId: string, author: Author) => {
    setWaiting(true);
    setChatItems((prevChatItems) => [
      ...prevChatItems,
      { content: prompt, author: author },
    ]);
    setWaiting(false);
  };

  const handleStartNewChat = async () => {
    try {
      const newChat = await startNewChatMutation.mutateAsync();
      const newChatId = newChat?.chatId ?? '';
      setCurrentChat(newChatId);
      setChatItems([]);
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  };

  return (
    <Box>
      {isLoaded && user && (
        <>
          {mobileScreen ? (
            <HeaderMobile onStartNewChat={handleStartNewChat} />
          ) : (
            <Header />
          )}
          {!mobileScreen && <Sidebar onStartNewChat={handleStartNewChat} />}
          <ChatContent chatItems={chatItems} loading={waiting} />
          <ChatInput
            onUpdate={handleUpdate}
            waiting={waiting}
            userId={user.id}
            currentChat={currentChat}
            onStartNewChat={handleStartNewChat}
          />
        </>
      )}
    </Box>
  );
};

export default ChatInterface;
