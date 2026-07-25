'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type PrivacyTermsType = 'privacy' | 'terms' | null;

type PrivacyTermsModalContextValue = {
  activeModal: PrivacyTermsType;
  openPrivacy: () => void;
  openTerms: () => void;
  close: () => void;
};

const PrivacyTermsModalContext = createContext<PrivacyTermsModalContextValue | undefined>(
  undefined
);

export function PrivacyTermsModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<PrivacyTermsType>(null);

  const openPrivacy = useCallback(() => setActiveModal('privacy'), []);
  const openTerms = useCallback(() => setActiveModal('terms'), []);
  const close = useCallback(() => setActiveModal(null), []);

  const value = useMemo(
    () => ({ activeModal, openPrivacy, openTerms, close }),
    [activeModal, openPrivacy, openTerms, close]
  );

  return (
    <PrivacyTermsModalContext.Provider value={value}>
      {children}
    </PrivacyTermsModalContext.Provider>
  );
}

export function usePrivacyTermsModal() {
  const ctx = useContext(PrivacyTermsModalContext);
  if (!ctx) {
    throw new Error('usePrivacyTermsModal must be used within PrivacyTermsModalProvider');
  }
  return ctx;
}
