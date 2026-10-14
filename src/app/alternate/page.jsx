import { sanityClient } from '../../sanityClient';
import AlternatePageClient from './AlternatePageClient';

export const revalidate = 60;

const FIRST_POEM_QUERY = `*[_type == "fragmento" && orden == 1][0]{
  titulo,
  "audioUrl": audioPoema.asset->url,
  "imageUrl": ilustracion.asset->url,
  "imageAlt": ilustracion.alt
}`;

export default async function AlternatePage() {
  const firstPoem = await sanityClient.fetch(FIRST_POEM_QUERY);

  return <AlternatePageClient firstPoem={firstPoem} />;
}
