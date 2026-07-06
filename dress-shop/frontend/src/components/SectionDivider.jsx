// A restrained signature motif: a thread-like zigzag rule, nodding to
// the weaving/textile world of a saree shop, used to separate sections.
export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2" aria-hidden="true">
      <svg width="140" height="14" viewBox="0 0 140 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 7 L10 1 L20 13 L30 1 L40 13 L50 1 L60 13 L70 1 L80 13 L90 1 L100 13 L110 1 L120 13 L130 1 L140 7"
          stroke="#C88719"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
