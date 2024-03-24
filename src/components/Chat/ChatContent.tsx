import { UserButton } from '@clerk/nextjs';
import { Avatar, Box, Group, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { theme } from '~/config/theme';
import { type Author } from '~/utils/types';

export type ChatItem = {
  author: Author;
  content?: string;
  isError?: boolean;
};

type Props = {
  chatItems: ChatItem[];
};

export const ChatContent = ({ chatItems }: Props) => {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const { colors, black } = theme;

  // Check if any user messages exist
  const userMessageExists = chatItems.some(
    (item) => item.author === 'User' && item.content
  );

  return (
    <Box ml={isMobile ? 'lg' : '250px'} mr='lg' h='70vh'>
      {chatItems.map((chatItem: ChatItem, index: number) => (
        <Stack key={index} className='chatLog' spacing='md' mb='xl'>
          <Group
            className='chatUser'
            style={{
              padding: index === chatItems.length - 1 ? '10px' : '16px',
              borderRadius: '10px',
            }}
          >
            <Avatar
              color={
                chatItem.author === 'User'
                  ? colors?.teal?.[6]
                  : colors?.darkPink?.[6]
              }
            >
              {chatItem.author === 'User' ? /* "User" */ <UserButton /> : 'AI'}
            </Avatar>
            {chatItem.author === 'User' ? (
              <Text c='dimmed'>{chatItem.content}</Text>
            ) : (
              <Text c={black}>{chatItem.content}</Text>
            )}
            {/* TODO: ERROR HANDLING
				 <div
            className={clsx("ml-5 mt-1 box-border", {
              "text-white": !chatItem.isError,
              "text-red-500": chatItem.isError,
            })}
          >   
          </div> */}
          </Group>
        </Stack>
      ))}
      {/* Render initial prompt only if no user messages exist */}
      {!userMessageExists && (
        <Box>
          <Stack className='chatLog' spacing='md' mb='xl'>
            <Group
              className='chatUser'
              style={{
                padding: '16px',
                borderRadius: '10px',
              }}
            >
              <Avatar color={colors?.darkPink?.[6]}>AI</Avatar>
              <Text c={black}>
                I am an intelligent advisor that can provide information
                regarding people's health. I answer questions about
                health-related conditions and symptoms, and what type of doctors
                you may want to see, and what types of questions to bring to the
                doctor, as well as provide readiness checklists for
                appointments. This is for educational purposes only. Please see
                your healthcare provider for medical treatment.
              </Text>
            </Group>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
