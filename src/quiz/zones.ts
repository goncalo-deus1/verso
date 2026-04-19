/**
 * quiz/zones.ts
 *
 * Dados mockados das zonas para o motor de quiz VERSO.
 * Valores calibrados para ser realistas e consistentes entre zonas.
 *
 * Escala de atributos (0–10):
 *  0–3  = fraco / ausente
 *  4–6  = moderado
 *  7–8  = bom
 *  9–10 = excelente / referência
 */

import type { Zone } from './types'

export const zones: Zone[] = [
  {
    id: 'principe-real',
    nome: 'Príncipe Real',
    regiao: 'Lisboa',
    cidadesCompativeis: ['lisboa'],
    precoMin: 550000,
    tempoCentroLisboa: 5,

    centralidade:  10, // No coração de Lisboa — tudo a pé
    espaco:         3, // T2 a 550k+ significa apartamentos pequenos ou muito caros
    exterior:       4, // Terraços existem mas raros e caros
    natureza:       5, // Jardim das Necessidades próximo
    urbano:        10, // Melhor oferta urbana de Lisboa — restaurantes, cultura, Chiado
    equilibrio:     7, // Tem calma vs Bairro Alto mas é urbano intenso
    tranquilo:      5, // Algum ruído mas menos que Baixa
    investimento:   9, // Procura premium, valorização historicamente sólida
    qualidadeVida:  9, // Tudo acessível, bom stock habitacional histórico
    familia:        5, // Funciona mas escolas e parques são limitados no imediato

    pequenaDescricao:
      'O bairro mais sofisticado de Lisboa — jardins históricos, restaurantes de referência e uma comunidade cosmopolita. ' +
      'Preços elevados para apartamentos pequenos; o metro quadrado é dos mais caros do país. ' +
      'Ideal para quem quer Lisboa a 100% sem carro.',
  },

  {
    id: 'cascais',
    nome: 'Cascais',
    regiao: 'Linha de Cascais',
    cidadesCompativeis: ['lisboa'],
    precoMin: 350000,
    tempoCentroLisboa: 40,

    centralidade:   6, // Cascais tem centro próprio mas Lisboa fica a 40 min
    espaco:         8, // T2-T3 com melhor rácio espaço/€ que Lisboa centro
    exterior:       9, // Jardins, terraços, praia a 5 min
    natureza:       9, // Costa e Sintra-Cascais Parque Natural
    urbano:         7, // Vida urbana própria — não depende de Lisboa para o dia-a-dia
    equilibrio:     9, // Definição de equilíbrio: mar + acessibilidade + qualidade
    tranquilo:      8, // Ritmo mais lento que Lisboa, seguro
    investimento:   8, // Mercado sólido, procura internacional sustentada
    qualidadeVida: 10, // Uma das melhores QV de Portugal — saúde, ensino, comércio
    familia:        9, // Escolas internacionais, espaço, praia — ideal para famílias

    pequenaDescricao:
      'A melhor qualidade de vida perto de Lisboa — praias, natureza e um centro histórico pedonal. ' +
      'Linha de comboio directa a Lisboa em 40 min. ' +
      'Mercado sólido com forte procura internacional e de famílias.',
  },

  {
    id: 'bonfim',
    nome: 'Bonfim',
    regiao: 'Porto',
    cidadesCompativeis: ['porto'],
    precoMin: 210000,
    tempoCentroPorto: 10,

    centralidade:   8, // Metro a 3 min, próximo de Aliados e Baixa
    espaco:         5, // Melhor que Príncipe Real mas stock histórico com áreas médias
    exterior:       4, // Terraços existem mas não é regra
    natureza:       3, // Pouca natureza imediata — parques escassos
    urbano:         9, // Bairro criativo em plena efervescência — restaurantes, cervejeiras
    equilibrio:     6, // Ainda em gentrificação — menos equilibrado que Cascais
    tranquilo:      4, // Vida nocturna, obras, barulho de construção
    investimento:  10, // Melhor zona de investimento do Porto neste momento
    qualidadeVida:  7, // Bom mas não excecional — a consolidar
    familia:        5, // Possível mas não o destino mais evidente para famílias

    pequenaDescricao:
      'O bairro mais dinâmico do Porto — criativo, reabilitado e em plena valorização. ' +
      'Melhor custo por metro quadrado para investimento de curto-médio prazo. ' +
      'Mais adequado para casais jovens e urbanos do que para famílias com filhos.',
  },

  {
    id: 'marvila',
    nome: 'Marvila',
    regiao: 'Lisboa Oriental',
    cidadesCompativeis: ['lisboa'],
    precoMin: 270000,
    tempoCentroLisboa: 15,

    centralidade:   7, // 15 min a pé ou 5 min de metro ao centro
    espaco:         7, // Fábricas convertidas = apartamentos maiores por menos €
    exterior:       5, // Frente ribeirinha crescente mas ainda limitado
    natureza:       4, // Tejo próximo mas natureza urbana ainda a desenvolver
    urbano:         8, // Breweries, galerias, restaurantes — polo criativo de Lisboa
    equilibrio:     6, // Ainda em consolidação — algumas zonas menos desenvolvidas
    tranquilo:      4, // Zona em transformação — construção, barulho
    investimento:  10, // Maior potencial de valorização de Lisboa para os próximos 5 anos
    qualidadeVida:  6, // A melhorar — comércio e infra ainda a crescer
    familia:        4, // Escola e serviços ainda escassos para famílias com filhos

    pequenaDescricao:
      'A zona mais interessante para investimento em Lisboa — fábricas convertidas, preços moderados e crescimento acelerado. ' +
      'Ribeirinha emergente com breweries e galerias de arte. ' +
      'Não recomendado para quem precisa de infra-estrutura familiar já estabelecida.',
  },

  {
    id: 'braga-norte',
    nome: 'Braga Norte',
    regiao: 'Braga',
    cidadesCompativeis: ['porto', 'outra', 'sem_localizacao_fixa'],
    precoMin: 160000,
    tempoCentroPorto: 55,

    centralidade:   4, // Braga tem centro próprio de qualidade mas não é Lisboa/Porto
    espaco:        10, // O melhor rácio espaço/€ das 6 zonas — T3/T4 por 200-250k
    exterior:       9, // Jardins, terraços, casas com quintal são comuns
    natureza:       7, // Parques e Peneda-Gerês próximo
    urbano:         5, // Braga tem vida própria mas nível abaixo de Lisboa/Porto
    equilibrio:     8, // Muito bom equilíbrio cidade/tranquilidade
    tranquilo:      8, // Seguro, ritmo mais lento, menos pressão
    investimento:   7, // Crescimento sólido mas menor liquidez que Lisboa/Porto
    qualidadeVida:  8, // Excelente — saúde, ensino, comércio de qualidade
    familia:       10, // Referência nacional para famílias — escolas, espaço, segurança

    pequenaDescricao:
      'O melhor custo-benefício de Portugal — T3 com jardim por menos que um T1 em Lisboa. ' +
      'Cidade tech em expansão com universidade e qualidade de vida excepcional. ' +
      'Ideal para famílias e teletrabalho; 55 min ao Porto se necessário.',
  },

  {
    id: 'comporta',
    nome: 'Comporta',
    regiao: 'Alentejo Litoral',
    cidadesCompativeis: ['lisboa', 'outra', 'sem_localizacao_fixa'],
    precoMin: 450000,
    tempoCentroLisboa: 90,

    centralidade:   2, // Isolada — a mais afastada de centros urbanos
    espaco:        10, // Lotes generosos, moradias com piscina, natureza aberta
    exterior:      10, // Sempre — varanda, jardim, piscina são padrão
    natureza:      10, // A zona com mais natureza das 6 — pinhais, arroz, oceano
    urbano:         2, // Quase inexistente — sem restaurantes diários, sem vida nocturna
    equilibrio:     5, // Excelente parte do tempo, mas pode isolar
    tranquilo:     10, // O ponto de partida — silêncio, ritmo mínimo
    investimento:   9, // Valorização forte, procura internacional premium
    qualidadeVida:  8, // Alta quando estás lá — mas dependente de carro para tudo
    familia:        6, // Bom se os filhos são pequenos; escola próxima escassa para mais velhos

    pequenaDescricao:
      'O destino de luxo discreto do Alentejo Litoral — pinhais, praias atlânticas e silêncio total. ' +
      'Valorização premium com forte procura internacional. ' +
      'Só faz sentido para teletrabalho ou fins-de-semana — isolamento real e sem transportes públicos.',
  },
]
