interface Props {
  content: string
}

export default function BoardsDetailBody({ content }: Props) {
  return (
    <section className="mt-[100px] flex flex-col gap-[28px] pb-10">
      <h2 className="text-s2-bold text-gray-900">본문</h2>
      <div
        className="prose max-w-none text-gray-900"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  )
}
