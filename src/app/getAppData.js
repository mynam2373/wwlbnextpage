import { sanityClient } from '../sanityClient';
import { hasMailboxAdminSession, mailboxAdminIsConfigured } from './data/mailboxServer';

export async function getAppData() {
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
    },
    "globalAudio": *[_type == "globalAudio" && _id == "globalAudio"][0]{
      "pistas": pistas[]{
        _key,
        nombre,
        tipo,
        eventos,
        volumen,
        "url": archivo.asset->url
      }
    },
    "imageLibrary": *[_type == "siteImage"] | order(name asc){
      _id,
      name,
      "url": image.asset->url
    }
  }`;

  const [data, isMailboxAdmin] = await Promise.all([
    sanityClient.fetch(query),
    hasMailboxAdminSession(),
  ]);

  if (!data || !Array.isArray(data.volumes)) {
    throw new Error('Sanity devolvió una respuesta inválida para los datos de la aplicación.');
  }

  return {
    ...data,
    isMailboxAdmin,
    mailboxAdminConfigured: mailboxAdminIsConfigured(),
  };
}
