import { sanityClient } from '../sanityClient';
import { hasMailboxAdminSession, mailboxAdminIsConfigured } from './data/mailboxServer';

export async function getNovelData() {
  const query = `{
    "settings": *[_type == "novelSettings"][0]{
      title,
      subtitle,
      aboutTitle,
      aboutContent,
      settingTitle,
      settingContent,
      image{asset->{_id, url, metadata{dimensions}}, alt, caption},
      images[]{_key, asset->{_id, url, metadata{dimensions}}, alt, caption}
    },
    "volumes": *[_type == "volume"] | order(number asc) {
      _id,
      title,
      number,
      volumeId,
      tag,
      premise,
      conflict,
      climax,
      summary,
      content,
      image{asset->{_id, url, metadata{dimensions}}, alt, caption},
      images[]{_key, asset->{_id, url, metadata{dimensions}}, alt, caption}
    },
    "mailboxSubmissions": *[_type == "mailSubmission"] | order(submittedAt desc){
      _id,
      author,
      message,
      submittedAt,
      attachment{asset->{_id, url, metadata{dimensions}}, alt},
      reply,
      repliedAt,
      replyImage{asset->{_id, url, metadata{dimensions}}, alt}
    }
  }`;

  const [data, isMailboxAdmin] = await Promise.all([
    sanityClient.fetch(query),
    hasMailboxAdminSession(),
  ]);

  if (!data || !Array.isArray(data.volumes)) {
    throw new Error('Sanity devolvió una respuesta inválida para la página de novela.');
  }

  return {
    ...data,
    isMailboxAdmin,
    mailboxAdminConfigured: mailboxAdminIsConfigured(),
  };
}
