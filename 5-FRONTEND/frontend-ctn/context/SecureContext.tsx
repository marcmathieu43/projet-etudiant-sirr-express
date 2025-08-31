'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type SecureContextType = {
  cleBrute: Uint8Array | null;
  cleBase64: string | null;
  setCleBrute: (key: Uint8Array) => void;
  setCleBase64: (key: string) => void;
};

const SecureContext = createContext<SecureContextType | undefined>(undefined);

export const SecureProvider = ({ children }: { children: ReactNode }) => {
  const [cleBrute, setCleBrute] = useState<Uint8Array | null>(null);
  const [cleBase64, setCleBase64] = useState<string | null>(null);

  return (
    <SecureContext.Provider value={{ cleBrute, cleBase64, setCleBrute, setCleBase64 }}>
      {children}
    </SecureContext.Provider>
  );
};

export const contexteTransmissionCle = (): SecureContextType => {
  const context = useContext(SecureContext);
  if (!context) {
    throw new Error('pblm secure context');
  }
  return context;
};
