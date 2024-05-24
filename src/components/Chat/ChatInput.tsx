import { Button, Group, Textarea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSend } from '@tabler/icons-react';
import { theme } from '../../config/theme';
import { useState, useEffect, useRef } from 'react';
import { api } from '../../utils/api';

type Props = {
  onUpdate: (prompt: string, chatId: string, author: 'User' | 'AI') => void;
  waiting?: boolean;
  userId: string;
  currentChat: string | null;
  onStartNewChat: () => Promise<void>;
};

export const ChatInput = ({
  onUpdate,
  waiting,
  userId,
  currentChat,
  onStartNewChat,
}: Props) => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const { colors } = theme;

  const [prompt, setPrompt] = useState<string>('');
  const [rows, setRows] = useState<number>(2);
  const [titleUpdated, setTitleUpdated] = useState<boolean>(false);

  const chatIdRef = useRef<string | null>(currentChat);

  useEffect(() => {
    if (currentChat !== chatIdRef.current) {
      chatIdRef.current = currentChat;
      setTitleUpdated(false);
    }
  }, [currentChat]);

  useEffect(() => {
    const lines = prompt.split(/\r*\n/).length;
    setRows(Math.max(2, Math.min(lines, 8)));
  }, [prompt]);

  const CreateChatMutation = api.chat.create.useMutation();
  const GenerateTextMutation = api.ai.generateText.useMutation();
  const ContinueChatMutation = api.chat.continueChat.useMutation();
  const updateChatMutation = api.chat.update.useMutation();

  const handleSubmit = async () => {
    if (prompt.trim()) {
      try {
        if (!chatIdRef.current) {
          await CreateChatMutation.mutate(
            {
              title: '',
              description: '',
              message: prompt,
              userId: userId,
            },
            {
              onSuccess: async (data) => {
                console.log('Chat creation successful. Response:', data);
                const chatIdFromResult = data?.chatId;
                setPrompt('');
                chatIdRef.current = chatIdFromResult;
                await handleGenerateText(chatIdFromResult ?? '');
              },
            }
          );
        } else {
          await ContinueChatMutation.mutate(
            {
              message: prompt,
              chatId: chatIdRef.current,
              userId: userId,
            },
            {
              onSuccess: async (data) => {
                console.log('Chat continuation successful. Response:', data);
                setPrompt('');
                await handleGenerateText(chatIdRef.current!);
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

  const handleGenerateText = async (currentChatId: string) => {
    console.log('Generating text for chat ID:', currentChatId);
    await GenerateTextMutation.mutate(
      {
        prompt: prompt,
        chatId: currentChatId,
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
            onUpdate(prompt, currentChatId, 'User');
            onUpdate(generateTextData.generatedText, currentChatId, 'AI');

            if (!titleUpdated) {
              const title = prompt.split(' ').slice(0, 3).join(' ');
              const description = prompt.split(' ').slice(0, 10).join(' ');

              await updateChatMutation.mutate({
                id: currentChatId,
                title: title,
                description: description,
              });

              setTitleUpdated(true);
            }
          }
        },
        onError: (generateTextError) => {
          console.error('Failed to generate text:', generateTextError);
        },
      }
    );
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
        disabled={waiting}
        rows={rows}
      />
      <Button
        onClick={handleSubmit}
        disabled={waiting || prompt.trim().length === 0}
      >
        <IconSend size={18} />
      </Button>
    </Group>
  );
};
