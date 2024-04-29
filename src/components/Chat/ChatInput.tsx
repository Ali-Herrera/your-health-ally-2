// ChatInput.tsx
import { Button, Group, Textarea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSend } from '@tabler/icons-react';
import { theme } from '../../config/theme';
import { useState, useEffect, useRef } from 'react';
import { chatRouter } from '~/server/api/routers/chats/create-chat';
import { api } from '../../utils/api';
import { TRPCError } from '@trpc/server';
import { Author } from '~/utils/types';

type Props = {
  onUpdate: (prompt: string, chatId: string, author: 'User' | 'AI') => void;
  waiting?: boolean;
  userId: string;
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
      if ('chatId' in data) {
        setChatId(data.chatId);
        chatIdRef.current = data.chatId;
      }
    }
  }, [data]);

  useEffect(() => {
    if (chatIdError) {
      console.error('Failed to create chat:', chatIdError.message);
    }
  }, [chatIdError]);

  const CreateChatMutation = api.chat.create.useMutation();
  const GenerateTextMutation = api.ai.generateText.useMutation();
  const ContinueChatMutation = api.chat.continueChat.useMutation();

  const handleSubmit = async () => {
    if (prompt.trim()) {
      try {
        if (!chatId) {
          await CreateChatMutation.mutate(
            {
              message: prompt,
              userId: userId,
              orderField: 0,
            },
            {
              onSuccess: async (data) => {
                console.log('Chat creation successful. Response:', data);
                const chatIdFromResult = data?.chatId;
                setPrompt('');
                setChatId(chatIdFromResult);

                console.log(
                  'Calling GenerateTextMutation with chatId:',
                  chatIdFromResult
                );

                await GenerateTextMutation.mutate(
                  {
                    prompt: prompt,
                    chatId: chatIdFromResult ?? '',
                  },
                  {
                    onSuccess: async (generateTextData) => {
                      if (
                        generateTextData &&
                        generateTextData.generatedText !== undefined
                      ) {
                        console.log(
                          'GenerateText successful. Response:',
                          generateTextData.generatedText
                        );
                        onUpdate(prompt, chatIdFromResult!, 'User');
                        onUpdate(
                          generateTextData.generatedText,
                          chatIdFromResult!,
                          'AI'
                        );
                      }
                    },
                  }
                );
              },
            }
          );
        } else {
          await ContinueChatMutation.mutate(
            {
              message: prompt,
              chatId: chatId,
              userId: userId,
              orderField: 0,
            },
            {
              onSuccess: async (data) => {
                console.log('Chat continuation successful. Response:', data);
                setPrompt('');

                console.log(
                  'Calling GenerateTextMutation with chatId:',
                  chatId
                );

                await GenerateTextMutation.mutate(
                  {
                    prompt: prompt,
                    chatId: chatId,
                  },
                  {
                    onSuccess: (generateTextData) => {
                      if (
                        generateTextData &&
                        generateTextData.generatedText !== undefined
                      ) {
                        onUpdate(prompt, chatId, 'User');
                        onUpdate(generateTextData.generatedText, chatId, 'AI');
                      }
                    },
                    onError: (generateTextError) => {
                      console.error(
                        'Failed to generate text:',
                        generateTextError
                      );
                    },
                  }
                );
              },
              onError: (error) => {
                console.error('Failed to continue chat:', error);
              },
            }
          );
        }
      } catch (error) {
        console.error('Failed to handle submit:', error);
      }
    }
  };

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

// const handleSubmit = async () => {
//   if (prompt.trim()) {
//     try {
//       const createChatResult = await CreateChatMutation.mutate(
//         {
//           message: prompt,
//           userId: userId,
//         },
//         {
//           onSuccess: async (data) => {
//             console.log(
//               'Chat creation successful. Response:',
//               createChatResult
//             );
//             console.log('Chat ID:', data.chatId); // Check chatId here
//             setPrompt(''); // Clear the prompt after successful chat creation
//             setChatId(data.chatId);

//             // Now call the GenerateTextMutation inside the onSuccess callback
//             const chatIdFromResult = data?.chatId;

//             console.log(
//               'Calling GenerateTextMutation with chatId:',
//               chatIdFromResult
//             );

//             const generateTextResult = await GenerateTextMutation.mutate(
//               {
//                 prompt: prompt,
//                 chatId: chatIdFromResult ?? '', // Use chatIdFromResult as fallback and convert to string
//               },
//               {
//                 onSuccess: (generateTextData) => {
//                   if (
//                     generateTextData &&
//                     generateTextData.generatedText !== undefined
//                   ) {
//                     console.log(
//                       'GenerateText successful. Response:',
//                       generateTextData.generatedText
//                     );
//                     if (chatIdFromResult) {
//                       onUpdate(prompt, chatIdFromResult, 'User'); // Update the author to 'User' for user input
//                       onUpdate(
//                         generateTextData.generatedText,
//                         chatIdFromResult,
//                         'AI' // Update the author to 'AI' for AI-generated text
//                       );
//                     }
//                   } else {
//                     console.error(
//                       'Failed to generate text:',
//                       generateTextData
//                     ); // Log the error here
//                   }
//                 },
//                 onError: (generateTextError) => {
//                   console.error(
//                     'Failed to generate text:',
//                     generateTextError
//                   ); // Log the error here
//                 },
//               }
//             );
//           },
//         }
//       );
//     } catch (error) {
//       console.error('Failed to create chat:', error);
//     }
//   }
// };
