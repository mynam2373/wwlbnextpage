import App from '../App';
import { getNovelData } from '../getNovelData';

export const dynamic = 'force-dynamic';

export default async function NovelPage() {
  const {
    settings,
    volumes,
    mailboxSubmissions,
    isMailboxAdmin,
    mailboxAdminConfigured,
  } = await getNovelData();

  return (
    <App
      initialTab="novela"
      novelSettings={settings}
      volumes={volumes}
      mailboxSubmissions={mailboxSubmissions}
      isMailboxAdmin={isMailboxAdmin}
      mailboxAdminConfigured={mailboxAdminConfigured}
    />
  );
}
