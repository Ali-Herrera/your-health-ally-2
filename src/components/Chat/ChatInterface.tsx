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

interface ChatInterfaceProps {
  userId: string; // Define the userId prop
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId }) => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const [chatItems, setChatItems] = useState([] as ChatItem[]);
  const [waiting, setWaiting] = useState<boolean>(false);

  const handleUpdate = (
    prompt: string,
    chatId: string /* author: Author */
  ) => {
    console.log('Updating chat items...');
    console.log('Previous chat items:', chatItems);

    // Determine the order field for the new message
    const handleUpdate = (prompt: string, chatId: string, author: Author) => {
      const orderField =
        chatItems.length > 0
          ? (chatItems[chatItems.length - 1]?.orderField ?? 0) + 1
          : 0;

      // Update the chatItems state by adding the new chat item
      setChatItems((prevChatItems) => {
        const updatedChatItems = [
          ...prevChatItems,
          { content: prompt, author: author, orderField: orderField }, // Make sure to include orderField
        ];
        console.log('Updated chat items:', updatedChatItems);
        return updatedChatItems; // Return the updated chat items
      });
    };
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
          <Footer />
        </>
      )}
    </Box>
  );
};

export default ChatInterface;

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
