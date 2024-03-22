import { Button, Group, Textarea } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { theme } from '~/config/theme';
import { useState } from 'react';

type Props = {
  onUpdate: (prompt: string) => void;
};

export const ChatInput = ({ onUpdate }: Props) => {
  const [prompt, setPrompt] = useState<string>('');

  const handleUpdate = () => {
    setPrompt('');
    onUpdate(prompt);
  };

  const { colors } = theme;
  return (
    <Group justify='center'>
      <Textarea
        placeholder='What questions do you have?'
        aria-label='Type your message here'
        radius='md'
        style={{
          width: '90%',
        }}
        value={prompt}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleUpdate();
          }
        }}
      />
      <Button
        color={colors?.darkPink?.[3]}
        size='sm'
        radius='xl'
        justify='center'
        p={0}
        aria-label='Send message'
        style={{
          width: '5%',
        }}
        onClick={handleUpdate}
      >
        <IconSend size={20} style={{ bottom: '5px', alignSelf: 'center' }} />
      </Button>
    </Group>
  );
};
