"use client";

import Image from "next/image";
import StoryFold from "./components/StoryFoldClient";
import { useEffect, useMemo, useRef, useState } from "react";

type Progress = {
  goal: number;
  current: number;
  backers: number;
  /** 募集終了日（JST想定） */
  endAt: string; // YYYY-MM-DD
  /** 24時間以内の支援者数（任意・取得できない場合は未表示） */
  backersLast24h?: number;
};

type ReturnTone = "LIGHT" | "MID" | "DEEP" | "KEKKAI";

type ReturnItem = {
  step: string;
  price: number;
  role: string;
  ctaLabel: string;
  title: string;
  subtitle?: string;
  checkoutUrl?: string;

  // UI用：コンテンツ名+説明（箇条書きの代替）
  grants: { name: string; desc: string }[];

  note?: string;
  badge?: "KEKKAI";
  premium?: boolean;
  innerCta?: string;
  innerCtaHeading?: string;
  tone?: ReturnTone;
};

function yen(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

function clampPct(p: number) {
  if (p < 0) return 0;
  if (p > 100) return 100;
  return p;
}

function toneShell(tone?: ReturnTone) {
  switch (tone) {
    case "MID":
      return "bg-gradient-to-b from-white to-zinc-50 border-zinc-200 text-zinc-900";
    case "DEEP":
      return "bg-gradient-to-b from-zinc-50 to-zinc-100 border-zinc-200 text-zinc-900";
    case "KEKKAI":
      return "bg-gradient-to-br from-zinc-950 via-violet-950/18 to-zinc-950 border-white/12 text-white";
    default:
      return "bg-white border-zinc-200 text-zinc-900";
  }
}

function toneThumb(tone?: ReturnTone) {
  switch (tone) {
    case "MID":
      return "bg-[radial-gradient(120px_circle_at_30%_20%,rgba(244,244,245,1)_0%,rgba(228,228,231,0.75)_40%,rgba(255,255,255,0)_70%),radial-gradient(200px_circle_at_70%_80%,rgba(161,161,170,0.35)_0%,rgba(255,255,255,0)_60%)]";
    case "DEEP":
      return "bg-[radial-gradient(140px_circle_at_30%_20%,rgba(228,228,231,0.9)_0%,rgba(212,212,216,0.55)_45%,rgba(255,255,255,0)_75%),radial-gradient(260px_circle_at_75%_75%,rgba(113,113,122,0.25)_0%,rgba(255,255,255,0)_65%)]";
    case "KEKKAI":
      return "bg-[radial-gradient(140px_circle_at_30%_25%,rgba(167,139,250,0.35)_0%,rgba(124,58,237,0.14)_45%,rgba(0,0,0,0)_72%),radial-gradient(260px_circle_at_80%_80%,rgba(255,255,255,0.10)_0%,rgba(0,0,0,0)_60%)]";
    default:
      return "bg-[radial-gradient(140px_circle_at_30%_25%,rgba(250,250,250,1)_0%,rgba(228,228,231,0.65)_45%,rgba(255,255,255,0)_75%),radial-gradient(260px_circle_at_78%_78%,rgba(161,161,170,0.25)_0%,rgba(255,255,255,0)_65%)]";
  }
}

function stepThumbSrc(step: string) {
  switch (step) {
    case "STEP 0":
      return "/images/returns/step0.jpg";
    case "STEP 1":
      return "/images/returns/step1.jpg";
    case "STEP 2":
      return "/images/returns/step2.jpg";
    case "STEP 3":
      return "/images/returns/step3ver2.png";
    case "STEP 4":
      return "/images/returns/step4.jpg";
    case "STEP 5":
      return "/images/returns/step5.jpg";
    default:
      return "";
  }
}

function stepThumbAlt(step: string) {
  switch (step) {
    case "STEP 0":
      return "感謝の言霊";
    case "STEP 1":
      return "刻印と開門";
    case "STEP 2":
      return "共創と直会";
    case "STEP 3":
      return "結界庭守｜調律位";
    case "STEP 4":
      return "結界庭守｜記録位";
    case "STEP 5":
      return "結界庭守｜維持位";
    default:
      return "リターン画像";
  }
}

/** スクロールで“ふわっ”と出す（追加ライブラリ不要）
 *  本番で IntersectionObserver が発火しない場合でも「消えっぱなし」にならないよう保険を入れる
 */
function useRevealOnView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);

  // IntersectionObserver が無い/不安定な環境では「隠さない」= 最初から表示
  const [shown, setShown] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return !("IntersectionObserver" in window);
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IO非対応なら即表示
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    // 保険：IOが発火しなくても一定時間で表示（本番事故対策）
    const safety = window.setTimeout(() => setShown(true), 900);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...opts }
    );

    io.observe(el);

    return () => {
      window.clearTimeout(safety);
      io.disconnect();
    };
  }, [opts]);

  return { ref, shown };
}

function GrantList({
  tone,
  grants,
}: {
  tone?: ReturnTone;
  grants: { name: string; desc: string }[];
}) {
  const isK = tone === "KEKKAI";
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {grants.map((g, i) => (
        <div
          key={`${g.name}-${i}`}
          className={[
            "rounded-2xl border p-4",
            isK ? "border-white/15 bg-white/5" : "border-zinc-200 bg-white",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <div
              className={[
                "mt-0.5 grid h-7 w-10 place-items-center rounded-xl text-[11px] font-semibold tracking-[0.14em]",
                isK ? "bg-white/10 text-zinc-100" : "bg-zinc-100 text-zinc-700",
              ].join(" ")}
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div
                className={[
                  "text-sm font-semibold",
                  isK ? "text-white" : "text-zinc-900",
                ].join(" ")}
              >
                {g.name}
              </div>
              <div
                className={[
                  "mt-1 text-sm leading-relaxed",
                  isK ? "text-zinc-200" : "text-zinc-700",
                ].join(" ")}
              >
                {g.desc}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const progress: Progress = {
    goal: 3_800_000,
    current: 1_420_000,
    backers: 23,
    endAt: "2026-03-15",
    // backersLast24h: 62,
  };

  const pct = clampPct((progress.current / progress.goal) * 100);

  const remainingDays = useMemo(() => {
    // JSTで日付を扱う（時差で1日ズレる事故を避ける）
    const end = new Date(`${progress.endAt}T23:59:59+09:00`);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }, [progress.endAt]);

  const endAtLabel = useMemo(() => {
    const d = new Date(`${progress.endAt}T00:00:00+09:00`);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}/${m}/${day}`;
  }, [progress.endAt]);

  const returns: ReturnItem[] = useMemo(
    () => [
      {
        step: "STEP 0",
        price: 8_800,
        role: "観測者",
        ctaLabel: "想いを送る",
        title: "感謝の言霊メッセージ",
        subtitle: "今は遠くからでも、この渦にエネルギーを添えたいあなたへ。",
        checkoutUrl: "https://buy.stripe.com/cNi3cu3Ii4eqbdBbQD5gc0c",
        grants: [
          {
            name: "付与するもの 01｜感謝の言霊",
            desc: "あなたのお名前を呼んだ“感謝の言霊”動画をお届けします。",
          },
          {
            name: "付与するもの 02｜名の記録",
            desc: "HP「Special Thanks」へお名前掲載（希望者のみ）。",
          },
        ],
        tone: "LIGHT",
      },
      {
        step: "STEP 1",
        price: 33_000,
        role: "参加者",
        ctaLabel: "名前を刻む",
        title: "【刻印】サロン内プレート & 開門神事参加",
        subtitle: "この城に「自分も関わった」という証を残したい人へ。",
        checkoutUrl: "https://buy.stripe.com/8x25kC3Ii26i95tcUH5gc0b",
        grants: [
          {
            name: "付与するもの 01｜刻印",
            desc: "サロン内ネームプレートへあなたの名を刻みます。",
          },
          {
            name: "付与するもの 02｜開門神事",
            desc: "開門の瞬間に立ち会う（現地参加 or オンライン中継）。",
          },
        ],
        tone: "LIGHT",
      },
      {
        step: "STEP 2",
        price: 55_000,
        role: "仲間",
        ctaLabel: "一緒に作る",
        title: "【共創】光庭DIY参加 & 直会",
        subtitle: "使う前に、まず一緒に作る。",
        checkoutUrl: "https://buy.stripe.com/7sYcN46UuaCOa9x6wj5gc0a",
        grants: [
          {
            name: "付与するもの 01｜共創参加",
            desc: "内装DIYに参加（壁塗装・簡単な施工・仕上げなど安全範囲）。",
          },
          {
            name: "付与するもの 02｜直会",
            desc: "作業後の直会（軽食）で“場の始まり”を共有します。",
          },
          {
            name: "付与するもの 03｜記念記録",
            desc: "記念写真＆データ共有。サロン内「共創者名簿」掲載（希望者）。",
          },
        ],
        note: "※ 汚れてもいい服装でご参加ください / 作業は安全な範囲に限定します",
        tone: "MID",
      },

      // ====== STEP3〜5：完成度MAXゾーン ======
      {
        step: "STEP 3",
        price: 330_000,
        role: "結界庭守｜調律位",
        ctaLabel: "結界側へ入る",
        title: "【鍵石】スマート・タリスマン プレミアム",
        subtitle: "利用者ではなく、この場を共に整え、守り、育てていく人へ。",
        checkoutUrl: "https://buy.stripe.com/cNi9ASfr0eT4bdB6wj5gc07",
        grants: [
          {
            name: "付与するもの 01｜鍵石（オーダーメイド）",
            desc:
              "パワーストーンのブレスレットをオーダーメイド制作。石はすべて植草が選定・浄化し、あなた専用の“鍵石”に仕立てます。",
          },
          {
            name: "付与するもの 02｜ICチップ内蔵",
            desc:
              "ブレスレット内部にICチップを内蔵。タリスマンとして“通過”を物理的にも記録できる設計へ。",
          },
          {
            name: "付与するもの 03｜言霊注入",
            desc:
              "タリスマンへ言霊を注入。あなた・石・光庭の相互作用が起きる状態へ整えます。",
          },
          {
            name: "付与するもの 04｜月次調律儀（全12回）",
            desc:
              "毎月1回、あなた・石・光庭を再調律。来店／郵送どちらも対応します。",
          },
          {
            name: "付与するもの 05｜会員権（創設メンバー）",
            desc:
              "光庭 会員権（創設メンバー）付与。最初の6ヶ月は月額無料、7ヶ月目以降は通常月額へ。",
          },
          {
            name: "付与するもの 06｜最優先共有",
            desc:
              "空間アップデート情報を最優先で共有。結界庭守名簿への記載（希望者）。",
          },
        ],
        badge: "KEKKAI",
        premium: true,
        innerCtaHeading: "結界庭守への通過儀",
        innerCta: "結界側へ入る",
        note: "※ ここから先は「利用」ではなく「維持」の領域です",
        tone: "KEKKAI",
      },
      {
        step: "STEP 4",
        price: 480_000,
        role: "結界庭守｜記録位",
        ctaLabel: "最初の証人になる",
        title: "こけら落とし特別枠（結界庭守＋個人セッション）",
        subtitle: "結界側に入ったうえで、最初に深く“通過する”証へ。",
        checkoutUrl: "https://buy.stripe.com/aFa5kC2Ee3am2H53k75gc08",
        grants: [
          {
            name: "付与するもの 01｜結界庭守（STEP3）フルセット",
            desc: "STEP3（鍵石・月次調律儀・会員権など）をすべて含みます。",
          },
          {
            name: "付与するもの 02｜個人セッション（150分×2回）",
            desc: "完成後に優先日程で調整。深い通過のための2回構成。",
          },
          {
            name: "付与するもの 03｜記録データ",
            desc: "セッション録音データをお渡しします。",
          },
          {
            name: "付与するもの 04｜初回優先枠",
            desc: "こけら落とし期の特別枠（限定枠・人数は後で確定でOK）。",
          },
        ],
        badge: "KEKKAI",
        tone: "KEKKAI",
      },
      {
        step: "STEP 5",
        price: 770_000,
        role: "結界庭守｜維持位",
        ctaLabel: "維持位として参画する",
        title: "維持位（場を倒さない人）｜貸切 & 直会",
        subtitle: "前に立たず、名を主張せず、それでもこの結界が続く理由になる人へ。",
        checkoutUrl: "https://buy.stripe.com/aFaeVc92C9yKbdB7An5gc09",
        grants: [
          {
            name: "付与するもの 01｜光庭の貸切利用",
            desc: "用途は応相談。あなたの目的に合わせて場を開きます。",
          },
          {
            name: "付与するもの 02｜当日の全面サポート",
            desc: "植草が“黒子”に回り、場の設計と運用を支えます。",
          },
          {
            name: "付与するもの 03｜直会",
            desc: "食事を共にし、結界の維持に必要な“温度”を共有します。",
          },
          {
            name: "付与するもの 04｜最優先共有",
            desc: "空間アップデート情報を最優先で共有します。",
          },
        ],
        badge: "KEKKAI",
        note: "※ ここは“支援”ではなく「結界を倒さない役割」への参加です",
        tone: "KEKKAI",
      },
    ],
    []
  );

  const storyReveal = useRevealOnView<HTMLDivElement>();

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-sm font-semibold">
              光
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">光庭 -HikariNiwa-</div>
              <div className="text-xs text-zinc-500">Invite-only private funding</div>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-sm">
            <a href="#progress" className="rounded-full px-4 py-2 text-zinc-700 hover:bg-zinc-100">
              進捗
            </a>
            <a href="#returns" className="rounded-full bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800">
              リターン
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative aspect-[16/6] w-full">
            <Image
              src="/images/hikariniwa-header.jpg"
              alt="光庭のイメージ"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
              PRIVATE CROWDFUNDING
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
              光庭 -HikariNiwa- プロジェクト
            </h1>

<div className="mt-5 space-y-4 text-zinc-800 whitespace-pre-line">

  <p className="text-lg sm:text-xl">
    光庭は、
    訪れる度に、“内側の状態”が整い、
    判断の質が変わり、
    行動が自然と強くなっていく場所。
  </p>

  <p className="text-lg sm:text-xl">
    努力で前に進むのではなく、
    状態が上がることで、人生が前に進み出す。
  </p>

  <p className="text-lg sm:text-xl font-medium">
    そんな完全会員制のプライベートスペースです。
  </p>
</div>

            <div className="mt-7 grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-700 sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="rounded-xl bg-white px-4 py-3">
                <div className="text-xs font-semibold text-zinc-500">場所</div>
                <div className="mt-1 font-medium">都内／完全会員制</div>
              </div>
              <div className="rounded-xl bg-white px-4 py-3">
                <div className="text-xs font-semibold text-zinc-500">完成予定</div>
                <div className="mt-1 font-medium">2027年1月</div>
              </div>
              <div className="rounded-xl bg-white px-4 py-3">
                <div className="text-xs font-semibold text-zinc-500">参加条件</div>
                <div className="mt-1 font-medium">招待制（知り合い限定）</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress band */}
      <section id="progress" className="mt-10 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">現在の支援総額</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  招待制・少人数のため、数字は“透明性”として提示します（仮データ）。
                </p>
              </div>
              <div className="text-xs text-zinc-500">
                募集終了：{endAtLabel}（JST）
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-50 px-5 py-4">
                <div className="text-xs font-semibold text-zinc-500">現在の支援総額</div>
                <div className="mt-1 text-xl font-semibold text-zinc-900">
                  ¥{yen(progress.current)}
                </div>
              </div>
              <div className="rounded-2xl bg-zinc-50 px-5 py-4">
                <div className="text-xs font-semibold text-zinc-500">支援者数</div>
                <div className="mt-1 text-xl font-semibold text-zinc-900">
                  {progress.backers}人
                </div>
                {typeof progress.backersLast24h === "number" && (
                  <div className="mt-1 text-xs text-zinc-500">
                    24時間以内に{progress.backersLast24h}人からの支援がありました
                  </div>
                )}
              </div>
              <div className="rounded-2xl bg-zinc-50 px-5 py-4">
                <div className="text-xs font-semibold text-zinc-500">募集終了まで残り</div>
                <div className="mt-1 text-xl font-semibold text-zinc-900">
                  {remainingDays}日
                </div>
              </div>
            </div>

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
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500 transition-[width]"
                  style={{ width: `${pct}%` }}
                  aria-label="progress bar"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="mt-3 text-xs text-zinc-500">
                募集終了まで残り <span className="font-semibold text-zinc-900">{remainingDays}日</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story band */}
      <section className="mt-10 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4">
          <div
            ref={storyReveal.ref}
            className={[
              "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8",
              "transition-all duration-700 ease-out",
              storyReveal.shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            ].join(" ")}
          >

            {/* Catch */}
            <div className="mt-8">
              <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <div className="bg-gradient-to-b from-zinc-50 to-white px-6 py-7 sm:px-8 sm:py-9">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-8 w-1.5 rounded-full bg-zinc-900/80" aria-hidden />
                    <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">INVITE-ONLY</div>
                  </div>

                  <div className="mt-5 text-center space-y-2">
                    <p className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900">一人では、ただの点。</p>
                    <p className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900">あなたがいれば、大きな渦になる。</p>

                    <div className="mx-auto my-4 h-px w-16 bg-zinc-200" aria-hidden />

                    <p className="text-lg sm:text-xl font-medium tracking-tight text-zinc-900">これは寄付ではありません。</p>
                    <p className="text-lg sm:text-xl font-medium tracking-tight text-zinc-900">「場」を共に創る人を探しています。</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <StoryFold />
            </div>
          
          </div>
        </div>
        
      </section>
  {/* Philosophy band */}
<section className="mt-10 bg-zinc-50">
  <div className="mx-auto max-w-6xl px-4">
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header (bar style) */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-1.5 rounded-full bg-zinc-900/80" />
        <h2 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">
          どう関わりたいかによって選べる、5つのステップ
        </h2>
      </div>

      <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700">
        <p>光庭は、ただ整える場所ではありません。</p>

        <p>
          内側が変わり、判断が変わり、行動が変わる。
          その連鎖が起きたとき、人生は静かに、しかし確実に加速します。
        </p>

        <p>
          だからこの場所では、
          「どれだけ関わりたいか」を基準に、5つのステップを用意しました。
        </p>

        <p>
          軽くエネルギーを添える人。<br />
          名を刻み、場の始まりに立ち会う人。<br />
          共に作り、維持し、守る側に回る人。
        </p>

        <p>
          STEPが上がるほど、
          受け取るものが増えるのではなく、
          この場に“与える役割”が深くなっていきます。
        </p>

        <p className="font-medium text-zinc-900">
          あなたは、どこから関わりますか？
        </p>
      </div>
    </div>
  </div>
</section>
      {/* Returns band */}
      <section id="returns" className="mt-10 bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Returns Gate */}
            <div className="mt-10">
              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                {/* Gate Accent */}
                <div className="absolute left-0 top-6 h-16 w-1.5 rounded-r bg-violet-600" />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between pl-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                      リターン一覧
                      <span className="ml-2 text-base font-medium text-zinc-600">
                        （関係性の深さ順）
                      </span>
                    </h2>

                    <p className="text-base leading-relaxed text-zinc-700">
                      STEPが進むほど、受け取るものが増えるのではありません。
                      <br />
                      <span className="font-medium text-zinc-900">この場に与える役割</span>
                      が、静かに深くなっていきます。
                    </p>

                    <p className="text-base font-medium tracking-tight text-zinc-900">
                      あなたは、どこから関わりますか？
                    </p>
                  </div>

                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-5">
              {returns.map((r) => {
                const isKekkai = r.badge === "KEKKAI";
                const isPremium = !!r.premium;
                const isStep3 = r.step === "STEP 3";
                const isStep4 = r.step === "STEP 4";
                const isStep5 = r.step === "STEP 5";

                return (
                  <article
                    key={r.step}
                    className={[
                      "relative overflow-hidden rounded-3xl border p-6 sm:p-8",
                      toneShell(r.tone),
                      isPremium ? "hn-violet-ring hn-card-strong" : "shadow-sm",
                      isStep3 ? "hn-ritual-step3" : "",
                      isStep4 ? "hn-kekkai-step4" : "",
                      isStep5 ? "hn-kekkai-step5" : "",
                    ].join(" ")}
                  >
                    {/* Base glow for KEKKAI */}
                    {r.tone === "KEKKAI" && (
                      <div className="pointer-events-none absolute inset-0 opacity-80">
                        <div className="hn-violet-glow absolute inset-0" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent" />
                      </div>
                    )}
                    {/* STEP color cue: readable, minimal */}
                    {(isStep3 || isStep4 || isStep5) && r.tone === "KEKKAI" && (
                      <div
                        className={[
                          "pointer-events-none absolute left-0 top-8 h-16 w-1.5 rounded-r",
                          isStep3 ? "bg-violet-300/70" : isStep4 ? "bg-indigo-300/70" : "bg-fuchsia-300/70",
                        ].join(" ")}
                        aria-hidden
                      />
                    )}

                    {/* STEP3 only: aurora / sheen / vignette */}
                    {isStep3 && (
                      <div className="pointer-events-none absolute inset-0">
                        <div className="hn-ritual-aurora absolute -inset-24 opacity-60" />
                        <div className="hn-ritual-sheen absolute -inset-10 opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                      </div>
                    )}

                    <div className="relative">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          {/* thumb */}
                          <div
                            className={[
                              "relative overflow-hidden rounded-2xl border",
                              r.tone === "KEKKAI" ? "border-white/15" : "border-zinc-200",
                              "h-20 w-28 sm:h-24 sm:w-36",
                              stepThumbSrc(r.step) ? "bg-zinc-900/5" : toneThumb(r.tone),
                              isStep3 ? "hn-ritual-thumb" : "",
                            ].join(" ")}
                            aria-hidden
                          >
                            {stepThumbSrc(r.step) ? (
                              <Image
                                src={stepThumbSrc(r.step)}
                                alt={stepThumbAlt(r.step)}
                                fill
                                className="object-cover"
                                sizes="(min-width: 640px) 144px, 112px"
                              />
                            ) : null}

                            {/* subtle grain */}
                            <div className="absolute inset-0 opacity-[0.14] mix-blend-overlay [background-image:radial-gradient(circle,rgba(0,0,0,0.45)_1px,transparent_1px)] [background-size:6px_6px]" />
                            <div className={[
                              "absolute inset-0",
                              r.tone === "KEKKAI"
                                ? "bg-gradient-to-t from-black/45 via-black/10 to-transparent"
                                : "bg-gradient-to-t from-black/20 via-black/0 to-transparent",
                            ].join(" ")}
                            />

                            {/* STEP3 sigil overlay */}
                            {isStep3 && (
                              <div className="pointer-events-none absolute inset-0">
                                <div className="hn-ritual-sigil absolute inset-0 opacity-60" />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className={r.tone === "KEKKAI" ? "text-zinc-200" : "text-zinc-600"}>
                              <div className="text-xs font-semibold tracking-[0.18em]">{r.step}</div>
                            </div>
                            <div className={r.tone === "KEKKAI" ? "text-white" : "text-zinc-900"}>
                              <div className="mt-1 text-2xl font-semibold">¥{yen(r.price)}</div>
                            </div>
                            <div className={r.tone === "KEKKAI" ? "text-zinc-300" : "text-zinc-600"}>
                              <div className="mt-1 text-sm">{r.role}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-end">
                          {isKekkai && (
                            <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-zinc-200 backdrop-blur">
                              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[12px] leading-none">
                                結
                              </span>
                              KEKKAI
                            </div>
                          )}

                          <a
                            href={r.checkoutUrl || "#"}
                            target={r.checkoutUrl ? "_blank" : undefined}
                            rel={r.checkoutUrl ? "noopener noreferrer" : undefined}
                            aria-disabled={!r.checkoutUrl}
                            className={[
                              "inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60",
                              r.tone === "KEKKAI"
                                ? "hn-ritual-btn bg-white text-zinc-950 hover:bg-zinc-100"
                                : "bg-zinc-900 text-white hover:bg-zinc-800",
                              isStep3 ? "hn-ritual-cta" : "",
                              !r.checkoutUrl ? "pointer-events-none opacity-50" : "",
                            ].join(" ")}
                          >
                            <span aria-hidden className="shrink-0 text-[12px] leading-none opacity-90">
                              ▶
                            </span>
                            <span className="leading-none">{r.ctaLabel}</span>
                          </a>
                        </div>
                      </div>

                      <h3 className={["mt-5 text-lg font-semibold", r.tone === "KEKKAI" ? "text-white" : "text-zinc-900"].join(" ")}>
                        {r.title}
                      </h3>

                      {r.subtitle && (
                        <p className={["mt-2 text-sm leading-relaxed", r.tone === "KEKKAI" ? "text-zinc-200" : "text-zinc-700"].join(" ")}>
                          {r.subtitle}
                        </p>
                      )}

                      {/* grants */}
                      <GrantList tone={r.tone} grants={r.grants} />

                      {/* STEP3 only: ritual rail */}
                      {isStep3 && (
                        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-xs font-semibold tracking-[0.18em] text-zinc-200">
                                PASSAGE RITE
                              </div>
                              <div className="mt-2 text-base font-semibold text-white">
                                結界庭守への通過儀
                              </div>
                              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                                「鍵石」を受け取り、整え、毎月の調律で“場を倒さない側”へ移ります。
                              </p>
                            </div>

                            <div className="hidden sm:block text-right">
                              <div className="hn-ritual-pulse inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-zinc-100">
                                <span className="inline-block h-2 w-2 rounded-full bg-violet-300/80" />
                                RITUAL ACTIVE
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            {[
                              { t: "通過 01", d: "鍵石を受領" },
                              { t: "通過 02", d: "IC / 言霊を内在化" },
                              { t: "通過 03", d: "月次調律で維持側へ" },
                            ].map((x) => (
                              <div
                                key={x.t}
                                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3"
                              >
                                <div className="text-[11px] font-semibold tracking-[0.14em] text-zinc-200">
                                  {x.t}
                                </div>
                                <div className="mt-1 text-sm font-semibold text-white">{x.d}</div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-xs text-zinc-300">
                              ※ ここから先は「利用」ではなく「維持」の領域です
                            </div>

                            <a
                              href={r.checkoutUrl || "https://buy.stripe.com/cNi9ASfr0eT4bdB6wj5gc07"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hn-ritual-btn inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"
                            >
                              結界側へ入る
                            </a>
                          </div>
                        </div>
                      )}


                      {r.note && (
                        <p className={["mt-4 text-xs leading-relaxed", r.tone === "KEKKAI" ? "text-zinc-300" : "text-zinc-600"].join(" ")}>
                          {r.note}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Join the vortex (image band) */}
      <section className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <Image
                  src="/images/message.jpg"
                  alt="植草智史 メッセージ"
                  width={2400}
                  height={1350}
                  className="h-auto w-full object-contain"
                  sizes="(min-width: 1024px) 896px, (min-width: 640px) 80vw, 92vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

     

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} HikariNiwa. All rights reserved.
        </div>
      </footer>

      {/* STEP3 “儀式感” CSS（ページ内完結） */}
      <style jsx global>{`
        .hn-card-strong {
          box-shadow:
            0 0 0 1px rgba(167, 139, 250, 0.22),
            0 28px 70px rgba(0, 0, 0, 0.6);
        }
        @media (prefers-reduced-motion: reduce) {
          .hn-ritual-aurora,
          .hn-ritual-sheen,
          .hn-ritual-pulse,
          .hn-ritual-step3,
          .hn-ritual-sigil {
            animation: none !important;
            transition: none !important;
          }
        }

        .hn-ritual-step3 {
          box-shadow:
            0 0 0 1px rgba(167, 139, 250, 0.22),
            0 22px 55px rgba(0, 0, 0, 0.55);
        }

        .hn-kekkai-step4 {
          box-shadow:
            0 0 0 1px rgba(129, 140, 248, 0.14),
            0 18px 46px rgba(0, 0, 0, 0.55);
        }
        .hn-kekkai-step5 {
          box-shadow:
            0 0 0 1px rgba(232, 121, 249, 0.12),
            0 18px 46px rgba(0, 0, 0, 0.60);
        }

        .hn-ritual-aurora {
          background: radial-gradient(
              circle at 25% 30%,
              rgba(167, 139, 250, 0.35),
              transparent 55%
            ),
            radial-gradient(
              circle at 70% 65%,
              rgba(236, 72, 153, 0.18),
              transparent 60%
            ),
            radial-gradient(
              circle at 45% 85%,
              rgba(59, 130, 246, 0.14),
              transparent 60%
            );
          filter: blur(34px);
          opacity: 0.55;
          animation: hnAurora 8.5s ease-in-out infinite alternate;
        }

        .hn-ritual-sheen {
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 35%,
            transparent 70%
          );
          filter: blur(10px);
          transform: translateX(-15%) rotate(0.0001deg);
          animation: hnSheen 4.8s ease-in-out infinite;
        }

        .hn-ritual-pulse {
          animation: hnPulse 2.4s ease-in-out infinite;
        }

        .hn-ritual-cta {
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2),
            0 18px 40px rgba(167, 139, 250, 0.25);
        }

        .hn-ritual-cta2 {
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.22),
            0 22px 55px rgba(167, 139, 250, 0.28);
        }

        .hn-ritual-thumb {
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
        }

        .hn-ritual-sigil {
          background: radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0.22),
              transparent 55%
            ),
            radial-gradient(
              circle at 50% 50%,
              rgba(167, 139, 250, 0.22),
              transparent 62%
            );
          mask-image: radial-gradient(circle at 50% 50%, #000 0%, transparent 70%);
          animation: hnSigil 6.5s ease-in-out infinite alternate;
          filter: blur(0.6px);
          opacity: 0.45;
        }

        @keyframes hnAurora {
          0% {
            transform: translate3d(-2%, -1%, 0) scale(1);
          }
          100% {
            transform: translate3d(2%, 1%, 0) scale(1.03);
          }
        }

        @keyframes hnSheen {
          0% {
            opacity: 0.15;
            transform: translateX(-25%) rotate(2deg);
          }
          50% {
            opacity: 0.32;
            transform: translateX(0%) rotate(2deg);
          }
          100% {
            opacity: 0.18;
            transform: translateX(18%) rotate(2deg);
          }
        }

        @keyframes hnPulse {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.95;
          }
          50% {
            transform: translateY(-2px);
            opacity: 1;
          }
        }

        @keyframes hnSigil {
          0% {
            opacity: 0.35;
            transform: scale(0.98);
          }
          100% {
            opacity: 0.65;
            transform: scale(1.02);
          }
        }
      `}</style>
    </main>
  );
}