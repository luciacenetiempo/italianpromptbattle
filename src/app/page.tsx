import HomeClient from './components/HomeClient';

export const metadata = {
  title: "Italian Prompt Battle – La sfida creativa italiana",
  description: "Partecipa all'Italian Prompt Battle: la prima competizione italiana dedicata alla creatività con l'AI. Scopri, impara, sfida e vinci!",
  openGraph: {
    title: "Italian Prompt Battle – La sfida creativa italiana",
    description: "Partecipa all'Italian Prompt Battle: la prima competizione italiana dedicata alla creatività con l'AI. Scopri, impara, sfida e vinci!",
    images: ["/assets/images/og-image.jpg"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Italian Prompt Battle – La sfida creativa italiana",
    description: "Partecipa all'Italian Prompt Battle: la prima competizione italiana dedicata alla creatività con l'AI. Scopri, impara, sfida e vinci!",
    images: ["/assets/images/og-image.jpg"]
  }
};

export default function Home() {
  return <HomeClient />;
}
