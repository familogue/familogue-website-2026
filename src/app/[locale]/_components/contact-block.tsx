import { TextLink } from "@/components/ui/link";
import { bcp47For } from "@/utils/alternates";
import { contactInfo, type DayOfWeek, type OpeningHoursGroup } from "@/utils/contact-info";
import { getTranslations } from "next-intl/server";
import type { FC } from "react";

/**
 * Order used to detect whether a group of days is a contiguous run (so it
 * can be shown as "Tuesday – Friday" rather than every day spelled out).
 * Deliberately does not wrap past Sunday — a Sunday/Monday group is treated
 * as non-contiguous and listed with a comma instead, which matches how
 * people actually read a "closed" line.
 */
const DAY_ORDER: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_KEYS: Record<DayOfWeek, string> = {
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday",
  Sunday: "sunday",
};

function isContiguous(days: DayOfWeek[]): boolean {
  if (days.length <= 1) return true;
  const indices = days.map((d) => DAY_ORDER.indexOf(d));
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] !== indices[i - 1] + 1) return false;
  }
  return true;
}

function formatDayLabel(
  days: DayOfWeek[],
  tDays: (key: string) => string,
  locale: string
): string {
  const names = days.map((d) => tDays(DAY_KEYS[d]));
  if (names.length === 1) return names[0];
  if (isContiguous(days)) return `${names[0]} – ${names[names.length - 1]}`;
  // Separator differs by language — English wants ", " where Chinese wants the
  // enumeration comma "、", so let Intl pick rather than hardcoding either.
  // narrow/conjunction is the one pairing correct in both: other combinations
  // either drop the separator in Chinese or spell out "and".
  return new Intl.ListFormat(bcp47For(locale), {
    style: "narrow",
    type: "conjunction",
  }).format(names);
}

/**
 * Times are stored as plain 24-hour strings in `contact-info.ts` (not
 * pre-formatted per locale) so this is the single place that turns "11:00"
 * into "11:00 a.m." for English or "上午11:00" for Chinese, via
 * `Intl.DateTimeFormat` rather than a hand-maintained translation table.
 */
function formatTime(time: string, locale: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(Date.UTC(2000, 0, 1, hours, minutes));
  return new Intl.DateTimeFormat(bcp47For(locale), {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

function HoursRow({
  group,
  locale,
  tDays,
  tContact,
}: {
  group: OpeningHoursGroup;
  locale: string;
  tDays: (key: string) => string;
  tContact: (key: string) => string;
}) {
  return (
    <div className="flex flex-row justify-between gap-4">
      <dt className="text-muted-foreground">{formatDayLabel(group.days, tDays, locale)}</dt>
      <dd className="m-0 font-medium">
        {group.closed
          ? tContact("closed")
          : `${formatTime(group.opens, locale)} – ${formatTime(group.closes, locale)}`}
      </dd>
    </div>
  );
}

export const ContactBlock: FC<{ locale: string }> = async ({ locale }) => {
  const tNav = await getTranslations("Navigation");
  const tContact = await getTranslations("Contact");
  const tDays = await getTranslations("Days");

  const siteLabel = { richmond: tContact("primarySite"), vancouver: tContact("satelliteSite") };

  return (
    <section className="mt-20">
      <h2 className="x-section-heading">{tNav("contact-us")}</h2>
      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div>
          <p>
            <TextLink href={`tel:${contactInfo.phone.e164}`}>
              {contactInfo.phone.display}
            </TextLink>
          </p>
          <p>
            <TextLink href={`mailto:${contactInfo.email}`}>{contactInfo.email}</TextLink>
          </p>
          <p>
            <TextLink href={contactInfo.whatsappUrl} external>
              {tContact("whatsapp")}
            </TextLink>
          </p>
        </div>
        {contactInfo.locations.map((location) => (
          <div key={location.key}>
            <h3 className="text-lg font-semibold">{siteLabel[location.key]}</h3>
            <p>
              <TextLink href={location.mapsUrl} external>
                {location.displayAddress}
              </TextLink>
            </p>
            {location.openingHours && (
              <dl className="mt-2 flex flex-col gap-1 text-sm">
                <div className="font-semibold">{tContact("hours")}</div>
                {location.openingHours.map((group, index) => (
                  <HoursRow
                    key={index}
                    group={group}
                    locale={locale}
                    tDays={tDays}
                    tContact={tContact}
                  />
                ))}
              </dl>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
