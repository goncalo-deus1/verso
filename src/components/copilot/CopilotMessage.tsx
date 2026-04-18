import type { CopilotMsg } from './types'

export function CopilotMessage({ msg }: { msg: CopilotMsg }) {
  const isUser = msg.role === 'user'

  if (msg.isTyping) {
    return (
      <div className="flex justify-start mb-3">
        <div className="flex items-center gap-1 px-4 py-3" style={{ background: '#FAF8F3', border: '1px solid #E8E4DC', borderRadius: '2px' }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: '#C45D3E', display: 'inline-block',
              animation: `copilot-blink 1s ${i * 0.2}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className="max-w-[82%] text-sm leading-relaxed"
        style={{
          padding: '10px 14px',
          background: isUser ? '#0A0A0B' : '#FAF8F3',
          color: isUser ? '#F7F5F0' : '#2C2C2C',
          borderRadius: '2px',
          border: isUser ? 'none' : '1px solid #E8E4DC',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        {msg.text}
      </div>
    </div>
  )
}
