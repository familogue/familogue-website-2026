import { siteConfig } from "@/utils/site-config";
import { getTranslations } from "next-intl/server";
import type { FC } from 'react';
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "src/_icons";
import { Link } from "src/i18n/navigation";
import LocaleSwitcher from "./locale-switcher";

export const Footer: FC = async () => {
  /**
   * Footer navigation items with translations.
   */
  const tNav = await getTranslations('Navigation');
  const footerItems: { title: string, route: string, cta?: boolean; }[] = [
    { title: tNav('home'), route: '/' },
    { title: tNav('news'), route: '/news' },
    { title: tNav('services'), route: '/our-services' },
    // { title: tNav('classes-and-events'), route: '/classes-and-events' },
    { title: tNav('support-us'), route: '/support-us' },
    { title: tNav('about-us'), route: '/about-us' },
    // { title: tNav('member'), route: '/member' },
  ];

  const tFooter = await getTranslations('Footer');

  return (
    <footer className="x-global-footer">
      <div className="x-row">
        <div className="x-col1">
          <h4>{siteConfig.name}</h4>
          <p className="text-muted-foreground">{tFooter('description')}</p>
          <p></p>
        </div>
        <div className="x-col2">
          {footerItems.map(item => {
            const route = item.route;
            return (
              <p key={route}>
                <Link href={route}>
                  {item.title}
                </Link>
              </p>
            );
          })}
          <p>
            <LocaleSwitcher />
          </p>
        </div>
        <div className="x-col3">
          <h4>{tNav('contact-us')}</h4>
          <p><Link href="https://www.facebook.com/Familogue" target="_blank" rel="noopener noreferrer"><FacebookIcon />Facebook</Link></p>
          <p><Link href="https://www.instagram.com/familogue" target="_blank" rel="noopener noreferrer"><InstagramIcon />Instagram</Link></p>
          <p><Link href="https://www.youtube.com/@familogue" target="_blank" rel="noopener noreferrer"><YouTubeIcon /> YouTube</Link></p>
          <p>{tNav('telephone')}: <Link href="tel:+17788070211">+1 (778) 807-0211</Link></p>
          <p>{tNav('email')}: <Link href="mailto:info@familogue.ca">info@familogue.ca</Link></p>
          <p>Primary Site (Richmond Service Centre): <Link href="https://maps.app.goo.gl/wopnafQpovYgxuBH6" target="_blank" rel="noopener noreferrer">8181 Cambie Rd. Unit 5530, Richmond, BC V6X 1J8</Link></p>
          <p>Satellite Site (Every Saturday): <Link href="https://maps.app.goo.gl/Nzo5ehY8aTSwdugM6" target="_blank" rel="noopener noreferrer">8506 Ash Street, Vancouver, BC V6P 3M2</Link></p>
        </div>
      </div>
      <div className="text-center mt-8 text-muted-foreground">
        <span className="x-author">{new Date().getFullYear()} © {siteConfig.name}.</span>
        {' '}
        All rights reserved.
      </div>
    </footer >
  );
};