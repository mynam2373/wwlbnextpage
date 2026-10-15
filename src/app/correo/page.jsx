import App from '../App';
import { getAppData } from '../getAppData';

export const dynamic = 'force-dynamic';

export default async function CorreoRoute() {
  const {
    settings,
    volumes,
    mailboxSubmissions,
    globalAudio,
    imageLibrary,
    isMailboxAdmin,
    mailboxAdminConfigured,
  } = await getAppData();

  return (
    <App
      initialTab="correo"
      novelSettings={settings}
      volumes={volumes}
      mailboxSubmissions={mailboxSubmissions}
      globalAudio={globalAudio}
      imageLibrary={imageLibrary}
      isMailboxAdmin={isMailboxAdmin}
      mailboxAdminConfigured={mailboxAdminConfigured}
    />
  );
}
