import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Page() {
  const t = useTranslations('AboutUs');
  return (
    <div className="x-container prose">
      <h1>{t("title")}</h1>
      <section className="flex flex-col sm:flex-row items-center justify-center text-xl sm:gap-8">
        <Image src="/familogue-icon.png" alt="Familogue Logo" width={200} height={200} />
        <div className="flex flex-col gap-3">
          <div><span className="text-amber-500">Family</span> + <span className="text-emerald-500">Dialogue</span></div>
          <div><span>語</span> = <span>Language</span></div>
          <div>
            <span>你</span> = <span className="text-stone-400">Our team of experienced educators</span> and <span className="text-amber-500">parents</span> / <br />
            <span className="text-amber-500">parents</span> and <span className="text-emerald-500">children</span></div>
          <div><span>童行</span> = Embarking on a journey with <span className="text-amber-500">parents</span> and <span className="text-emerald-500">children</span></div>
        </div>
      </section>
      <section>
        <h2>Background</h2>
        <p>
          We are experienced educators and immigrant mothers from Hong Kong now based in Vancouver, Canada. We established "Familogue" in 2022 to help parents and children communicate more effectively by transferring mother tongue skills into other abilities such as written language, second/third languages, social and cognitive skills. Through workshops and seminars, we aim to be a bridge between parents and their children, enabling them to improve and learn together in a familiar context like home.
        </p>
        <p>
          According to UNESCO, mother tongue-based education should start early as it is the foundation of multilingual education. Sweden also found that strong proficiency in mother tongue leads to natural development of other language abilities.
        </p>
        <p>
          Parents using their mother tongue to communicate with their children improves family communication, especially with grandparents who may not speak foreign languages. A University of Washington study found that the mother tongue must be applied in real-life situations to be effective. We are experienced educators and mothers who immigrated to an English-speaking country and hope to help parents and children develop their mother tongue ability to improve communication and growth together.
        </p>
        <h2>Our Goal</h2>
        <p>
          As you may have noticed, our logo has two bubble elements, one representing the big bubble of the parent - Mommy Lingo, and the other representing the child - Kiddo.
        </p>
      </section>
      <section className="flex flex-col sm:flex-row items-center justify-center text-2xl sm:gap-4">
        <div className="text-right text-yellow-800">Mommy Lingo<br />(Parents)</div>
        <div className="h-[200px] flex items-center overflow-hidden">
          <Image src="/logo.svg" alt="Familogue Logo" width={300} height={300} />
        </div>
        <div className="text-amber-500">Kiddo (Children)</div>
      </section>
      <section>
        <h2>Founding Members</h2>
        <h3>Dr Fay Wong - PhD in Education</h3>
        <p>
          Dr. Fay, who holds a PhD in Education and has experience in bilingualism, language acquisition, and special education, as well as teacher training and parent education.
        </p>
        <h3>Ms Shek - BC Licensed Early Childhood &amp; Special Needs Educator (ECEBC, SNEBC)</h3>
        <p>
          Registered Early Childhood Educator in British Columbia who has worked in early childhood education for many years and also participated in a bilingual education program for deaf students at the Chinese University of Hong Kong.
        </p>
        <h3>Ms Florence Kwok - BC registered Speech-Language Pathologist, RSLP(CSHBC)</h3>
        <p>
          Registered Speech-Language Pathologist with over 10 years of experience in the field, who aims to work alongside parents using her professional knowledge.
        </p>
        <h3>Ms Felicia Cheung - BC Certified Teacher</h3>
        <p>
          Senior high school teacher and special education coordinator in Hong Kong with 20 years of teaching experience, who believes that every individual has unique potential.
        </p>
        <h3>Ms Wymen Ng - Seasoned Marketer</h3>
        <p>
          Seasoned marketing professional with experience in branding, public relations, corporate communications, advertising, and business development, who has also received training from 故事爸媽 and volunteered as a teacher assistant in schools.
        </p>
      </section>
      <hr />
      <section>
        <h2>Review Bylaws and Constitution of Familogue</h2>
        <ul>
          <li><a target="_blank" href="/assets/bylaws.pdf">Bylaws</a></li>
          <li><a target="_blank" href="/assets/constitution_2026_mar.pdf">Constitution (2026 March)</a></li>
        </ul>
      </section>
    </div >
  );
};
