import { SignIn } from '@clerk/nextjs';
import { Box } from '@mantine/core';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Health Ally - Sign In',
};

export default function SignInPage() {
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div>
        <SignIn appearance={{ variables: { colorPrimary: '#036c5f' } }} />
      </div>
    </Box>
  );
}
