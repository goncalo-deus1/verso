import type { Property } from '../types'

export const properties: Property[] = [
  {
    id: '1',
    title: 'Apartamento com Terraço — Príncipe Real',
    slug: 'apartamento-terraco-principe-real',
    location: 'Príncipe Real, Lisboa',
    municipality: 'Lisboa',
    area: 'Príncipe Real',
    price: 695000,
    pricePerSqm: 7722,
    bedrooms: 2,
    bathrooms: 2,
    sqm: 90,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    ],
    tags: ['Terraço', 'Remodelado', 'Centro Histórico', 'Elevador'],
    fitScore: 94,
    fitReasons: ['Área premium para jovens profissionais', 'Boa ligação a transportes', 'Cultura e gastronomia a pé'],
    description: 'Apartamento completamente renovado no coração do Príncipe Real, um dos bairros mais desejados de Lisboa. Com acabamentos premium e um terraço privativo com vista para a cidade, este imóvel combina o charme histórico com o conforto moderno.',
    highlights: ['Terraço privativo de 18m²', 'Cozinha renovada com ilha', 'Tetos altos com estuques originais', 'A 5 min do jardim das Necessidades'],
    yearBuilt: 1910,
    condition: 'Remodelado',
    energyRating: 'B',
    parkingSpots: 0,
    isFeatured: true,
    urbanPlanning: {
      municipality: 'Lisboa',
      pdmStatus: 'PDM de Lisboa em vigor (Aviso n.º 11622/2012)',
      pdmRevisionInProgress: true,
      planningNotes: [
        'Zona de proteção ao Centro Histórico de Lisboa (UNESCO)',
        'Sujeito a condicionantes de ARU — Área de Reabilitação Urbana',
        'AUGI não aplicável — zona consolidada'
      ],
      nearbyProjects: [
        'Extensão da rede de Metro — linha circular (planeamento)',
        'Requalificação do Jardim das Necessidades (em curso)',
      ],
      officialSourceUrl: 'https://pdm.cm-lisboa.pt',
      disclaimer: 'Esta informação tem carácter orientador e não substitui consulta às entidades competentes (CML, DGT/SNIT). Verifique sempre as condicionantes específicas do imóvel junto da Câmara Municipal de Lisboa.'
    }
  },
  {
    id: '4',
    title: 'Apartamento de Luxo — Avenida da Liberdade',
    slug: 'apartamento-luxo-avenida-liberdade',
    location: 'Av. da Liberdade, Lisboa',
    municipality: 'Lisboa',
    area: 'Avenida da Liberdade',
    price: 2100000,
    pricePerSqm: 12000,
    bedrooms: 3,
    bathrooms: 3,
    sqm: 175,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e4a92f082f9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1200&q=80',
    ],
    tags: ['Luxo', 'Vista Cidade', 'Porteiro', 'Parking'],
    fitScore: 82,
    fitReasons: ['Prestígio e localização central', 'Mercado prime — potencial de capital gain', 'Lifestyle urbano de topo'],
    description: 'Apartamento de prestígio num edifício histórico renovado no troço nobre da Avenida da Liberdade. Com acabamentos de arquitetura de autor, portaria 24h e vistas panorâmicas sobre Lisboa.',
    highlights: ['Portaria 24h com segurança', '2 lugares de garagem privativa', 'Acabamentos de arquitecto de renome', 'Vista para a Avenida e jardins'],
    yearBuilt: 1930,
    condition: 'Luxo renovado',
    energyRating: 'A',
    parkingSpots: 2,
    isFeatured: false,
    urbanPlanning: {
      municipality: 'Lisboa',
      pdmStatus: 'PDM de Lisboa em vigor — Zona Histórica nível I',
      pdmRevisionInProgress: true,
      planningNotes: [
        'Imóvel de Interesse Público — condicionantes de alteração de fachada',
        'ARU Lisboa Prime — benefícios fiscais IMI e IMT',
        'Zona ACRRU — projetos sujeitos a aprovação do IHRU'
      ],
      nearbyProjects: [
        'Metro — melhoria das estações do Marquês e Avenida',
        'Projeto de pedonalização parcial da Av. da Liberdade (em estudo)',
      ],
      officialSourceUrl: 'https://pdm.cm-lisboa.pt',
      disclaimer: 'Esta informação tem carácter orientador e não substitui consulta às entidades competentes (CML, IHRU, DGT/SNIT).'
    }
  },
  {
    id: '6',
    title: 'Studio de Design — Marvila, Lisboa',
    slug: 'studio-design-marvila-lisboa',
    location: 'Marvila, Lisboa',
    municipality: 'Lisboa',
    area: 'Marvila',
    price: 310000,
    pricePerSqm: 6200,
    bedrooms: 1,
    bathrooms: 1,
    sqm: 50,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    ],
    tags: ['Studio', 'Industrial', 'Marvila', 'Jovens'],
    fitScore: 89,
    fitReasons: ['Zona emergente com potencial de valorização', 'Ambiente criativo e cosmopolita', 'Boa rentabilidade para arrendamento'],
    description: 'Studio com carácter industrial num dos bairros mais transformados de Lisboa. O Marvila é o novo epicentro criativo da capital — breweries, ateliers, restaurantes de autor e um mercado imobiliário que ainda apresenta janelas de oportunidade.',
    highlights: ['Pé-direito duplo — 4.20m', 'Mezzanine com zona de dormir', 'Edifício histórico de armazém reabilitado', 'A 15 min do Parque das Nações de bicicleta'],
    yearBuilt: 1940,
    condition: 'Remodelado',
    energyRating: 'B',
    parkingSpots: 0,
    isFeatured: false,
    urbanPlanning: {
      municipality: 'Lisboa',
      pdmStatus: 'PDM de Lisboa — Zona de Intervenção Específica (Marvila)',
      pdmRevisionInProgress: true,
      planningNotes: [
        'AUGI de Marvila — em processo de reconversão urbana',
        'Plano de Pormenor de Chelas em vigor para a zona sul',
        'ARU Mouraria/Marvila — elegível para isenção de IMI',
        'Sinal de transformação urbana significativo — zona em transição'
      ],
      nearbyProjects: [
        'Hub Criativo da Beato (concluído — operacional)',
        'Museu de Arte Contemporânea de Lisboa — Marvila (previsto)',
        'Extensão da linha circular do Metro (em estudo)',
        'Requalificação da frente ribeirinha de Marvila',
      ],
      officialSourceUrl: 'https://pdm.cm-lisboa.pt',
      disclaimer: 'Esta informação tem carácter orientador. Marvila é uma zona em transformação urbana activa — as condicionantes podem evoluir. Valide sempre junto da CML e do IHRU antes de qualquer decisão.'
    }
  },
]
