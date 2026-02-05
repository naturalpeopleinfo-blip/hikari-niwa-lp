import Image from "next/image";
import StoryFold from "./components/StoryFold";

type Progress = {
  goal: number;
  current: number;
  backers: number;
};

type ReturnItem = {
  step: string;
  price: number;
  role: string;
  ctaLabel: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  note?: string;
  badge?: "KEKKAI";
  premium?: boolean;
  innerCta?: string;
  innerCtaHeading?: string;
};

function yen(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

export default function Page() {
  const progress: Progress = {
    goal: 3_800_000,
    current: 1_420_000,
    backers: 23,
  };

  const pct = Math.min(100, (progress.current / progress.goal) * 100);

  const returns: ReturnItem[] = [
    {
      step: "STEP 0",
      price: 8_800,
      role: "観測者",
      ctaLabel: "想いを送る",
      title: "感謝の言霊メッセージ",
      subtitle: "今は遠くからでも、この渦にエネルギーを添えたいあなたへ。",
      bullets: [
        "あなたのお名前を呼んだ感謝の言霊動画",
        "HP「Special Thanks」へのお名前掲載（希望者）",
      ],
    },
    {
      step: "STEP 1",
      price: 33_000,
      role: "参加者",
      ctaLabel: "名前を刻む",
      title: "【刻印】サロン内プレート & 開門神事参加",
      subtitle: "この城に「自分も関わった」という証を残したい人へ。",
      bullets: [
        "サロン内ネームプレートへの刻印",
        "開門神事への参加（現地参加 or オンライン中継）",
      ],
    },
    {
      step: "STEP 2",
      price: 55_000,
      role: "仲間",
      ctaLabel: "一緒に作る",
      title: "【共創】光庭DIY参加 & 直会",
      subtitle: "使う前に、まず一緒に作る。",
      bullets: [
        "内装DIY参加（壁の塗装・簡単な施工・仕上げなど）",
        "作業後の直会（軽食）",
        "記念写真＆データ共有",
        "サロン内「共創者名簿」掲載（希望者）",
      ],
      note: "※ 汚れてもいい服装でご参加ください",
    },
    {
      step: "STEP 3",
      price: 330_000,
      role: "結界庭守｜調律位",
      ctaLabel: "結界側へ入る",
      title: "【鍵石】スマート・タリスマン プレミアム",
      subtitle: "利用者ではなく、この場を共に整え、守り、育てていく人へ。",
      bullets: [
        "オートクチュール・スマート・タリスマン（IC内蔵）",
        "月次調律儀（全12回）",
        "光庭 会員権（創設メンバー）",
        "最初の6ヶ月：月額無料",
        "結界庭守名簿への記載",
      ],
      badge: "KEKKAI",
      premium: true,
      innerCtaHeading: "結界庭守への通過儀",
      innerCta: "結界側へ入る",
    },
    {
      step: "STEP 4",
      price: 480_000,
      role: "結界庭守｜記録位",
      ctaLabel: "最初の証人になる",
      title: "こけら落とし特別枠",
      subtitle: "結界側に入ったうえで、最初に深く通過する証。",
      bullets: [
        "STEP3の内容すべて",
        "個人セッション（150分）×2回",
        "セッション録音データ",
      ],
      badge: "KEKKAI",
    },
    {
      step: "STEP 5",
      price: 770_000,
      role: "結界庭守｜維持位",
      ctaLabel: "維持位として参画する",
      title: "維持位（場を倒さない人）",
      subtitle: "前に立たず、それでも結界を支える人へ。",
      bullets: [
        "光庭の貸切利用（用途応相談）",
        "当日の全面サポート",
        "直会（食事）",
      ],
      badge: "KEKKAI",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="overflow-hidden rounded-3xl border bg-white">
          <div className="relative aspect-[16/6]">
            <Image
              src="/images/hikariniwa-header.jpg"
              alt="光庭"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="px-6 py-8 sm:px-10">
            <h1 className="hn-title text-2xl font-semibold sm:text-4xl">
              光庭 -HikariNiwa- プロジェクト
            </h1>

            <div className="mt-4 space-y-1 text-lg">
              <p>一人では、ただの点。</p>
              <p>あなたがいれば、大きな渦になる。</p>
              <p>僕の夢に、乗っかってくれませんか。</p>
            </div>
          </div>
        </div>
      </section>

{/* Progress */}
<section className="hn-section mx-auto max-w-6xl px-4" id="progress">
  <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold">進捗</h2>
        <p className="mt-1 text-sm text-zinc-600">
          招待制・少人数のため、数字は“透明性”として提示します（仮データ）。
        </p>
      </div>

      <div className="text-xs text-zinc-500">
        最終更新：2026/02/05（仮）
      </div>
    </div>

    {/* KPI cards */}
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl bg-zinc-50 px-5 py-4">
        <div className="text-xs font-semibold text-zinc-500">現在</div>
        <div className="mt-1 text-xl font-semibold text-zinc-900">
          ¥{yen(progress.current)}
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-50 px-5 py-4">
        <div className="text-xs font-semibold text-zinc-500">支援者数</div>
        <div className="mt-1 text-xl font-semibold text-zinc-900">
          {progress.backers}人
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-50 px-5 py-4">
        <div className="text-xs font-semibold text-zinc-500">達成率</div>
        <div className="mt-1 text-xl font-semibold text-zinc-900">
          {pct.toFixed(1)}%
        </div>
      </div>
    </div>

    {/* Progress bar */}
    <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs text-zinc-500">目標</div>
          <div className="mt-1 text-sm font-semibold text-zinc-900">
            ¥{yen(progress.goal)}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-zinc-500">残り</div>
          <div className="mt-1 text-sm font-semibold text-zinc-900">
            ¥{yen(Math.max(0, progress.goal - progress.current))}
          </div>
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-zinc-900 transition-[width]"
          style={{ width: `${pct}%` }}
          aria-label="progress bar"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  </div>
</section>

      {/* Story */}
      <StoryFold />

      {/* Returns */}
      <section className="hn-section mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border bg-white p-6">
          <h2 className="text-lg font-semibold">
            リターン一覧（関係性の深さ順）
          </h2>

          <div className="mt-6 grid gap-6">
            {returns.map((r) => {
              const isPremium = r.premium;

              return (
                <article
                  key={r.step}
                  className={[
                    "relative rounded-3xl p-6 text-white",
                    isPremium
                      ? "bg-gradient-to-br from-zinc-950 to-violet-950 border border-violet-400/40"
                      : "bg-zinc-950 border border-white/10",
                  ].join(" ")}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs tracking-widest">{r.step}</div>
                      <div className="mt-1 text-2xl font-semibold">
                        ¥{yen(r.price)}
                      </div>
                      <div className="text-sm text-zinc-300">{r.role}</div>
                    </div>

                    <button className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900">
                      ▶ {r.ctaLabel}
                    </button>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">{r.title}</h3>
                  {r.subtitle && (
                    <p className="mt-2 text-sm text-zinc-200">
                      {r.subtitle}
                    </p>
                  )}

                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
                    {r.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>

                  {isPremium && r.innerCta && (
                    <div className="mt-5 rounded-xl border border-white/20 p-4 text-sm">
                      <div className="font-semibold">
                        {r.innerCtaHeading}
                      </div>
                      <div className="mt-2">▶ {r.innerCta}</div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}