import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Page() {
  const t = useTranslations();
  return (
    <div className="x-container prose">
      <h1>{t("SupportUs.title")} </h1>

      <section>
        <h2>Become a Member</h2>
        <p>
          Our membership program is designed to provide parents with a supportive platform and resources to help them succeed in their children's language learning journey. By joining our membership program, you will enjoy the following benefits:
        </p>
        <ul>
          <li>
            Exclusive access to our resource library, including teaching materials, activity suggestions, and expert advice
          </li>
          <li>
            Participation in our online seminars and workshops to learn about the latest trends and techniques in language learning
          </li>
          <li>
            Connect with other parents and educators to share experiences and best practices
          </li>
          <li>
            Receive our newsletter to stay updated on the latest events and resources
          </li>
        </ul>
      </section>

      <section>
        <h2>Donate to Familogue</h2>
        <p>
          Our non-profit organization relies on community support to provide high-quality resources and services.
        </p>
        <Button asChild className="not-prose" variant="accent" size="lg"><Link href="/donate">{t("General.view_details")}</Link></Button>
      </section>

      <section>
        <h2>Volunteer with Us</h2>
        <p>
          We welcome volunteers, whether you are an educator, parent, or someone passionate about language learning. As a volunteer, you will have the opportunity to:
        </p>
        <ul>
          <li>Participate in our events and workshops, helping us provide support and resources</li>
          <li>Collaborate with other volunteers and professionals to share experiences and best practices</li>
          <li>Contribute to the community and help other families succeed in language learning</li>
        </ul>
      </section>

      <section>
        <h2>Follow Us on Social Media</h2>
        <p>Please subscribe to our social media channels to stay updated on our latest news, events, and resources:</p>
        <ul>
          <li><Link href="https://www.facebook.com/Familogue" target="_blank" rel="noopener noreferrer">Facebook</Link></li>
          <li><Link href="https://www.instagram.com/familogue" target="_blank" rel="noopener noreferrer">Instagram</Link></li>
          <li><Link href="https://www.youtube.com/@familogue" target="_blank" rel="noopener noreferrer">YouTube</Link></li>
        </ul>
      </section>
    </div>
  );
}

