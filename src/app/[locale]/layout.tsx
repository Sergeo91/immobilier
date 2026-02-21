import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Header } from '@/components/Header';
import { SetLocaleAttributes } from '@/components/SetLocaleAttributes';
import { Footer } from '@/components/Footer';
import { routing } from '@/i18n/routing';

type Props = { children: React.ReactNode; params: { locale: string } };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <SetLocaleAttributes locale={locale} />
      <ThemeProvider>
        <AuthProvider>
          <Header />
          <main className="container mx-auto px-4 py-6">{children}</main>
          <Footer />
          <ToastContainer position="bottom-right" theme="colored" />
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
