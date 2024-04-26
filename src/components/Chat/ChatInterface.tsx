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

const ChatInterface = () => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [waiting, setWaiting] = useState<boolean>(false);

  // const generatedTextMutation = api.ai.generateText.useMutation({
  //   onError: (error) => {
  //     setChatItems((prevChatItems) => [
  //       ...prevChatItems,
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

  const resetMutation = api.ai.reset.useMutation();

  // const handleUpdate = async (prompt: string, chatId: string) => {
  //   setWaiting(true);

  //   // Update chatItems with the user's prompt
  //   setChatItems((prevChatItems) => [
  //     ...prevChatItems,
  //     {
  //       content: prompt.replace(/\n/g, '\n\n'),
  //       author: 'User',
  //     },
  //   ]);

  //   try {
  //     // Call the AI mutation to generate text
  //     const generateTextResult = await generatedTextMutation.mutateAsync({
  //       prompt,
  //       chatId,
  //     });

  //     if (generateTextResult.generatedText) {
  //       // Check if the AI response is the same as the last message in chatItems
  //       const lastMessage = chatItems[chatItems.length - 1];
  //       if (
  //         lastMessage &&
  //         lastMessage.author === 'AI' &&
  //         lastMessage.content === generateTextResult.generatedText
  //       ) {
  //         console.log(
  //           'AI response already exists in chatItems. Skipping addition.'
  //         );
  //       } else {
  //         // Update chatItems with the generated text
  //         setChatItems((prevChatItems) => [
  //           ...prevChatItems,
  //           {
  //             content: generateTextResult.generatedText,
  //             author: 'AI',
  //           },
  //         ]);
  //       }
  //     } else {
  //       console.error('Error generating text');
  //       // Handle error if needed
  //     }
  //   } catch (error) {
  //     console.error('Error generating text:', error);
  //     // Handle error if needed
  //   } finally {
  //     // Set waiting to false regardless of success or error
  //     setWaiting(false);
  //   }
  // };

  const handleUpdate = (prompt: string, chatId: string, author: Author) => {
    setChatItems((prevChatItems) => [
      ...prevChatItems,
      { content: prompt, author: author },
    ]);
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
          <Footer />
        </>
      )}
    </Box>
  );
};

export default ChatInterface;
