/**
 * Metodologia.tsx — § 05 Metodologia
 *
 * Tabela editorial com as 10 variáveis do modelo Habitta (V.01–V.10)
 * + nota lateral + botão para repetir o quiz.
 */

// ─── Dados ────────────────────────────────────────────────────────────────────

const VARIABLES = [
  {
    code: 'V.01',
    dimension: 'Centralidade',
    description: 'Distância ao centro histórico e densidade de serviços de referência. Valor 100 = Santo António / Príncipe Real. Valor 0 = limite exterior da AML.',
  },
  {
    code: 'V.02',
    dimension: 'Urbanidade',
    description: 'Nível de densidade construída e actividade urbana por km². Mede a intensidade do tecido urbano — do subúrbio ao centro consolidado.',
  },
  {
    code: 'V.03',
    dimension: 'Tranquilidade',
    description: 'Pressão sonora nocturna e intensidade de tráfego pedonal e automóvel. Dados de ruído ambiente PDM 2024.',
  },
  {
    code: 'V.04',
    dimension: 'Ambiente familiar',
    description: 'Proximidade a parques, escolas públicas e equipamentos para crianças em raio de 500 metros.',
  },
  {
    code: 'V.05',
    dimension: 'Perfil jovem',
    description: 'Presença de população entre os 25 e os 40 anos como indicador de dinamismo cultural e comercial do bairro.',
  },
  {
    code: 'V.06',
    dimension: 'Acessibilidade',
    description: 'Cobertura de rede de metro, autocarro e comboio a distância a pé (≤ 10 min). Frequência nos picos de manhã.',
  },
  {
    code: 'V.07',
    dimension: 'Proximidade ao mar',
    description: 'Distância efectiva a praia atlântica ou frente ribeirinha com uso recreativo consolidado.',
  },
  {
    code: 'V.08',
    dimension: 'Espaço',
    description: 'Tipologias dominantes em oferta — T2+ com varanda ou quintal versus estúdio sem espaço exterior. Fonte: Idealista 2024.',
  },
  {
    code: 'V.09',
    dimension: 'Maturidade',
    description: 'Grau de consolidação urbana. Valor 100 = bairro histórico estável. Valor 0 = zona em transição activa com obras e reconversão em curso.',
  },
  {
    code: 'V.10',
    dimension: 'Potencial de valorização',
    description: 'Tendência de preços nos últimos 36 meses e perspectiva de crescimento baseada em projectos aprovados pela CML e investimento declarado.',
  },
] as const

// ─── Componente ───────────────────────────────────────────────────────────────

type Props = { onRestart: () => void }

export function Metodologia({ onRestart }: Props) {
  return (
    <section className="py-20 bg-verso-paper-deep">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12">

        {/* Section head */}
        <div className="grid md:grid-cols-[180px_1fr] gap-10 mb-14 items-start">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase pt-3 border-t border-verso-rule-soft text-verso-clay">
            § 04 — Como chegámos aqui
          </div>
          <div>
            <h2 className="font-display font-normal text-4xl sm:text-5xl leading-[1.02] tracking-[-0.025em] text-verso-midnight">
              Sem{' '}
              <em className="italic text-verso-clay">truques</em>. Só pesos.
            </h2>
          </div>
        </div>

        {/* Tabela + nota lateral */}
        <div className="grid md:grid-cols-[1fr_260px] gap-12 md:gap-16 items-start">

          {/* Tabela */}
          <div>
            <div className="border border-verso-rule-soft overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[80px_160px_1fr] gap-0 bg-verso-midnight px-5 py-3">
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-verso-paper/40">Código</span>
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-verso-paper/40">Dimensão</span>
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-verso-paper/40 hidden sm:block">Descrição</span>
              </div>

              {/* Linhas */}
              {VARIABLES.map((v, i) => (
                <div
                  key={v.code}
                  className={`grid grid-cols-[80px_1fr] sm:grid-cols-[80px_160px_1fr] gap-0 px-5 py-4 border-t border-verso-rule-soft ${i % 2 === 0 ? 'bg-verso-paper' : 'bg-verso-paper-deep'}`}
                >
                  <span className="font-mono text-[10px] tracking-[0.1em] text-verso-clay self-start pt-0.5">
                    {v.code}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-verso-midnight self-start pt-0.5 sm:pr-4">
                    {v.dimension}
                  </span>
                  <p className="col-span-2 sm:col-span-1 mt-2 sm:mt-0 text-[12px] text-verso-midnight-soft leading-[1.6]">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Nota editorial lateral */}
          <div className="flex flex-col gap-8">
            <div className="p-6 border border-verso-rule-soft bg-verso-paper relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-verso-clay" />
              <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-verso-clay mb-4">
                Nota de redacção
              </p>
              <p className="text-[13px] text-verso-midnight-soft leading-[1.7]">
                Os vectores de cada zona são editoriais — construídos por análise humana a partir de dados INE, PDM e Idealista, com actualização anual.
              </p>
              <p className="text-[13px] text-verso-midnight-soft leading-[1.7] mt-3">
                O algoritmo de recomendação usa distância euclidiana ponderada — cada resposta do questionário ajusta os pesos das variáveis antes do cálculo de afinidade.
              </p>
              <p className="text-[13px] text-verso-midnight-soft leading-[1.7] mt-3">
                Não há respostas certas. Há perfis — e a Habitta compromete-se a dar-lhes uma resposta territorial honesta.
              </p>
            </div>

            {/* Versão do modelo */}
            <div className="px-4 py-3 border border-verso-rule-soft">
              <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-verso-midnight-soft">
                Modelo Habitta · v2.0<br />
                Dataset AML · PDM 2024<br />
                Última actualização · Jan 2026
              </p>
            </div>

            {/* CTA repetir quiz */}
            <button
              onClick={onRestart}
              className="group inline-flex items-center gap-3 border border-verso-rule-soft px-5 py-4 font-mono text-[10px] tracking-[0.14em] uppercase text-verso-midnight hover:border-verso-midnight hover:bg-verso-midnight hover:text-verso-paper transition-all duration-250"
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden
                className="transition-transform group-hover:-translate-x-0.5">
                <path d="M4 1L1 5m0 0l3 4M1 5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Repetir o questionário
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
