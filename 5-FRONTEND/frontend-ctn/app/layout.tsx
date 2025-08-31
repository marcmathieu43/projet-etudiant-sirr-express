import './globals.css';
import { ReactNode } from 'react';
import { SecureProvider } from '../context/SecureContext';

export const metadata = {
  title: 'Projet Étudiant - Marc MATHIEU',
  description: 'contexte',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body>
        <SecureProvider>
          {children}
        </SecureProvider>
      </body>
    </html>
  );
}
