export const atmospheres = [
  {
    id: 'luz', name: 'Luz aberta', image: 'luz-aberta', tone: 'sun',
    title: 'A casa encontra a água.',
    description: 'Linhas retas, pedra clara e uma lâmina azul. A piscina prolonga o espaço de estar.',
    material: 'Pedra clara e cerâmica azul',
    alt: 'Ambiente sintético: piscina retangular azul junto a uma casa clara, árvore e piso de pedra sob o sol.',
  },
  {
    id: 'jardim', name: 'Jardim adentro', image: 'jardim-adentro', tone: 'aqua',
    title: 'O jardim desenha a margem.',
    description: 'Curvas, madeira e água verde. O contorno da piscina acompanha a presença da vegetação.',
    material: 'Cerâmica verde e madeira',
    alt: 'Ambiente sintético: piscina de contorno curvo e revestimento verde entre folhagens tropicais e deck de madeira.',
  },
  {
    id: 'noite', name: 'Depois do sol', image: 'depois-do-sol', tone: 'blue',
    title: 'Outra luz. A mesma pausa.',
    description: 'Quando o céu escurece, a iluminação revela a água e redesenha a atmosfera ao redor.',
    material: 'Revestimento escuro e luz submersa',
    alt: 'Ambiente sintético: piscina contemporânea iluminada à noite, água azul e arquitetura de tijolo junto ao jardim.',
  },
] as const;

export const materialNotes = [
  { title: 'Revestimento', detail: 'A cor continua sob a água.', text: 'O revestimento participa da tonalidade e da leitura de profundidade. Sua escolha também considera limpeza, juntas e condições de uso.' },
  { title: 'Borda', detail: 'O encontro com o lado de fora.', text: 'Textura, desenho e relação com o piso conectam piscina e entorno. Conforto e segurança precisam fazer parte da avaliação do material.' },
  { title: 'Sistemas', detail: 'O cuidado também se planeja.', text: 'Circulação, filtragem e acesso aos equipamentos entram no planejamento. Em uma piscina existente, a avaliação orienta o que preservar ou rever.' },
] as const;

export const processSteps = [
  { title: 'Entender', lead: 'O que você imagina?', text: 'Construir, renovar ou manter. O primeiro contato reúne a necessidade, o tipo de imóvel e o uso desejado para a piscina.' },
  { title: 'Observar', lead: 'Cada espaço tem seu contexto.', text: 'A avaliação do espaço ou da piscina existente ajuda a reconhecer possibilidades e pontos que precisam de atenção.' },
  { title: 'Planejar', lead: 'Dar forma à solução.', text: 'Projeto, materiais e sistemas são considerados em conjunto. O escopo é definido a partir da necessidade e da avaliação.' },
  { title: 'Realizar e cuidar', lead: 'Da solução ao uso.', text: 'O caminho segue para a execução ou para o cuidado da piscina, conforme o serviço escolhido e o escopo definido.' },
] as const;
