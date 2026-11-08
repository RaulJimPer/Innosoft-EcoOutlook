import React from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { WelcomeView } from '../components/WelcomeView/WelcomeView';
import { AppShell } from '../components/AppShell/AppShell';
import { ResultsView } from '../components/ResultsView/ResultsView';
import { ConfirmDialog } from '../components/ConfirmDialog/ConfirmDialog';
import { ToastContainer } from '../components/Toast/ToastContainer';

const MainRouter: React.FC = () => {
  const { session } = useGame();

  switch (session.status) {
    case 'welcome':
      return <WelcomeView />;
    case 'active':
      return <AppShell />;
    case 'results':
      return <ResultsView />;
    default:
      return <WelcomeView />;
  }
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <MainRouter />
      <ConfirmDialog />
      <ToastContainer />
    </GameProvider>
  );
};

