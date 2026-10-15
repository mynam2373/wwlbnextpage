import { sanityClient } from '../../sanityClient';
import AlternatePageClient from './AlternatePageClient';

export const revalidate = 60;

const ALTERNATE_MODE_QUERY = `{
  "firstPoem": *[_type == "fragmento" && orden == 1][0]{
    titulo,
    "audioVolume": coalesce(volumenAudioPoema, 100),
    "audioUrl": audioPoema.asset->url,
    "imageUrl": ilustracion.asset->url,
    "imageAlt": ilustracion.alt
  },
  "audioTracks": *[_type == "globalAudio" && _id == "globalAudio"][0].pistas[]{
    _key,
    nombre,
    tipo,
    eventos,
    volumen,
    "url": archivo.asset->url
  }
}`;

export default async function AlternatePage() {
  const { firstPoem, audioTracks } = await sanityClient.fetch(ALTERNATE_MODE_QUERY);

  return <AlternatePageClient firstPoem={firstPoem} audioTracks={audioTracks ?? []} />;
}
