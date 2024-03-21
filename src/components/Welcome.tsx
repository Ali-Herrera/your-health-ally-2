import Link from 'next/link';
import Image from 'next/image';
import { Box, Button, Space, Title, Text } from '@mantine/core';
import { theme } from '../config/theme';
import GreenLogo from '../../public/logo/logo-green.png';
import { useMediaQuery } from '@mantine/hooks';
// import WelcomeImg from '../../public/images/unsplashphoto-welcome.jpg';
// image org size = 6000x4000

export function Welcome() {
  const mobileScreen = useMediaQuery('(max-width: 482px)');

  // Deconstruct theme object
  const { colors, white, black } = theme;

  return (
    <Box
      p='xl'
      lh={1.5}
      style={{
        height: '100vh',
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'column',
        backgroundColor: white,
      }}
    >
      <Image
        src={GreenLogo}
        alt='Your Health Ally Logo'
        //Original Size 1920 by 1080...Reduced 20% of original size)
        width={384}
        height={212.6}
      />

      <Space h='md' />
      <Title order={2} size='h3' c={black} mb='lg'>
        Your Voice Matters. Your Health Matters.
      </Title>
      <br />
      <Text c={black} size='xl' fw={500}>
        At Your Health Ally, we are here to empower you to take control of your
        health. Your concerns are valid, and your voice should be heard.
      </Text>
      <Space h='md' />
      <Text c={black} size='xl' fw={500}>
        We provide the resources and support you need to navigate your health
        with confidence.
      </Text>
      <Space h='md' />
      <Box>
        <Link href='/sign-in'>
          <Button
            mt='lg'
            variant='filled'
            color={colors?.teal?.[6]}
            size='lg'
            radius='lg'
          >
            Get Started
          </Button>
        </Link>
      </Box>
      <Box pos='fixed' style={{ bottom: '20px' }}>
        <Text c={black} m='xs' style={{ fontSize: '10px' }}>
          © YOUR HEALTH ALLY {new Date().getFullYear()}
        </Text>
        <Text c={black} fs='italic' m='xs' style={{ fontSize: '10px' }}>
          This is not medical advice. This is for educational purposes only.
          Please see your healthcare provider for medical treatment.
        </Text>
      </Box>
    </Box>
  );
}
