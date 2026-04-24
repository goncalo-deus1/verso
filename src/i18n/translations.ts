import type { Lang } from '../context/LanguageContext'

const t = {
  // ── Header ──────────────────────────────────────────────────────────────────
  'header.findZone':     { pt: 'Encontrar a minha zona',   en: 'Find my area' },
  'header.areas':        { pt: 'Zonas',                    en: 'Areas' },
  'header.guides':       { pt: 'Guias',                    en: 'Guides' },
  'header.signIn':       { pt: 'Entrar',                   en: 'Sign in' },
  'header.createAcc':    { pt: 'Criar conta',              en: 'Create account' },
  'header.myProfile':    { pt: 'O meu perfil',             en: 'My profile' },
  'header.signOut':      { pt: 'Terminar sessão',          en: 'Sign out' },
  'header.loggedAs':     { pt: 'ligado como',              en: 'logged in as' },

  // ── HomePage hero ────────────────────────────────────────────────────────────
  'home.badge':          { pt: 'Plataforma imobiliária — Portugal', en: 'Real estate platform — Portugal' },
  'home.hero1':          { pt: 'Encontre a zona',          en: 'Find the right' },
  'home.hero2':          { pt: 'certa.',                   en: 'area.' },
  'home.tagline':        { pt: 'Antes de escolher o imóvel, escolha o sítio. Preços reais, contexto urbano e as melhores zonas de Portugal — num só lugar.', en: 'Before choosing the property, choose the location. Real prices, urban context and the best areas of Portugal — all in one place.' },
  'home.cta':            { pt: 'Descobrir a zona certa',  en: 'Discover the right area' },

  // ── Section 01 ───────────────────────────────────────────────────────────────
  'home.s01.eyebrow':    { pt: '01 — Como funciona',       en: '01 — How it works' },
  'home.s01.title':      { pt: 'Começamos pelo sítio.\nNão pelo anúncio.', en: 'We start with location.\nNot the listing.' },
  'home.s01.body':       { pt: 'Os outros portais mostram anúncios. Nós ajudamos a perceber onde quer viver — antes de ver um único imóvel.', en: 'Other portals show listings. We help you understand where you want to live — before seeing a single property.' },
  'home.s01.step1.title':{ pt: 'Defina o seu perfil',     en: 'Define your profile' },
  'home.s01.step1.body': { pt: 'Um quiz de 8 perguntas sobre orçamento, estilo de vida e prioridades. Em 3 minutos percebemos o que realmente importa.', en: 'An 8-question quiz about budget, lifestyle and priorities. In 3 minutes we understand what really matters.' },
  'home.s01.step2.title':{ pt: 'Descubra a zona certa',   en: 'Discover the right area' },
  'home.s01.step2.body': { pt: 'Recomendamos as zonas que melhor se alinham com o seu perfil — com contexto de preços, vida, transporte e planeamento urbano.', en: 'We recommend the areas that best match your profile — with context on prices, lifestyle, transport and urban planning.' },
  'home.s01.step3.title':{ pt: 'Encontre o imóvel certo', en: 'Find the right property' },
  'home.s01.step3.body': { pt: 'Veja imóveis selecionados para o seu perfil, com preços reais, informação urbanística e tudo o que precisa para decidir com confiança.', en: 'See properties selected for your profile, with real prices, urban information and everything you need to decide with confidence.' },

  // ── Section 02 ───────────────────────────────────────────────────────────────
  'home.s02.eyebrow':    { pt: '02 — Concelhos AML',      en: '02 — AML Municipalities' },
  'home.s02.title':      { pt: '18 concelhos.\nUma área metropolitana.', en: '18 municipalities.\nOne metropolitan area.' },
  'home.s02.findZone':   { pt: 'Encontrar a minha zona',  en: 'Find my area' },
  'home.s02.north':      { pt: 'Margem Norte',             en: 'North Bank' },
  'home.s02.south':      { pt: 'Margem Sul',               en: 'South Bank' },
  'home.s02.viewArea':   { pt: 'Ver zona',                 en: 'View area' },

  // ── Stats ────────────────────────────────────────────────────────────────────
  'home.stats.s1.label': { pt: 'concelhos',               en: 'municipalities' },
  'home.stats.s1.sub':   { pt: 'Área Metropolitana de Lisboa', en: 'Lisbon Metropolitan Area' },
  'home.stats.s2.label': { pt: 'freguesias',              en: 'parishes' },
  'home.stats.s2.sub':   { pt: 'Só em Lisboa cidade',     en: 'In Lisbon city alone' },
  'home.stats.s3.label': { pt: 'quiz',                    en: 'quiz' },
  'home.stats.s3.sub':   { pt: 'Para perceber onde viver', en: 'To find where to live' },
  'home.stats.s4.label': { pt: 'comissões',               en: 'commissions' },
  'home.stats.s4.sub':   { pt: 'Sem pressão de venda',    en: 'No sales pressure' },

  // ── Section 03 — Why Habitta ───────────────────────────────────────────────────
  'home.s03.eyebrow':    { pt: '03 — Porquê a Habitta',     en: '03 — Why Habitta' },
  'home.s03.title':      { pt: 'Clareza que não se encontra\nem mais um portal de anúncios.', en: 'Clarity you won\'t find\nin another listings portal.' },
  'home.s03.body':       { pt: 'Construímos a Habitta para quem quer decidir com informação real — não com promessas de agência.', en: 'We built Habitta for those who want to decide with real information — not agency promises.' },
  'home.s03.f1.title':   { pt: 'Zona primeiro',           en: 'Area first' },
  'home.s03.f1.body':    { pt: 'Perceba onde quer viver antes de se comprometer com um imóvel. O sítio certo muda tudo o resto.', en: 'Understand where you want to live before committing to a property. The right location changes everything else.' },
  'home.s03.f2.title':   { pt: 'PDM e urbanismo',         en: 'Planning & urbanism' },
  'home.s03.f2.body':    { pt: 'Planeamento municipal, ARU e transformação urbana — para não ter surpresas depois da escritura.', en: 'Municipal planning, ARU and urban transformation — no surprises after the deed.' },
  'home.s03.f3.title':   { pt: 'Selecção com critério',   en: 'Curated selection' },
  'home.s03.f3.body':    { pt: 'Imóveis escolhidos a dedo, com análise independente, custos reais e informação que os portais não mostram.', en: 'Hand-picked properties with independent analysis, real costs and information other portals hide.' },
  'home.s03.f4.title':   { pt: 'Sem pressão de vendas',   en: 'No sales pressure' },
  'home.s03.f4.body':    { pt: 'Não temos comissões de agências. Só publicamos o que consideramos digno de visita.', en: 'We have no agency commissions. We only publish what we consider worth visiting.' },
  'home.s03.doTitle':    { pt: 'O que fazemos',           en: 'What we do' },
  'home.s03.do1':        { pt: 'Zona antes de imóvel',    en: 'Area before property' },
  'home.s03.do2':        { pt: 'PDM e contexto urbano',   en: 'Planning & urban context' },
  'home.s03.do3':        { pt: 'Custo real de aquisição', en: 'Real acquisition cost' },
  'home.s03.do4':        { pt: 'Imóveis adaptados ao seu perfil', en: 'Properties tailored to your profile' },
  'home.s03.do5':        { pt: 'Guias e análises independentes', en: 'Independent guides and analysis' },
  'home.s03.dontTitle':  { pt: 'O que não fazemos',       en: 'What we don\'t do' },
  'home.s03.dont1':      { pt: 'Anúncios sem critério',   en: 'Uncurated listings' },
  'home.s03.dont2':      { pt: 'Pressão de venda',        en: 'Sales pressure' },
  'home.s03.dont3':      { pt: 'Linguagem vaga ou exagerada', en: 'Vague or exaggerated language' },
  'home.s03.dont4':      { pt: 'Omitir custos reais',     en: 'Hiding real costs' },
  'home.s03.dont5':      { pt: 'Fotografias de stock genéricas', en: 'Generic stock photography' },

  // ── Section 04 — Editorial ───────────────────────────────────────────────────
  'home.s04.eyebrow':    { pt: '04 — Guias',              en: '04 — Guides' },
  'home.s04.title':      { pt: 'Tudo o que precisa\nde saber antes de comprar.', en: 'Everything you need\nto know before buying.' },
  'home.s04.viewAll':    { pt: 'Ver todos os guias',      en: 'View all guides' },
  'home.s04.readArt':    { pt: 'Ler artigo',              en: 'Read article' },

  // ── Closing CTA ──────────────────────────────────────────────────────────────
  'home.cta2.eyebrow':   { pt: 'Comece agora',            en: 'Start now' },
  'home.cta2.title':     { pt: 'Escolha o sítio.\nO imóvel vem a seguir.', en: 'Choose the location.\nThe property comes next.' },
  'home.cta2.body':      { pt: 'Em 3 minutos, sabemos que zonas fazem sentido para si.', en: 'In 3 minutes, we know which areas make sense for you.' },
  'home.cta2.btn':       { pt: 'Começar — 3 min', en: 'Start — 3 min' },

  // ── Footer quote ─────────────────────────────────────────────────────────────
  'home.quote':          { pt: 'Não sabes onde começar? Começa pelo sítio.', en: 'Don\'t know where to start? Start with location.' },
  'home.quizBtn':        { pt: 'Fazer o quiz — 3 min',    en: 'Take the quiz — 3 min' },

  // ── Footer ───────────────────────────────────────────────────────────────────
  'footer.available':    { pt: 'Plataforma disponível — Portugal', en: 'Platform available — Portugal' },
  'footer.startQuiz':    { pt: 'Começar o quiz',          en: 'Start the quiz' },
  'footer.brand':        { pt: 'Encontre a zona certa antes de encontrar o imóvel certo. Uma plataforma editorial para decisões informadas em Portugal.', en: 'Find the right area before finding the right property. An editorial platform for informed decisions in Portugal.' },
  'footer.explore':      { pt: 'Explorar',                en: 'Explore' },
  'footer.buyerQuiz':    { pt: 'Quiz de comprador',       en: 'Buyer quiz' },
  'footer.areas':        { pt: 'Zonas',                   en: 'Areas' },
  'footer.editGuides':   { pt: 'Guias editoriais',        en: 'Editorial guides' },
  'footer.resources':    { pt: 'Recursos',                en: 'Resources' },
  'footer.buyerGuide':   { pt: 'Guia do comprador',       en: 'Buyer\'s guide' },
  'footer.costs':        { pt: 'Custos de compra',        en: 'Purchase costs' },
  'footer.financing':    { pt: 'Financiamento',           en: 'Financing' },
  'footer.cpcv':         { pt: 'CPCV explicado',          en: 'CPCV explained' },
  'footer.imt':          { pt: 'IMT & IMI',               en: 'IMT & IMI' },
  'footer.official':     { pt: 'Fontes Oficiais',         en: 'Official Sources' },
  'footer.copyright':    { pt: '© 2026 Habitta — informação de carácter orientador, não substitui aconselhamento jurídico.', en: '© 2026 Habitta — guidance information only, does not replace legal advice.' },
  'footer.privacy':      { pt: 'Privacidade',             en: 'Privacy' },
  'footer.terms':        { pt: 'Termos',                  en: 'Terms' },
  'footer.contact':      { pt: 'Contacto',                en: 'Contact' },

  // ── QuizFlow ─────────────────────────────────────────────────────────────────
  'quiz.welcome.title':  { pt: 'Começa com o sítio.',     en: 'Start with location.' },
  'quiz.welcome.sub':    { pt: 'Nove perguntas. Dois minutos. Depois mostramos-te onde procurar na AML.', en: 'Nine questions. Two minutes. Then we show you where to look in the AML.' },
  'quiz.welcome.start':  { pt: 'Começar',                 en: 'Start' },
  'quiz.welcome.skip':   { pt: 'Já sei onde quero viver — saltar', en: 'I know where I want to live — skip' },
  'quiz.loading':        { pt: 'A cruzar o teu perfil com 41 zonas da AML…', en: 'Matching your profile against 41 AML areas…' },
  'quiz.nav.back':       { pt: 'Voltar',                  en: 'Back' },
  'quiz.nav.next':       { pt: 'Seguinte',                en: 'Next' },
  'quiz.result.altTitle':{ pt: 'Também podes considerar', en: 'Also consider' },
  'quiz.result.viewProp':{ pt: 'Ver imóveis',             en: 'View properties' },
  'quiz.result.explore': { pt: 'Explorar',                en: 'Explore' },
  'quiz.result.restart': { pt: 'Fazer outra vez',         en: 'Take again' },
  'quiz.result.tradeoff':{ pt: 'O compromisso:',          en: 'The trade-off:' },
  'quiz.result.discover':{ pt: 'Conhecer',                en: 'Explore' },
  'quiz.result.lowScore':{ pt: 'Não encontrámos zonas com correspondência forte. Estes são os melhores resultados disponíveis — considera alargar os critérios.', en: 'We didn\'t find areas with a strong match. These are the best available results — consider broadening your criteria.' },
  'quiz.result.footer':  { pt: 'Isto é um começo, não um veredicto. O algoritmo mede distâncias — só tu sabes o que é chegar a casa.\n          Caminha por algumas destas ruas antes de decidir.', en: 'This is a starting point, not a verdict. The algorithm measures distances — only you know what it feels like to come home.\n          Walk through some of these streets before deciding.' },
  'quiz.lock.title':     { pt: 'Cria uma conta para ver o resultado completo', en: 'Create an account to see the full result' },
  'quiz.lock.body':      { pt: 'O nome da zona e a descrição estão reservados a utilizadores registados.', en: 'The area name and description are reserved for registered users.' },
  'quiz.lock.register':  { pt: 'Criar conta gratuita',   en: 'Create free account' },
  'quiz.lock.signin':    { pt: 'Entrar',                  en: 'Sign in' },

  // ── Auth page ────────────────────────────────────────────────────────────────
  'auth.tagline':        { pt: 'Decisões melhores\ncomeçam aqui.', en: 'Better decisions\nstart here.' },
  'auth.desc':           { pt: 'Crie a sua conta gratuita e aceda a recomendações personalizadas, imóveis guardados e guias editoriais.', en: 'Create your free account and access personalised recommendations, saved properties and editorial guides.' },
  'auth.tab.login':      { pt: 'Entrar',                  en: 'Sign in' },
  'auth.tab.register':   { pt: 'Criar conta',             en: 'Create account' },
  'auth.login.title':    { pt: 'Bem-vindo de volta',      en: 'Welcome back' },
  'auth.login.sub':      { pt: 'Aceda aos seus imóveis guardados e recomendações.', en: 'Access your saved properties and recommendations.' },
  'auth.register.title': { pt: 'Criar conta gratuita',   en: 'Create free account' },
  'auth.register.sub':   { pt: 'Junte-se à Habitta e encontre o imóvel certo — de forma informada.', en: 'Join Habitta and find the right property — the informed way.' },
  'auth.name':           { pt: 'Nome',                    en: 'Name' },
  'auth.email':          { pt: 'Email',                   en: 'Email' },
  'auth.password':       { pt: 'Password',                en: 'Password' },
  'auth.forgot':         { pt: 'Esqueceu?',               en: 'Forgot?' },
  'auth.submit.login':   { pt: 'Entrar na conta',         en: 'Sign in' },
  'auth.submit.register':{ pt: 'Criar conta gratuita',   en: 'Create free account' },
  'auth.loading':        { pt: 'A processar...',          en: 'Processing...' },
  'auth.terms':          { pt: 'Ao criar uma conta, aceita os Termos de Serviço e a Política de Privacidade.', en: 'By creating an account, you agree to the Terms of Service and Privacy Policy.' },
  'auth.google':         { pt: 'Continuar com Google',    en: 'Continue with Google' },
  'auth.switch.toReg':   { pt: 'Criar conta gratuita',   en: 'Create free account' },
  'auth.switch.toLg':    { pt: 'Entrar',                  en: 'Sign in' },
  'auth.noAccount':      { pt: 'Ainda não tem conta? ',  en: 'Don\'t have an account? ' },
  'auth.hasAccount':     { pt: 'Já tem conta? ',          en: 'Already have an account? ' },
  'auth.back':           { pt: 'Voltar ao início',        en: 'Back to home' },
  'auth.perks.saved':    { pt: 'Imóveis guardados',       en: 'Saved properties' },
  'auth.perks.profile':  { pt: 'Perfil de comprador',    en: 'Buyer profile' },
  'auth.perks.alerts':   { pt: 'Alertas personalizados', en: 'Personalised alerts' },
  'auth.perks.history':  { pt: 'Histórico do quiz',      en: 'Quiz history' },
  'auth.account':        { pt: 'A sua conta',            en: 'Your account' },
} as const

export type TKey = keyof typeof t

export function useT(lang: Lang) {
  return (key: TKey): string => t[key][lang]
}
