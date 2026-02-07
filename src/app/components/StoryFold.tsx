"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

function useRevealOnView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // ✅ Safety: If ref is not ready or IO is unavailable, never keep content hidden.
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }

    // Some environments (or aggressive blockers) may not support IntersectionObserver.
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    let timeoutId: number | null = null;
    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setShown(true);
    };

    // ✅ Failsafe: if observer never fires, reveal after a short delay.
    timeoutId = window.setTimeout(() => {
      reveal();
    }, 900);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px", ...opts }
    );

    io.observe(el);

    return () => {
      io.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [opts]);

  return { ref, shown };
}

function Block({
  tone = "plain",
  title,
  children,
  delayMs = 0,
}: {
  tone?: "plain" | "soft" | "white";
  title: string;
  children: React.ReactNode;
  delayMs?: number;
}) {
  const { ref, shown } = useRevealOnView<HTMLDivElement>();

  const shell =
    tone === "soft"
      ? "rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-7"
      : tone === "white"
      ? "rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7"
      : "rounded-2xl p-0";

  return (
    <section
      ref={ref}
      className={[
        shell,
        "transition-all duration-700 ease-out",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {/* ✅ 見出し強調：本文と明確に差をつける */}
      <div className="flex items-center gap-3">
        <div className="h-7 w-1.5 rounded-full bg-zinc-900/80" />
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900">
          {title}
        </h3>
      </div>

      <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700">
        {children}
      </div>
    </section>
  );
}

export default function StoryFold() {
  return (
    <div className="mx-auto max-w-5xl px-6 sm:px-10 space-y-10">
      <Block title="はじめに" delayMs={0}>
        <p>こんにちは。植草智史（うえくさ さとし）です。</p>
        <p>
          僕は、
          <span className="font-semibold text-zinc-900">
            現象のアーキテクト（設計家）
          </span>
          として、目に見えない95％の世界を観測し、それを現実に落とし込みます。
          俳優、ヒーリング、統計、水の研究。バラバラに見える要素は、僕の中では一本の線です。
        </p>
        <p>
          人生がなぜ停滞するのか。なぜ突然、流れが変わるのか。
          それは偶然ではなく、
          <span className="font-semibold text-zinc-900">「場」と「状態」のズレ</span>
          から起きる。僕はそこを設計で整えます。
        </p>
      </Block>

      <Block title="すべての原点は、あの日の無力感" tone="plain" delayMs={80}>
        <p>
          なぜ僕が「見えない世界」のメカニズム解明に執着するのか。
          原点は、大好きだった祖母の死です。
        </p>
        <p>
          祖母は白血病でした。幼かった僕は、ただ衰弱していく背中を見ていることしかできなかった。
          ヒーローに憧れていたのに、一番大切な人を救えない。その無力感が魂に刻まれました。
        </p>
        <p>
          「どうして人は病気になる？」「どうして不幸な現象が起きる？」
          その疑問に取り憑かれ、大人になって徹底的に研究しました。
          水が人体に与える影響、心が現象を作る仕組み、運の流れの統計的な捉え方。
          断片を繋ぎ、理論にしました。
        </p>
        {/* YouTube embed (responsive) */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-black">
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube-nocookie.com/embed/kXeVorUD55E"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </Block>

      <Block title="なぜ、セッションを封印したのか" tone="soft" delayMs={120}>
        <p>
          そんな僕が、ここ数年、頑なに拒んできたことがあります。
          それが<span className="font-semibold text-zinc-900">「対面セッション」</span>です。
        </p>
        <p className="font-semibold text-zinc-900">
          場所が、僕の出力に追いつかなかった。
        </p>
        <p>
          カフェの隣席の会話、レンタルルームに残る澱、生活の匂い。
          僕があなたのために100のエネルギーを出しても、
          そのうちの40が「場のノイズを打ち消す防御」に消えていく。
          あなたに届く純度は60になる。
        </p>
        <p>
          それが悔しかった。あなたは人生を変えたくて必死なのに、
          環境のせいで手加減を強いられる。
          <span className="font-semibold text-zinc-900">
            中途半端を“本物”として渡したくなかった
          </span>
          。
        </p>

        <div className="mt-2 rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm sm:text-base leading-relaxed text-zinc-700">
            だからこそ、次の結論に辿り着きました。
            <span className="font-semibold text-zinc-900">
              「純度100％で渡せる“器”を、先に作る」
            </span>
            という選択です。
          </p>
        </div>
      </Block>

      <Block title="光庭 -HikariNiwa- とは" delayMs={160}>
        {/* ✅ このプロジェクトの“核”なので、ここだけ密度と視認性を上げる */}
        <div className="space-y-6">
          {/* Lead */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7">
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-zinc-700">
              PROJECT CORE
            </div>

            <p className="mt-4 text-base sm:text-lg leading-relaxed tracking-tight text-zinc-900">
              光庭は、都内に誕生する
              <span className="font-semibold">完全予約制・会員制</span>
              のプライベートサロンです。外の世界の重力を物理的に遮断し、入った瞬間に肩書きも悩みも玄関に置いて、
              <span className="font-semibold">「ゼロ（素の自分）」</span>
              に戻れる結界として設計します。
            </p>

            {/* Visual */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/images/hikariniwa-about.jpg"
                  alt="光庭のイメージ"
                  fill
                  priority={false}
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent" />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-xs font-semibold tracking-tight text-zinc-900">広さ</div>
                <div className="mt-1 text-sm sm:text-base text-zinc-700">約50㎡</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-xs font-semibold tracking-tight text-zinc-900">完成予定</div>
                <div className="mt-1 text-sm sm:text-base text-zinc-700">2027年1月</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-xs font-semibold tracking-tight text-zinc-900">用途</div>
                <div className="mt-1 text-sm sm:text-base text-zinc-700">
                  対面セッション／少人数の集い／静かな滞在
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-xs font-semibold tracking-tight text-zinc-900">利用者</div>
                <div className="mt-1 text-sm sm:text-base text-zinc-700">
                  クラファン参加者と、その紹介者のみ
                </div>
              </div>
            </div>
          </div>

          {/* Why it matters */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-7">
            <p className="text-base sm:text-lg leading-relaxed tracking-tight text-zinc-900">
              ここなら僕は防御に力を使わない。
              技術、言霊、エネルギーを
              <span className="font-semibold">純度100％</span>
              のまま、あなたへ注ぎ込める。
            </p>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-700">
              だから今回に限り、封印していた対面を解禁します。
            </p>
          </div>
        </div>
      </Block>

      {/* ✅ ここが「結界庭守」の上。Blockで統一して崩れなくする */}
      <Block title="どんな人に向いている場所か" tone="white" delayMs={180}>
        <div className="space-y-5">
          <p className="font-semibold text-zinc-900">
            こんな感覚を、最近感じているなら。
          </p>

          <ul className="ml-5 list-disc space-y-2">
            <li>頑張っているのに、手応えだけが増えない</li>
            <li>正しい選択をしているはずなのに、なぜか噛み合わない</li>
            <li>人間関係や仕事で、本来の自分より小さく振る舞っている</li>
            <li>休んでも回復せず、ずっと軽いノイズを抱えている</li>
            <li>もう一段、人生のギアを上げたいが、やり方が違う気がしている</li>
          </ul>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p>光庭は、「変わりたい人」の場所ではありません。</p>
            <p className="mt-3">
              すでに力を持っているのに、
              <span className="font-semibold text-zinc-900">
                “出力が制限されている人”
              </span>
              のための場所です。
            </p>
          </div>
        </div>
      </Block>

      <Block title="光庭で起きる、3つの変化" tone="soft" delayMs={200}>
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="font-semibold text-zinc-900">
              1｜エネルギーが“溜まる”のではなく、“通る”ようになる
            </p>
            <p className="mt-2">
              余計なノイズが抜け、本来のエネルギーが滞りなく流れ出す状態に戻ります。
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>集中が続く</li>
              <li>決断が速くなる</li>
              <li>無駄な消耗が減る</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="font-semibold text-zinc-900">
              2｜判断の質が一段、静かに上がる
            </p>
            <p className="mt-2">
              「迷う必要のない選択肢」が自然と浮かび上がる。
              頭で考えた正解ではなく、今の自分に合った判断が、力まず選べるようになります。
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="font-semibold text-zinc-900">
              3｜行動が“努力”ではなく“自然発生”になる
            </p>
            <p className="mt-2">
              無理に自分を動かさなくても、やるべき行動が勝手に前に出てくる。
              言葉が変わり、人の反応が変わり、チャンスの質が変わっていきます。
            </p>
            <p className="mt-2">人生の流れそのものが、静かに切り替わります。</p>
          </div>
        </div>
      </Block>

      <Block title="だから、光庭は「利用する場所」ではない" tone="white" delayMs={220}>
        <div className="space-y-4">
          <p>光庭はサービスではありません。居場所でも、癒し空間でもない。</p>
          <p className="font-semibold text-zinc-900">“状態を共有する場”です。</p>
          <p>
            入った人から、発言が変わり、選択が変わり、人生の展開速度が変わっていく。
            それを維持し、育てていく人だけが、深いステップに進める設計になっています。
          </p>
        </div>
      </Block>

      {/* ここから先は元のまま（見出しはBlockで強調される） */}
      <Block title="結界庭守という存在" tone="white" delayMs={240}>
        <p>
          光庭には、ただの利用者だけでなく、
          <span className="font-semibold text-zinc-900">
            「結界庭守（けっかい にわもり）」
          </span>
          が存在します。
        </p>
        <p>
          結界庭守とは、光庭という場を僕と共に
          <span className="font-semibold text-zinc-900">整え、守り、育てていく創設メンバー</span>。
          「利用する」ではなく、「維持する」側に回る人たちです。
        </p>
        <p>
          この場が完成したとき、「ここに来るとなぜか人生が右肩上がりになる」。
          その現象を、僕とあなたで起こしたい。
        </p>
      </Block>

      <Block title="最後に" tone="soft" delayMs={260}>
        <p>これは、寄付ではありません。みんなで城を作る、創設の儀式です。</p>
        <p className="font-semibold text-zinc-900">
          一人では、ただの点。あなたがいれば、大きな渦になる。
        </p>
        <p>僕の夢に、結界庭守として、加わってくれませんか。</p>
      </Block>
    </div>
  );
}