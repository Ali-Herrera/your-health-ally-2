import { Box, Button, Flex, Space } from '@mantine/core';
import { theme } from '../config/theme';

type Props = {
  onStartNewChat: () => void;
};

export const Sidebar = ({ onStartNewChat }: Props) => {
  const { colors } = theme;

  return (
    <Flex
      justify='flex-start'
      align='center'
      direction='column'
      sx={{
        margin: '0',
        padding: '10px',
        position: 'fixed',
        width: '250px',
        height: '100%',
        zIndex: 20,
        top: '0',
        left: '0',
        overflowX: 'hidden',
        backgroundColor: colors?.darkPink?.[6],
      }}
    >
      <Space h='lg' />
      <Box h={100} sx={{ borderBottom: colors?.darkPink?.[9] }}>
        {/* Add the onStartNewChat prop to the Button component */}
        <Button onClick={onStartNewChat}>Start New Chat</Button>
      </Box>
    </Flex>
  );
};
