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
    </Box>
  );
};
