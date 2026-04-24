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
          <div><span>語</span> = <span>語言</span></div>
          <div><span>你</span> = <span className="text-stone-400">我們一班資深教育工作者</span>與<span className="text-amber-500">家長</span> / <span className="text-amber-500">家長</span>與<span className="text-emerald-500">孩子</span></div>
          <div><span>童行</span> = <span className="text-stone-400">我們</span>與<span className="text-amber-500">家長</span>及<span className="text-emerald-500">孩子</span>結伴同行</div>
        </div>
      </section>
      <section>
        <h2>背景</h2>
        <p>
          我們是幾名來自香港的資深教育工作者，也是剛移民到加拿大溫哥華的媽媽。我們希望透過我們的專業，幫助家長和孩子在家可以更有系統地將他們的母語能力轉化成其他能力。在熟悉的語境下，家長與小朋友能更有效地溝通，一起同行與成長。故此我們於2022年成立了「語你童行Familogue」 - 卑詩省註冊非牟利團體。聯合國教科文組織指出，多元語言教育建基於母語，由於幼兒照顧及早期教育乃一生學習的基礎，該組織相信，以母語為本的教育必須及早展開。瑞典更發現，母語說得好，通用語言也發展得好。
        </p>
        <p>
          語言是孩子認知、理解能力及社交能力的基石，家長使用母語和孩子溝通除了可以增進家庭成員之間的溝通，祖父母尤其未必會說外語。此外，美國華盛頓大學研究發現，母語教育必須於實際環境溝通以及運用於情意、思想溝通，才能發揮較理想效果，聽音檔、看影片則太單向，未必能啟動孩子腦內的語言組件。
        </p>
        <p>
          溝通是建立良好親子關係的基礎，而語言在溝通中發揮了訊息傳遞的重要功用。我們幾個創會媽媽在香港從事教育工作多年，移民來到一個英語國家後，我們希望透過我們的專業，幫助家長和孩子在家可以更有系統地將他們的母語能力轉化成其他能力，包括：認知、語文、社交及其他語言等。讓他在熟悉的語境下，家長與小朋友能更有效地溝通，結伴同行與成長。
        </p>
        <h2>創立目標</h2>
        <p>
          相信大家已經注意到，我們的標誌上有兩個泡泡圖案，其中一個代表家長的大泡泡 - 語媽媽；另一個小泡泡則代表孩子 - 童童。
        </p>
        <p>
          我們創立的目標之一是透過我們的專業知識來 "empower the caregivers"，為家長加加力，令親子間的溝通更得心應手。因此，我們一群創會媽媽以自身的育兒經驗，創立了「語媽媽教室」，語媽媽小孩的年齡段從幼兒涵蓋到高中生。我們深知您所面臨的問題，因為我們也曾經歷過類似的挑戰。歡迎您與我們分享您所遭遇到的問題或有趣的經歷。我們將結合教學和教養經驗、學術研究和理論，盡力為您解答疑問。
        </p>
      </section>
      <section className="flex flex-col sm:flex-row items-center justify-center text-2xl sm:gap-4">
        <div className="text-right text-yellow-800">語媽媽（家長）</div>
        <div className="h-[200px] flex items-center overflow-hidden">
          <Image src="/logo.svg" alt="Familogue Logo" width={300} height={300} />
        </div>
        <div className="text-amber-500">童童（孩子）</div>
      </section>
      <section>
        <h2>創會媽媽介紹</h2>
        <h3>Dr Fay - 教育學博士</h3>
        <p>
          從事雙語教室對話、語文、語言習得和特殊教育研究，有多年的教師培訓及家長教育經驗。曾任中文大學、香港大學及香港教育大學客席講師。
        </p>
        <h3>石姨姨 - 卑詩省註冊幼兒教育老師</h3>
        <p>
          從事學前教育工作多年，後來加入香港中文大學手語雙語共融教育計劃，透過雙語幫助聽障學生的語言發展，喜歡運用故事或繪本配合不同的活動來促進孩子的語言及認知發展。
        </p>
        <h3>海豚姨姨 Florence - 註冊言語治療師 RSLP (CSHBC)</h3>
        <p>
          畢業後從事言語治療超過十年，希望以專業知識與家長同行。
        </p>
        <h3>恩恩姨姨 - 香港資深中學老師及特殊教育統籌主任</h3>
        <p>
          有20年的教學經驗， 曾任中學老師及特殊教育統籌主任。她相信每個人都是獨一無二的，擁有不同的潛能。我們的下一代將在父母和老師的悉心指導下大放異彩。
        </p>
        <h3>叻薯媽 (Slash Mom) 資深市場營銷人員</h3>
        <p>
          曾在不同的跨國品牌和公司工作，在品牌推廣、公共關係、企業傳訊、廣告、業務發展方面擁有豐富的經驗。她曾接受過故事爸媽訓練，並於學校擔任義工和在課堂擔任助教工作。
        </p>
      </section>
      <hr />
      <section>
        <h2>查閱語你童行的的章程及細則</h2>
        <ul>
          <li><a target="_blank" href="/assets/bylaws.pdf">Bylaws</a></li>
          <li><a target="_blank" href="/assets/constitution_2026_mar.pdf">Constitution (2026 March)</a></li>
        </ul>
      </section>
    </div>
  );
};
