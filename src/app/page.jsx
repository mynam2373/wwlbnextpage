import App from './App';
import { getNovelData } from './getNovelData';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const {
    settings,
    volumes,
    mailboxSubmissions,
    isMailboxAdmin,
    mailboxAdminConfigured,
  } = await getNovelData();

  return (
    <App
      initialTab="inicio"
      novelSettings={settings}
      volumes={volumes}
      mailboxSubmissions={mailboxSubmissions}
      isMailboxAdmin={isMailboxAdmin}
      mailboxAdminConfigured={mailboxAdminConfigured}
    />
  );
}
