import { contactInfo } from "@/utils/contact-info";
import { siteConfig } from "@/utils/site-config";
import { getTranslations } from "next-intl/server";
import type { FC } from 'react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from "src/_icons";
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
    { title: tNav('therapists'), route: '/our-therapists' },
    // { title: tNav('classes-and-events'), route: '/classes-and-events' },
    { title: tNav('support-us'), route: '/support-us' },
    { title: tNav('donate'), route: '/donate' },
    { title: tNav('volunteer'), route: '/volunteer' },
    { title: tNav('about-us'), route: '/about-us' },
    // { title: tNav('member'), route: '/member' },
  ];

  const tFooter = await getTranslations('Footer');
  const tContact = await getTranslations('Contact');
  const [richmond, vancouver] = contactInfo.locations;

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
        {/*
          Split deliberately: "contact us" is how to reach the office, "follow
          us" is where updates are published. Grouping the two under one
          heading made eight items serving two different intents, and buried
          the phone number among the social links.
        */}
        <div className="x-col3">
          <h4>{tNav('contact-us')}</h4>
          <p>{tNav('telephone')}: <Link href={`tel:${contactInfo.phone.e164}`}>{contactInfo.phone.display}</Link></p>
          <p>{tNav('email')}: <Link href={`mailto:${contactInfo.email}`}>{contactInfo.email}</Link></p>
          <p><Link href={contactInfo.whatsappUrl} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp</Link></p>
          <p>{tContact('primarySite')} ({tContact('richmondSiteName')}): <Link href={richmond.mapsUrl} target="_blank" rel="noopener noreferrer">{richmond.displayAddress}</Link></p>
          <p>{tContact('satelliteSite')} ({tContact('satelliteSchedule')}): <Link href={vancouver.mapsUrl} target="_blank" rel="noopener noreferrer">{vancouver.displayAddress}</Link></p>
        </div>
        <div className="x-col4">
          <h4>{tNav('follow-us')}</h4>
          <p><Link href={contactInfo.social.facebook} target="_blank" rel="noopener noreferrer"><FacebookIcon />Facebook</Link></p>
          <p><Link href={contactInfo.social.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon />Instagram</Link></p>
          <p><Link href={contactInfo.social.youtube} target="_blank" rel="noopener noreferrer"><YouTubeIcon /> YouTube</Link></p>
          {/* The broadcast group, not the 1:1 number above — this is where
              news is published, so it belongs with the other channels. */}
          <p><Link href={contactInfo.whatsappCommunityUrl} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />{tContact('joinWhatsappGroup')}</Link></p>
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