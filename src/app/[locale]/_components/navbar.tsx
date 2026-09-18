import { Button } from "@/components/ui/button";
import { contactInfo } from "@/utils/contact-info";
import { getTranslations } from "next-intl/server";
import { type FC } from 'react';
import { Link } from "src/i18n/navigation";
import LocaleSwitcher from "./locale-switcher";

export const Navbar: FC<{ lang: 'en' | 'zh'; }> = async ({ lang }) => {
  const t = await getTranslations('Navigation');

  const topLevelNavbarItems: { title: string, route: string, cta?: boolean; }[] = [
    { title: t('news'), route: '/news' },
    { title: t('services'), route: '/our-services' },
    // { title: t('classes-and-events'), route: '/classes-and-events' },
    { title: t('support-us'), route: '/support-us' },
    { title: t('about-us'), route: '/about-us' },
    // { title: t('member'), route: '/member', cta: true },
  ];

  return (
    <nav role="menu" className="x-top-nav">
      <Link role="menuitem" href="/" className="x-main-link" rel="author">
        Familogue 語你童行
      </Link>
      <ul role="menu" className="x-menu">
        <li>
          <LocaleSwitcher />
        </li>
        {topLevelNavbarItems.map(item => {
          const route = item.route;
          return (
            <li key={route}>
              <Link href={route}>
                {item.title}
              </Link>
            </li>
          );
        })}
        <li>
          <a href={`tel:${contactInfo.phone.e164}`} className="text-sm text-link hover:text-link-hover">
            {contactInfo.phone.display}
          </a>
        </li>
        <li>
          {/* `no-underline!` overrides `.x-top-nav a`, which would otherwise
              underline this on hover — wrong for a solid button. */}
          <Button asChild variant="accent" size="sm" className="no-underline!">
            <Link href="/donate">{t('donate')}</Link>
          </Button>
        </li>
      </ul>
    </nav >
  );
};