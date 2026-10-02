import type { Metadata } from "next";
import Link from "next/link";
import { curatedVerseIds, getChapterIndex } from "@/lib/data";
import { LayerTag } from "@/components/verse/sections";
import { SourceTag } from "@/components/os/parts";
import { getTexts } from "@/lib/os/data";

export const metadata: Metadata = { title: "Sources & method" };

export default function AboutPage() {
  const total = getChapterIndex().reduce((n, c) => n + c.verseCount, 0);
  const english = getChapterIndex().reduce((n, c) => n + c.verses.filter((v) => v.hasEnglish).length, 0);
  const curated = curatedVerseIds().length;
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="pb-10 pt-16 sm:pt-24">
        <p className="eyebrow mb-4">Sources & method</p>
        <h1 className="font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-[1.08]">
          Source first. Many perspectives. Nothing invented.
        </h1>
      </header>
      <div className="reader mb-16 space-y-6 text-ink-2">
        <p>
          Indian Philosophy OS is a map of ideas: questions, concepts, traditions, thinkers, texts and passages, all
          connected by ids in a single data model. It does not decide which tradition is right. It presents each one in
          its own terms, so you can understand, compare and reflect.
        </p>
        <h2 className="font-display pt-2 text-2xl text-ink">The source hierarchy</h2>
        <p>Every piece of content says what it is:</p>
        <ul className="space-y-4">
          <li className="flex flex-col gap-1.5"><SourceTag type="primary-text" /> <span>The texts themselves: Upanishads, sutras, epics, scriptures.</span></li>
          <li className="flex flex-col gap-1.5"><SourceTag type="traditional-commentary" /> <span>Classical commentaries such as Shankara’s or Ramanuja’s bhashyas.</span></li>
          <li className="flex flex-col gap-1.5"><SourceTag type="modern-commentary" /> <span>Modern commentaries on primary texts, such as Swami Ramsukhdas’s Sadhak Sanjivani.</span></li>
          <li className="flex flex-col gap-1.5"><SourceTag type="modern-exposition" /> <span>Modern teachers’ own works (Vivekananda, Ramana Maharshi). They are bridges, not ancient scripture.</span></li>
          <li className="flex flex-col gap-1.5"><SourceTag type="editorial" /> <span>Our neutral overviews of traditions, texts, thinkers, concepts and comparisons, written from mainstream scholarship and each tradition’s self-description.</span></li>
          <li className="flex flex-col gap-1.5"><SourceTag type="modern-analogy" /> <span>Contemporary illustrations we added. They are always labelled.</span></li>
        </ul>
        <h2 className="font-display pt-2 text-2xl text-ink">What has been ingested</h2>
        <p>
          Of the {getTexts().length} texts in the library, only the <strong>Bhagavad Gita with Sadhak Sanjivani</strong> is
          fully ingested. Every other text has a structured overview, its concepts and connections, and passage
          references where they are certain. No verses of those texts have been reproduced, translated or invented; they
          are marked <SourceTag type="not-ingested" />. The data model is ready for each text’s source to be added
          without changing the interface.
        </p>
        <p>
          Dates and attributions are given as ranges or as traditional attributions where scholars disagree (for example,
          several works traditionally attributed to Shankara).
        </p>
      </div>
      <h2 className="font-display mb-6 text-3xl text-ink">The Bhagavad Gita module</h2>
      <div className="reader space-y-6 text-ink-2">
        <p>
          Everything here rests on <em className="font-display text-ink">Sadhak Sanjivani</em>, Swami Ramsukhdas Ji’s
          commentary on the Bhagavad Gita (Gita Press, Gorakhpur), in its Hindi edition with परिशिष्ट and its English
          edition, <em>Sadhaka-Sanjivani</em>. This app is an interface over that text. It adds no philosophy of its own.
        </p>
        <h2 className="font-display pt-4 text-2xl text-ink">What you are reading, layer by layer</h2>
        <ul className="space-y-5">
          <li className="flex flex-col gap-2">
            <LayerTag kind="source" />
            <span>
              The Sanskrit verse, the Hindi word meanings and translation, the सम्बन्ध (context) lines, the commentary
              (व्याख्या), the appendix (परिशिष्ट भाव) and the English edition’s translation and commentary. These are the
              book’s own words, extracted from the PDF editions.
            </span>
          </li>
          <li className="flex flex-col gap-2">
            <LayerTag kind="summary" />
            <span>
              Headlines, the one-line “idea”, “What is Krishna saying?”, step-by-step points, chapter overviews,
              concepts and answers to questions. We wrote these in simpler language as a paraphrase of what Swamiji says
              for that verse. Every example card quotes the commentary word for word, so you can check it.
            </span>
          </li>
          <li className="flex flex-col gap-2">
            <LayerTag kind="analogy" />
            <span>
              Occasional contemporary illustrations (career, exams, relationships…). They are ours, not Swamiji’s. They
              are there only to connect a teaching to daily life, and they are always labelled.
            </span>
          </li>
        </ul>
        <h2 className="font-display pt-4 text-2xl text-ink">Coverage in this version</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>All {total} verses with Sanskrit, IAST transliteration, Hindi word meanings, Hindi translation and full Hindi commentary.</li>
          <li>{english} verses with the English edition’s translation and commentary. The rest could not be recovered reliably from the scan.</li>
          <li>{curated} verses with the simplified learning layer. That includes every verse of Chapter 2 and the key verses of every other chapter.</li>
        </ul>
        <h2 className="font-display pt-4 text-2xl text-ink">Known limitations</h2>
        <p>
          The Hindi text was converted from a legacy font encoding and the English text was recognised from a scan, so
          a few words may be imperfect. In particular, some transliterated Sanskrit in the English commentary is
          affected. Where the two differ, the Hindi original is authoritative. Page numbers point to the printed
          editions so you can check the book itself.
        </p>
        <p>
          If something is not covered in the source, the app doesn’t make it up. Verses without a simplified layer show
          the book’s text only.
        </p>
        <p className="pt-4">
          <Link href="/chapters" className="text-saffron underline-offset-4 hover:underline">
            Begin with the chapters →
          </Link>
        </p>
      </div>
    </div>
  );
}
