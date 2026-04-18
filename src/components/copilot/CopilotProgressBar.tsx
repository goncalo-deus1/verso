export function CopilotProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid #F0EDE8' }}>
      <span className="text-xs flex-shrink-0" style={{ color: '#9A9590', fontFamily: 'IBM Plex Mono' }}>
        {current}/{total}
      </span>
      <div className="flex items-center gap-1 flex-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="transition-all duration-400"
            style={{
              height: '2px',
              flex: i === current - 1 ? '2 0 0' : '1 0 0',
              background: i < current ? '#C45D3E' : '#E8E4DC',
              borderRadius: '1px',
            }}
          />
        ))}
      </div>
    </div>
  )
}
