export default function StoryFold() {
  return (
    <>
      <h2 className="text-lg font-semibold">
        このクラウドファンディングに対する想い
      </h2>

      <div className="mt-5 space-y-10">
        {/* はじめに */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">はじめに</h3>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-700">
            <p>こんにちは。植草智史（うえくさ さとし）です。</p>
            <p>
              僕は、
              <span className="font-semibold text-zinc-900">
                現象のアーキテクト（設計家）
              </span>
              として、目に見えない95％の世界を観測し、それを現実に落とし込む仕事をしています。
            </p>
            <p>
              人生がなぜ停滞するのか。なぜ突然、流れが変わるのか。
              それらは偶然ではなく、「場」と「状態」のズレから起きる。
              その原点は、幼い頃に大切な祖母を救えなかった、あの日の無力感でした。
            </p>
          </div>
        </div>

        {/* 封印の理由 */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h3 className="text-sm font-semibold text-zinc-900">
            なぜ、セッションを封印したのか
          </h3>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-700">
            <p>僕は長い間、対面セッションを封印してきました。理由はひとつ。</p>
            <p className="font-semibold text-zinc-900">
              場所が、僕の出力に追いつかなかった。
            </p>
            <p>
              どんなに技術があっても、場が濁っていれば、あなたに届く純度は下がってしまう。
              それが、どうしても許せなかった。
            </p>
          </div>
        </div>

        {/* 光庭 */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">
            光庭 -HikariNiwa- とは
          </h3>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-700">
            <p>光庭は、都内に誕生する完全予約制・会員制のプライベートサロンです。</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>広さ：約50㎡</li>
              <li>用途：対面セッション／少人数の集い／静かな滞在</li>
              <li>利用者：クラファン参加者と、その紹介者のみ</li>
              <li>完成予定：2027年1月</li>
            </ul>
            <p>
              音、光、素材、動線。すべては人が「ゼロ（素）」に戻るための設計。
              派手な装飾はしません。
            </p>
          </div>
        </div>

        {/* 結界庭守 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-zinc-900">
            結界庭守という存在
          </h3>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-700">
            <p>
              光庭には、ただの利用者だけでなく、
              <span className="font-semibold text-zinc-900">
                「結界庭守（けっかい にわもり）」
              </span>
              が存在します。
            </p>
            <p>
              「利用する」ではなく、「維持する」側に回る人たちです。
            </p>
          </div>
        </div>

        {/* 最後に */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h3 className="text-sm font-semibold text-zinc-900">最後に</h3>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-700">
            <p>これは、寄付ではありません。みんなで城を作る、創設の儀式です。</p>
            <p className="font-semibold text-zinc-900">
              一人では、ただの点。あなたがいれば、大きな渦になる。
            </p>
            <p>僕の夢に、結界庭守として、加わってくれませんか。</p>
          </div>
        </div>
      </div>
    </>
  );
}