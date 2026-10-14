import App from '../App';
import { getNovelData } from '../getNovelData';

export const dynamic = 'force-dynamic';

export default async function CorreoRoute() {
  const {
    settings,
    volumes,
    mailboxSubmissions,
    isMailboxAdmin,
    mailboxAdminConfigured,
  } = await getNovelData();

  return (
    <App
      initialTab="correo"
      novelSettings={settings}
      volumes={volumes}
      mailboxSubmissions={mailboxSubmissions}
      isMailboxAdmin={isMailboxAdmin}
      mailboxAdminConfigured={mailboxAdminConfigured}
    />
  );
}
