import type { CopilotMsg } from './types'

export function CopilotMessage({ msg }: { msg: CopilotMsg }) {
  const isUser = msg.role === 'user'

  if (msg.isTyping) {
    return (
      <div className="flex justify-start mb-3">
        <div className="flex items-center gap-1 px-4 py-3" style={{ background: '#F2EDE4', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: '#C2553A', display: 'inline-block',
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
          background: isUser ? '#1E1F18' : '#F2EDE4',
          color: isUser ? '#F2EDE4' : '#1E1F18',
          borderRadius: '2px',
          border: isUser ? 'none' : '1px solid rgba(30, 31, 24, 0.125)',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        {msg.text}
      </div>
    </div>
  )
}
