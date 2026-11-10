
# AGENTS.md — Projeto Lâmina

## Contexto

Este projeto é um website demonstrativo para uma empresa fictícia chamada Lâmina — Piscinas & Paisagens.

A empresa oferece projeto, construção, revitalização e manutenção de piscinas.

O website será utilizado como demonstração de capacidade profissional em design e desenvolvimento web.

Não é uma empresa real em operação.

## Objetivo criativo

Produzir uma experiência digital autoral, sofisticada, imersiva e comercialmente funcional.

Nossa referência de qualidade visual e de movimento são os bons projetos encontrados em https://www.landing.love/.

Não copiar layouts, marcas, código ou recursos protegidos das referências.

## Conceito artístico

A direção escolhida é "A Superfície".

Explorar a fronteira entre os ambientes acima e abaixo da água.

A identidade deve trabalhar com:
- Água, luz e profundidade.
- Refração e ondulações.
- Movimento fluido.
- Fotografia cinematográfica.
- Tipografia expressiva.
- Transições entre imagens e seções.
- Interações que reforcem a narrativa.

Evitar animações genéricas, efeitos infantis, excesso de partículas e elementos decorativos sem propósito.

## Responsabilidades do agente

Atuar como:
- Diretor de arte digital.
- Creative developer.
- Especialista em motion design.
- Designer UX/UI.
- Engenheiro front-end.
- Revisor crítico de acessibilidade e desempenho.

Priorizar a qualidade real do resultado renderizado, não apenas a correção do código.

## Animações

Planejar animações como parte da arquitetura da experiência, não como decoração adicionada ao final.

Considerar GSAP, ScrollTrigger, WebGL, shaders, SVG, CSS e APIs nativas quando apropriado.

Não escolher bibliotecas por popularidade.

Se utilizar WebGL:
- Implementar fallback visual.
- Controlar resolução e uso de GPU.
- Tratar perda de contexto gráfico.
- Evitar processamento desnecessário fora da tela.
- Não bloquear a apresentação do conteúdo.
- Respeitar prefers-reduced-motion.

Não utilizar scroll-jacking ou movimento excessivo sem justificativa clara.

## Responsividade

O projeto deve oferecer uma experiência completa em celular, tablet e computador.

Validar pelo menos:
- 320px
- 375px
- 390px
- 430px
- 768px
- 820px
- 1024px
- 1440px
- 1920px

Não reduzir mecanicamente o layout desktop.

Projetar composições, enquadramentos, interações e movimentos próprios para mobile.

Nenhuma funcionalidade essencial pode depender de hover.

Considerar toque, teclado, orientação da tela, capacidades gráficas e dispositivos modestos.

## Acessibilidade

- Navegação por teclado.
- Estados de foco visíveis.
- Contraste adequado.
- Sem conteúdo essencial escondido por animação.
- Suporte a prefers-reduced-motion.
- HTML semântico.
- Layout estável.
- Alternativas para efeitos avançados indisponíveis.

## Identidade comercial

O visitante deve entender rapidamente quais serviços a empresa oferece e como solicitar orçamento.

A experiência visual não deve prejudicar a clareza da navegação.

Não inventar:
- Clientes reais.
- Depoimentos.
- Obras executadas.
- Certificações.
- Resultados comerciais.
- Endereços e contatos reais.

Identificar o projeto como demonstrativo.

## Organização do código

Preferir componentes com responsabilidades claras.

Separar apresentação, dados, estado e lógica de animação.

Não concentrar toda a implementação em um único componente ou arquivo.

Evitar dependências sem justificativa.

Manter o código compreensível e passível de manutenção.

## Skills

Utilizar frontend-design durante a criação e o refinamento visual.

Utilizar web-design-guidelines durante as revisões de interface.

Ler as instruções das Skills antes de aplicá-las.

## Processo de trabalho

Trabalhar em etapas pequenas e verificáveis.

Primeiro validar o conceito e o protótipo interativo.

Depois planejar e implementar o website completo.

Cada etapa exige aprovação do proprietário antes da próxima.

Revisar o resultado real no navegador.

Gerar capturas desktop, tablet e mobile.

Produzir gravações quando necessário para avaliar animações.

Documentar limitações e problemas identificados.

## Versionamento e publicação

Não realizar commits automaticamente.

Não executar push.

Não criar repositórios remotos.

Não fazer deploy sem autorização.

Ao concluir cada etapa, sugerir uma mensagem de commit semântico em português.

Não apagar arquivos importantes nem modificar trabalhos anteriores sem justificativa e autorização.



## Orquestração de Skills e direção artística

Este projeto exige qualidade elevada de creative development, com referência nos melhores trabalhos de galerias como Landing Love.

Antes de iniciar tarefas de design, implementação visual ou animação:

1. Ler as instruções relevantes deste AGENTS.md.
2. Identificar as Skills disponíveis no projeto.
3. Selecionar as Skills apropriadas para a tarefa.
4. Ler seus respectivos SKILL.md antes de aplicá-las.
5. Informar brevemente quais Skills serão utilizadas e por quê.

### Responsabilidades das Skills

- frontend-design:
  Direção artística, identidade, composição, tipografia, originalidade e qualidade visual.

- ui-ux-pro-max:
  Pesquisa de padrões visuais, sistemas de design, hierarquia, responsividade e decisões de UX.

- design-motion-principles:
  Planejamento, implementação e auditoria de movimento, easing, timing, transições e microinterações.

- web-design-guidelines:
  Auditoria de acessibilidade, usabilidade, responsividade e qualidade de interface.

- design-taste-frontend, quando disponível:
  Crítica de decisões genéricas e revisão de acabamento visual. Não substituir automaticamente a identidade, a arquitetura ou as animações já aprovadas.

### Regras de colaboração

As Skills são fontes complementares de conhecimento, não autoridades absolutas.

Não aplicar todas indiscriminadamente.

Em caso de conflito, preservar:
1. As instruções explícitas do proprietário.
2. A identidade e o conceito A — A Superfície.
3. As decisões técnicas e visuais já aprovadas.
4. O funcionamento, a acessibilidade e o desempenho.

Não substituir efeitos WebGL por soluções mais simples apenas porque uma Skill prefere interfaces convencionais.

Não introduzir bibliotecas, layouts ou efeitos desnecessários.

### Processo obrigatório de qualidade

Para cada entrega visual:

1. Planejar a composição e o comportamento.
2. Implementar a experiência.
3. Abrir e experimentar o resultado no navegador.
4. Inspecionar capturas e animações reais.
5. Avaliar computador, tablet e celular.
6. Identificar problemas de composição e movimento.
7. Refinar os problemas encontrados.
8. Executar testes funcionais, responsivos e de acessibilidade.
9. Apresentar evidências antes de solicitar aprovação.

A qualidade do resultado renderizado é tão importante quanto a correção técnica.

Não considerar uma tarefa concluída apenas porque o build passou.

### Motion design

Para tarefas de movimento, consultar design-motion-principles.

Priorizar naturalidade, ritmo, continuidade, boa aceleração e transições coerentes.

O efeito de refração da água é uma assinatura central da Lâmina.

Preservar seu conceito, refinando-o com base em evidências.

Não adicionar animações apenas para tornar a página mais movimentada.

### Restrições

Não realizar commits, push ou deploy automaticamente.

Não avançar para uma nova fase sem autorização.

Recomendar mensagens de commit semânticas em português.

