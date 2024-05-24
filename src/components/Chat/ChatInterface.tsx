import { Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ChatContent, type ChatItem } from '~/components/Chat/ChatContent';
import { ChatInput } from '~/components/Chat/ChatInput';
import { api } from '~/utils/api';
import { useEffect, useState } from 'react';
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
      // Logic to set initial chat title if needed
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  };

  const handleRevisitChat = (chatId: string) => {
    setCurrentChat(chatId);
    // You can fetch the chat title here if needed
  };

  const getMessagesByChatId = api.chat.getMessagesByChatId.useQuery(
    { chatId: currentChat || '' },
    { enabled: !!currentChat }
  );

  useEffect(() => {
    if (getMessagesByChatId.data) {
      const messages: ChatItem[] = getMessagesByChatId.data.map(
        (message: any) => ({
          author: message.userId === userId ? 'User' : 'AI',
          content: message.content,
        })
      );
      setChatItems([...messages]);
    }
  }, [getMessagesByChatId.data]);

  return (
    <Box>
      {isLoaded && user && (
        <>
          {mobileScreen ? (
            <HeaderMobile
              onStartNewChat={handleStartNewChat}
              onRevisitChat={handleRevisitChat}
            />
          ) : (
            <Header />
          )}
          {!mobileScreen && (
            <Sidebar
              onStartNewChat={handleStartNewChat}
              onRevisitChat={handleRevisitChat}
            />
          )}
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
