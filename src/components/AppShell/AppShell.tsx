import React, { useState } from 'react';
import { useGame } from '../../game/GameContext';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ContextPanel } from './ContextPanel';
import { MailView } from '../../modules/mail/MailView';
import { FilesView } from '../../modules/files/FilesView';
import { CalendarView } from '../../modules/calendar/CalendarView';
import { ContactsView } from '../../modules/contacts/ContactsView';

export const AppShell: React.FC = () => {
  const { activeModule } = useGame();

  // Navigation states for sub-views
  const [currentMailFolderId, setCurrentMailFolderId] = useState<string>('inbox');
  const [currentDriveFolderId, setCurrentDriveFolderId] = useState<string | null>(null);
  const [driveFilterMode, setDriveFilterMode] = useState<'all' | 'recent' | 'shared' | 'trash'>('all');
  const [calendarViewMode, setCalendarViewMode] = useState<'day' | 'week' | 'month' | 'agenda'>('week');
  const [contactsFilterMode, setContactsFilterMode] = useState<'all' | 'favorites' | 'duplicates'>('all');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Application Bar */}
      <TopBar />

      {/* Main 3-Zone Workspace */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <Sidebar
          currentMailFolderId={currentMailFolderId}
          onSelectMailFolder={setCurrentMailFolderId}
          currentDriveFolderId={currentDriveFolderId}
          onSelectDriveFolder={setCurrentDriveFolderId}
          driveFilterMode={driveFilterMode}
          onSelectDriveFilterMode={setDriveFilterMode}
          calendarViewMode={calendarViewMode}
          onSelectCalendarViewMode={setCalendarViewMode}
          contactsFilterMode={contactsFilterMode}
          onSelectContactsFilterMode={setContactsFilterMode}
        />

        {/* Central Workspace Zone */}
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' }}>
          {activeModule === 'mail' && <MailView currentFolderId={currentMailFolderId} />}
          {activeModule === 'files' && (
            <FilesView
              currentFolderId={currentDriveFolderId}
              onSelectFolder={setCurrentDriveFolderId}
              filterMode={driveFilterMode}
            />
          )}
          {activeModule === 'calendar' && (
            <CalendarView
              viewMode={calendarViewMode}
              onChangeViewMode={setCalendarViewMode}
            />
          )}
          {activeModule === 'contacts' && (
            <ContactsView filterMode={contactsFilterMode} />
          )}
        </main>

        {/* Right Contextual Panel */}
        <ContextPanel />
      </div>
    </div>
  );
};

