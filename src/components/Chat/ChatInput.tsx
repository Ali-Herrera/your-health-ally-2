import { Button, Group, Space, Textarea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSend } from '@tabler/icons-react';
import { theme } from '../../config/theme';
import { useState, useEffect } from 'react';

type Props = {
  onUpdate: (prompt: string) => void;
  waiting?: boolean;
};

export const ChatInput = ({ onUpdate, waiting }: Props) => {
  const mobileScreen = useMediaQuery('(max-width: 480px)');
  const { colors } = theme;

  const [prompt, setPrompt] = useState<string>('');
  const [rows, setRows] = useState<number>(2);

  useEffect(() => {
    const lines = prompt.split(/\r*\n/).length;
    setRows(Math.max(2, Math.min(lines, 8)));
  }, [prompt]);

  const handleUpdate = () => {
    if (!prompt.trim()) {
      onUpdate(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if Enter key is pressed without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      handleUpdate(); // Call handleUpdate function
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
        size='sm'
        radius='md'
        aria-label='Send message'
        sx={{
          backgroundColor: colors?.darkPink?.[6],
        }}
        onClick={handleUpdate}
        disabled={waiting || !prompt.trim()}
      >
        <IconSend size={20} style={{ bottom: '5px', alignSelf: 'center' }} />
      </Button>
    </Group>
  );
};
