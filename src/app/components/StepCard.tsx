type StepItem = {
  title: string;
  catch: string;
  description: string;
  contents: {
    name: string;
    detail: string;
  }[];
};

export default function StepCard({
  step,
  price,
  data,
}: {
  step: string;
  price?: string;
  data: StepItem;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-xs tracking-widest text-zinc-500">{step}</p>
        <h3 className="mt-1 text-xl font-semibold">{data.title}</h3>
        {price && (
          <p className="mt-2 text-sm font-semibold text-zinc-800">{price}</p>
        )}
      </div>

      <p className="mb-4 text-sm font-semibold text-zinc-900">
        {data.catch}
      </p>

      <p className="mb-8 text-sm leading-relaxed text-zinc-700">
        {data.description}
      </p>

      <div className="space-y-4">
        {data.contents.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
          >
            <p className="text-sm font-semibold text-zinc-900">
              {`付与 ${idx + 1}｜${item.name}`}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}