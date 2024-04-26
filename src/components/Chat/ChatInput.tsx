// import { Button, Group, Textarea } from '@mantine/core';
// import { useMediaQuery } from '@mantine/hooks';
// import { IconSend } from '@tabler/icons-react';
// import { theme } from '../../config/theme';
// import { useState, useEffect, useRef } from 'react';
// import { api } from '../../utils/api';
// import { TRPCError } from '@trpc/server';

// type Props = {
//   onUpdate: (prompt: string, chatId: string) => void;
//   userId: string;
//   waiting?: boolean;
// };

// const useStartNewChat = () => {
//   return api.chat.startNewChat.useMutation();
// };

// export const ChatInput = ({ onUpdate, userId }: Props) => {
//   const mobileScreen = useMediaQuery('(max-width: 480px)');
//   const { colors } = theme;

//   const [prompt, setPrompt] = useState<string>('');
//   const [rows, setRows] = useState<number>(2);
//   const [chatId, setChatId] = useState<string | null>(null);

//   const chatIdRef = useRef<string | null>(null);

//   const {
//     data: chatData,
//     error: chatError,
//     isLoading: chatLoading,
//   } = useStartNewChat();

//   useEffect(() => {
//     const lines = prompt.split(/\r*\n/).length;
//     setRows(Math.max(2, Math.min(lines, 8)));
//   }, [prompt]);

//   useEffect(() => {
//     if (chatData) {
//       setChatId(chatData.chatId);
//       chatIdRef.current = chatData.chatId;
//     }
//   }, [chatData]);

//   useEffect(() => {
//     if (chatError) {
//       const trpcError = new TRPCError({
//         code: 'INTERNAL_SERVER_ERROR',
//         message: 'Failed to create chat',
//         cause: chatError.message,
//       });
//       throw trpcError;
//     }
//   }, [chatError]);

//   const CreateChatMutation = api.chat.create.useMutation();
//   const GenerateTextMutation = api.ai.generateText.useMutation();

//   const handleSendMessage = async () => {
//     if (prompt.trim()) {
//       try {
//         const createChatResult = await CreateChatMutation.mutate(
//           {
//             message: prompt,
//             userId: userId,
//           },
//           {
//             onSuccess: async (data) => {
//               console.log(
//                 'Chat creation successful. Response:',
//                 createChatResult
//               );
//               console.log('Chat ID:', data.chatId); // Check chatId here

//               try {
//                 const generateTextResult = (await GenerateTextMutation.mutate({
//                   prompt: prompt,
//                   chatId: data.chatId,
//                 })) as { data: { generatedText: string } } | undefined;
//                 if (generateTextResult !== undefined) {
//                   console.log(
//                     'GenerateText successful. Response:',
//                     generateTextResult.data.generatedText
//                   );
//                   onUpdate(prompt, data.chatId);
//                   setPrompt('');
//                 } else {
//                   console.error('Failed to generate text');
//                 }
//                 onUpdate(prompt, data.chatId);
//                 setPrompt('');
//               } catch (generateTextError) {
//                 console.error('Failed to generate text', generateTextError);
//               }
//             },
//             onError: (error) => {
//               console.error('Failed to create chat', error);
//             },
//           }
//         );
//       } catch (error) {
//         console.error('Failed to create chat', error);
//       }
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <Group position='center' ml={mobileScreen ? 'lg' : '250px'} mr='lg' p='lg'>
//       <Textarea
//         placeholder='What questions do you have?'
//         aria-label='Type your message here'
//         radius='md'
//         style={{ width: '90%' }}
//         value={prompt}
//         onChange={(e) => setPrompt(e.currentTarget.value)}
//         onKeyDown={handleKeyDown}
//         disabled={chatLoading}
//         rows={rows}
//       />
//       <Button
//         size='sm'
//         radius='md'
//         aria-label='Send message'
//         sx={{ backgroundColor: colors?.darkPink?.[6] }}
//         onClick={handleSendMessage}
//         disabled={!prompt.trim() || chatLoading}
//       >
//         <IconSend size={20} style={{ bottom: '5px', alignSelf: 'center' }} />
//       </Button>
//     </Group>
//   );
// };

// export default ChatInput;

// // ChatInput.tsx
import { Button, Group, Textarea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSend } from '@tabler/icons-react';
import { theme } from '../../config/theme';
import { useState, useEffect, useRef } from 'react';
import { chatRouter } from '~/server/api/routers/chats/create-chat';
import { api } from '../../utils/api';
import { TRPCError } from '@trpc/server';

type Props = {
  onUpdate: (prompt: string, chatId: string) => void;
  waiting?: boolean;
  userId: string; // Add userId prop here
};

const useStartNewChat = () => {
  return api.chat.startNewChat.useMutation();
};

export const ChatInput = ({ onUpdate, waiting, userId }: Props) => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const { colors } = theme;

  const [prompt, setPrompt] = useState<string>('');
  const [rows, setRows] = useState<number>(2);
  const [chatId, setChatId] = useState<string | null>(null);

  const chatIdRef = useRef<string | null>(null);

  const {
    data: data,
    error: chatIdError,
    isLoading: chatIdLoading,
  } = useStartNewChat();

  useEffect(() => {
    const lines = prompt.split(/\r*\n/).length;
    setRows(Math.max(2, Math.min(lines, 8)));
  }, [prompt]);

  useEffect(() => {
    if (data) {
      setChatId(data.chatId);
      chatIdRef.current = data.chatId;
    }
  }, [data]);

  //add error handling for the chatId using TRPCError
  useEffect(() => {
    if (chatIdError) {
      console.error('Failed to create chat:', chatIdError.message);
      // Display an error message to the user
      // Or handle it in some other way
    }
  }, [chatIdError]);

  const CreateChatMutation = api.chat.create.useMutation();
  const GenerateTextMutation = api.ai.generateText.useMutation();

  const handleSubmit = async () => {
    if (prompt.trim()) {
      try {
        const createChatResult = await CreateChatMutation.mutate(
          {
            message: prompt,
            userId: userId,
          },
          {
            onSuccess: async (data) => {
              console.log(
                'Chat creation successful. Response:',
                createChatResult
              );
              console.log('Chat ID:', data.chatId); // Check chatId here
              setPrompt(''); // Clear the prompt after successful chat creation
              setChatId(data.chatId);

              // Now call the GenerateTextMutation inside the onSuccess callback
              const chatIdFromResult = data?.chatId;

              console.log(
                'Calling GenerateTextMutation with chatId:',
                chatIdFromResult
              );

              const generateTextResult = await GenerateTextMutation.mutate(
                {
                  prompt: prompt,
                  chatId: chatIdFromResult ?? '', // Use chatIdFromResult as fallback and convert to string
                },
                {
                  onSuccess: (generateTextData) => {
                    if (
                      generateTextData &&
                      generateTextData.generatedText !== undefined
                    ) {
                      console.log(
                        'GenerateText successful. Response:',
                        generateTextData.generatedText
                      );
                      if (chatIdFromResult) {
                        onUpdate(prompt, chatIdFromResult);
                      }
                    } else {
                      console.error(
                        'Failed to generate text:',
                        generateTextData
                      ); // Log the error here
                    }
                  },
                  onError: (generateTextError) => {
                    console.error(
                      'Failed to generate text:',
                      generateTextError
                    ); // Log the error here
                  },
                }
              );
            },
          }
        );
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    }
  };

  //     onError: (error) => {
  //       console.error('Failed to create chat', error);
  //     },
  //       );
  //     } catch (error) {
  //       console.error('Failed to create chat', error);
  //     }
  //   }
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Group position='center' ml={mobileScreen ? 'lg' : '250px'} mr='lg' p='lg'>
      <Textarea
        placeholder='What questions do you have?'
        aria-label='Type your message here'
        radius='md'
        style={{
          width: '90%',
        }}
        value={prompt}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        disabled={waiting || chatIdLoading}
        rows={rows}
      />
      <Button
        size='sm'
        radius='md'
        aria-label='Send message'
        sx={{
          backgroundColor: colors?.darkPink?.[6],
        }}
        onClick={handleSubmit}
        disabled={waiting || !prompt.trim() || chatIdLoading}
      >
        <IconSend size={20} style={{ bottom: '5px', alignSelf: 'center' }} />
      </Button>
    </Group>
  );
};

export default ChatInput;
