import { Box, Group, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Welcome } from '../components/Welcome';
import { Sidebar } from '../components/sidebar';
import { Header } from '~/components/header';
import { HeaderMobile } from '~/components/header/mobileHeader';
import { Footer } from '~/components/footer';
import { ChatContent, type ChatItem } from '../components/chat/ChatContent';
import { ChatInput } from '../components/chat/ChatInput';
import { api } from '~/utils/api';
import React, { useState, useEffect, useRef } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { theme } from '~/config/theme';
import styles from './index.module.css';
import { set } from 'zod';

export default function Home() {
  const mobileScreen = useMediaQuery('(max-width: 480px)');

  const { black, colors } = theme;

  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [waiting, setWaiting] = useState<boolean>(false);

  const generatedTextMutation = api.ai.generateText.useMutation({
    onSuccess: (data) => {
      setChatItems([
        ...chatItems,
        {
          content: data.generatedText,
          author: 'AI',
        },
      ]);
    },

    onError: (error) => {
      setChatItems([
        ...chatItems,
        {
          content: error.message ?? 'An error occurred',
          author: 'AI',
          isError: true,
        },
      ]);
    },

    onSettled: () => {
      setWaiting(false);
    },
  });

  const resetMutation = api.ai.reset.useMutation();

  const handleUpdate = (prompt: string) => {
    setWaiting(true);

    setChatItems([
      ...chatItems,
      {
        content: prompt.replace(/\n/g, '\n\n'),
        author: 'User',
      },
    ]);

    console.log('User sent a message:', prompt);
    console.log('Before calling mutate:', chatItems);
    console.log('Prompt value:', prompt);

    generatedTextMutation.mutate({ prompt });

    console.log('After calling mutate:', chatItems);
  };
  const handleReset = () => {
    setChatItems([]);
    resetMutation.mutate();
  };

  const [needDictionary, setNeedDictionary] = useState<boolean>(false);
  const [word, setWord] = useState('');
  const [textDefinition, setTextDefinition] = useState('');
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const getDictionary = async (text: string) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`
      );
      const data = await response.json();
      if (!data) {
        setTextDefinition(
          'Hmm. No definition found. You can try again at later time or head to the web instead.'
        );
      }

      const definedText = data[0].meanings.map(
        (info: {
          partOfSpeech: string;
          definitions: Array<{ definition: string }>;
        }) => {
          const partOfSpeech = info.partOfSpeech;
          const styledPartOfSpeech =
            partOfSpeech.charAt(0).toUpperCase() + partOfSpeech.slice(1);
          const definition = info.definitions?.map((item) => item.definition);
          return `${styledPartOfSpeech} - ${definition}`;
        }
      );

      setWord(text.toUpperCase());
      setTextDefinition(definedText.join('; '));
    } catch (error) {
      console.error('Error fetching definition: ', error);
      setTextDefinition(
        'Whoops! Error fetching definition. You can try again at later time or head to the web instead.'
      );
    }
  };

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      event.preventDefault();

      if (tooltipRef.current) {
        const tooltip = tooltipRef.current;
        const selection = window.getSelection();

        if (selection?.isCollapsed || selection == null) {
          setNeedDictionary(false);
          return;
        }

        const selectedText = selection.toString().trim();
        getDictionary(selectedText);
        if (selectedText.length < 1) {
          setNeedDictionary(false);
          return;
        }
        setNeedDictionary(true);
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        tooltip.style.display = 'block';
        // Calculate the left and top positions of the tooltip
        let left = rect.left + rect.width / 2 - tooltip.clientWidth / 2;
        let top = rect.top - tooltip.clientHeight;

        if (left < 0) {
          left = 10; // 10px from the left side of the viewport
        }

        if (left + tooltip.clientWidth > window.innerWidth) {
          left = window.innerWidth - tooltip.clientWidth - 10; // 10px from the right side of the viewport
        }

        if (top < 0) {
          top = rect.bottom;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      setNeedDictionary(false);
      setTextDefinition('');
      setWord('');
    };
  }, []);
  const { isLoaded, user } = useUser();
  return (
    <Box>
      {isLoaded && !user && (
        <Box>
          <Welcome />
          <Group className='h-screen'>
            <UserButton afterSignOutUrl='/' />
          </Group>
        </Box>
      )}

      {isLoaded && user && (
        <Box>
          <div
            ref={tooltipRef}
            style={{
              position: 'absolute',
              zIndex: 5000,
              backgroundColor: 'white',
              borderRadius: '5px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              display: 'none',
              width: '40vw',
              maxWidth: '800px',
              visibility: needDictionary ? 'visible' : 'hidden',
            }}
          >
            <div className={styles.scrollArea}>
              <div className={styles.signup_header}>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    margin: '10px',
                    color: '#1a1910',
                    fontWeight: 'bold',
                  }}
                >
                  {word}
                </p>
              </div>
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  margin: '10px',
                  color: '#1a1910',
                }}
              >
                {textDefinition}
              </p>
            </div>
          </div>

          {mobileScreen ? <HeaderMobile onReset={handleReset} /> : <Header />}
          {mobileScreen ? null : <Sidebar onReset={handleReset} />}
          <ChatContent
            chatItems={chatItems}
            onReset={handleReset}
            loading={waiting}
          />
          <ChatInput onUpdate={handleUpdate} waiting={waiting} />
          <Footer />
        </Box>
      )}
    </Box>
  );
}
