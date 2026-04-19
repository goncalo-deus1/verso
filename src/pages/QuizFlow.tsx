import QuizContainer from '../components/quiz/QuizContainer'

export default function QuizFlow() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F1EA' }}>
      {/* Logo */}
      <div className="px-8 lg:px-12 pt-8 pb-0">
        <span className="font-display text-xl" style={{ color: '#0E1116', letterSpacing: '-0.5px' }}>VERSO</span>
      </div>
      <QuizContainer />
    </div>
  )
}
