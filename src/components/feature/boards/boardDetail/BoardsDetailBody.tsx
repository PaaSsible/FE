interface Props {
  content: string
}

export default function BoardsDetailBody({ content }: Props) {
  return (
    <section className="mt-8 pb-10">
      <h2 className="text-s2-bold mb-3 text-gray-900">본문</h2>
      <div
        className="text-b4-medium leading-relaxed text-gray-900"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  )
}
