import { Button, Group, Textarea, Loader } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { theme } from '~/config/theme';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

type Props = {
  onUpdate: (prompt: string) => void;
  waiting?: boolean;
};

export const ChatInput = ({ onUpdate, waiting }: Props) => {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, { toggle }] = useDisclosure();
  const [rows, setRows] = useState<number>(2);

  useEffect(() => {
    const lines = prompt.split(/\r*\n/).length;
    setRows(Math.max(2, Math.min(lines, 8)));
  }, [prompt]);

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
        disabled={waiting}
        rows={rows}
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
        disabled={waiting}
      >
        <IconSend size={20} style={{ bottom: '5px', alignSelf: 'center' }} />
      </Button>
    </Group>
  );
};
