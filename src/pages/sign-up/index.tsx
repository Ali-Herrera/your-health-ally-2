import { SignUp } from '@clerk/nextjs';
import { Box } from '@mantine/core';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Health Ally - Sign Up',
};

export default function SignUpPage() {
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
        <SignUp appearance={{ variables: { colorPrimary: '#036c5f' } }} />
      </div>
    </Box>
  );
}
