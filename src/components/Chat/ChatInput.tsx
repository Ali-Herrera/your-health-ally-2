// ChatInput.tsx
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
      const trpcError = new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create chat',
        cause: chatIdError.message,
      });
      throw trpcError;
    }
  }, [chatIdError]);

  const CreateChatMutation = api.chat.create.useMutation();

  const handleUpdate = async () => {
    if (prompt.trim()) {
      try {
        await CreateChatMutation.mutate(
          {
            message: prompt,
            userId: userId,
          },
          {
            onSuccess: (data) => {
              // Handle successful mutation
              onUpdate(prompt, data.chatId);
              setPrompt('');
            },
            onError: (error) => {
              // Handle mutation error
              console.error('Failed to create chat', error);
            },
          }
        );
      } catch (error) {
        console.error('Failed to create chat', error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
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
        onClick={handleUpdate}
        disabled={waiting || !prompt.trim() || chatIdLoading}
      >
        <IconSend size={20} style={{ bottom: '5px', alignSelf: 'center' }} />
      </Button>
    </Group>
  );
};

export default ChatInput;

// type Props = {
//   onUpdate: (prompt: string, chatId: string) => void;
//   // chatId: string;
//   waiting?: boolean;
// };

// // Define the mutation hook for starting a new chat and getting the chat ID
// const useStartNewChat = () => {
//   return useMutation(['startNewChat'], {
//     async mutate() {
//       return trpc.startNewChat();
//     },
//   });
// };

// export const ChatInput = ({ onUpdate, waiting }: Props) => {
//   const mobileScreen = useMediaQuery('(max-width: 480px)');
//   const { colors } = theme;

//   const [prompt, setPrompt] = useState<string>('');
//   const [rows, setRows] = useState<number>(2);

//   const [chatId, setChatId] = useState<string | null>(null);

//     // Use the useStartNewChat hook to fetch the chat ID
//     const { data: chatIdData, error: chatIdError, isLoading: chatIdLoading } = useStartNewChat();

//     useEffect(() => {
//     // Update the chat ID when chatIdData changes
//     if (chatIdData) {
//       setChatId(chatIdData.chatId);
//     }
//   }, [chatIdData]);

//   useEffect(() => {
//     const lines = prompt.split(/\r*\n/).length;
//     setRows(Math.max(2, Math.min(lines, 8)));
//   }, [prompt]);

//   const handleUpdate = (prompt: string, chatId: string) => {
//     if (prompt.trim()) {
//       onUpdate(prompt, chatId);
//       setPrompt('');
//       console.log('Updating message:', prompt);
//       console.log('For chat ID:', chatId);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleUpdate();
//     }
//   };

//   return (
//     <Group position='center' ml={mobileScreen ? 'lg' : '250px'} mr='lg' p='lg'>
//       <Textarea
//         placeholder='What questions do you have?'
//         aria-label='Type your message here'
//         radius='md'
//         style={{
//           width: '90%',
//         }}
//         value={prompt}
//         onChange={(e) => setPrompt(e.currentTarget.value)}
//         onKeyDown={handleKeyDown}
//         disabled={waiting}
//         rows={rows}
//       />
//       <Button
//         size='sm'
//         radius='md'
//         aria-label='Send message'
//         sx={{
//           backgroundColor: colors?.darkPink?.[6],
//         }}
//         onClick={handleUpdate}
//         disabled={waiting || !prompt.trim()}
//       >
//         <IconSend size={20} style={{ bottom: '5px', alignSelf: 'center' }} />
//       </Button>
//     </Group>
//   );
// };

// export default ChatInput;
