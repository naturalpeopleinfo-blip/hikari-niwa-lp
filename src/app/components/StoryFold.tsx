"use client";

import { useEffect, useRef, useState } from "react";

function useRevealOnView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px", ...opts }
    );

    io.observe(el);
    return () => io.disconnect();
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
      ? "rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
      : tone === "white"
      ? "rounded-2xl border border-zinc-200 bg-white p-5"
      : "";

  return (
    <div
      ref={ref}
      className={[
        shell,
        "transition-all duration-700 ease-out",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-700">
        {children}
      </div>
    </div>
  );
}

export default function StoryFold() {
  return (
    <div className="space-y-10">
      <Block title="はじめに" delayMs={0}>
        <p>こんにちは。植草智史（うえくさ さとし）です。</p>
        <p>
          僕は、<span className="font-semibold text-zinc-900">現象のアーキテクト（設計家）</span>
          として、目に見えない95％の世界を観測し、それを現実に落とし込みます。
          俳優、ヒーリング、統計、水の研究。バラバラに見える要素は、僕の中では一本の線です。
        </p>
        <p>
          人生がなぜ停滞するのか。なぜ突然、流れが変わるのか。
          それは偶然ではなく、<span className="font-semibold text-zinc-900">「場」と「状態」のズレ</span>
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
          <span className="font-semibold text-zinc-900">中途半端を“本物”として渡したくなかった</span>。
        </p>

        <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-sm leading-relaxed text-zinc-700">
            だからこそ、次の結論に辿り着きました。
            <span className="font-semibold text-zinc-900">
              「純度100％で渡せる“器”を、先に作る」
            </span>
            という選択です。
          </p>
        </div>
      </Block>

      <Block title="光庭 -HikariNiwa- とは" delayMs={160}>
        <p>
          光庭は、都内に誕生する<span className="font-semibold text-zinc-900">完全予約制・会員制</span>
          のプライベートサロンです。外の世界の重力を物理的に遮断し、
          入った瞬間に肩書きも悩みも玄関に置いて、
          <span className="font-semibold text-zinc-900">「ゼロ（素の自分）」</span>に戻れる結界として設計します。
        </p>

        <ul className="ml-5 list-disc space-y-1 text-sm text-zinc-700">
          <li>広さ：約50㎡</li>
          <li>用途：対面セッション／少人数の集い／静かな滞在</li>
          <li>利用者：クラファン参加者と、その紹介者のみ</li>
          <li>完成予定：2027年1月</li>
        </ul>

        <p>
          ここなら僕は防御に力を使わない。
          技術、言霊、エネルギーを<span className="font-semibold text-zinc-900">純度100％のまま</span>
          あなたへ注ぎ込める。
          <span className="font-semibold text-zinc-900">今回に限り、封印していた対面を解禁します。</span>
        </p>

        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm leading-relaxed text-zinc-700">
            光庭は“治療室”ではありません。
            会員がいつでも帰ってこられる、大人のための秘密基地であり、コミュニティです。
            エネルギーは循環で増幅する。あなたが寛ぎ、場が整うほど、次の言霊はさらに研ぎ澄まされます。
          </p>
        </div>
      </Block>

      <Block title="結界庭守という存在" tone="white" delayMs={200}>
        <p>
          光庭には、ただの利用者だけでなく、
          <span className="font-semibold text-zinc-900">「結界庭守（けっかい にわもり）」</span>が存在します。
        </p>
        <p>
          結界庭守とは、光庭という場を僕と共に<span className="font-semibold text-zinc-900">整え、守り、育てていく創設メンバー</span>。
          「利用する」ではなく、「維持する」側に回る人たちです。
        </p>
        <p>
          この場が完成したとき、「ここに来るとなぜか人生が右肩上がりになる」。
          その現象を、僕とあなたで起こしたい。
        </p>
      </Block>

      <Block title="最後に" tone="soft" delayMs={240}>
        <p>これは、寄付ではありません。みんなで城を作る、創設の儀式です。</p>
        <p className="font-semibold text-zinc-900">
          一人では、ただの点。あなたがいれば、大きな渦になる。
        </p>
        <p>
          僕の夢に、結界庭守として、加わってくれませんか。
        </p>
      </Block>
    </div>
  );
}