
'use client';

import { SessionProvider } from 'next-auth/react';
import { DevelopmentModeProvider } from '@/contexts/development-mode-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DevelopmentModeProvider>
        {children}
      </DevelopmentModeProvider>
    </SessionProvider>
  );
}
