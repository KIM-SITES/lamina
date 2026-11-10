# Lâmina — correção editorial: Margem aberta

Revisão da Etapa 2, em 10/11/2026. Base preservada: `4fc0150`, a proposta panorâmica rejeitada. Nenhum commit, push ou deploy foi realizado. A Etapa 3 não foi iniciada.

## Avaliação

- [Protótipo desde o hero](http://127.0.0.1:4321/estudos/etapa-2/).
- [Seção redesenhada](http://127.0.0.1:4321/estudos/etapa-2/#servicos).
- [Apresentação com estudos, comparações e vídeos](http://127.0.0.1:4321/estudos/etapa-2/revisao/).
- [Galeria local](index.html).
- Comparações completas: [desktop](evidencias/desktop-comparacao-completa.png), [tablet](evidencias/tablet-comparacao-completa.png), [mobile](evidencias/mobile-comparacao-completa.png).

O servidor de desenvolvimento já existente em 4321 foi reutilizado e preservado, com a versão atual respondendo 200. O servidor auxiliar de produção em 4322 foi encerrado; sua porta foi verificada livre.

## Por que a proposta anterior falhou

A direção anterior tratou escala e contraste como substitutos de refinamento. O título amarelo, os planos azuis sob cada linha e o panorama ficaram em competição. Os retângulos interrompiam a leitura do pavilhão e da água; sua presença nos estados intermediários reforçava a sensação de cartaz. A oferta comercial vinha depois de uma abertura pesada, repetindo títulos grandes em linhas uniformes.

Essa estrutura foi **descartada**, não suavizada. A nova seção não tem fundos coloridos atrás do título, não mantém o título sobre a fotografia e não utiliza a faixa turquesa anterior.

## Três alternativas antes da implementação

Os [estudos desktop](alternativas/comparacao-desktop.png) e [mobile](alternativas/comparacao-mobile.png) foram renderizados em HTML antes de alterar o protótipo. As fontes e capturas da proposta rejeitada estão em `anterior/`.

| Alternativa | Ideia | Avaliação |
| --- | --- | --- |
| [Margem aberta](alternativas/vertical.html) | Título e projeto na margem de uma fotografia ampla; detalhe de material junto da revitalização | Selecionada. A fotografia fica livre e os três serviços ocupam relações distintas de espaço. |
| [Pausa horizontal](alternativas/panorama.html) | Fotografia primeiro, título abaixo e três serviços distribuídos | Mais contida, mas a apresentação comercial continua próxima de uma organização convencional em três colunas. |
| [Profundidade](alternativas/assimetrica.html) | Campo profundo, título claro, fotografia e oferta em duas áreas | Atmosfera coerente com a água; conserva peso excessivo de superfície escura para a correção solicitada. |

A [decisão de direção](DIRECAO.md) registra o plano antes da implementação. Os estudos são explorações estáticas, não três versões completas de movimento.

## Composição implementada

**A fotografia é o elemento principal.** No desktop, ela ocupa a margem direita e termina próxima da base do primeiro serviço. O título fica no espaço livre à esquerda, com introdução breve e um atalho para renovação e cuidado. Projeto e construção se ancora na parte inferior dessa margem, em vez de entrar numa lista comprimida junto do título.

Revitalização e reforma se relaciona a um detalhe da borda de pedra e da água. Esse recorte vem da mesma fotografia, por enquadramento CSS estático, sem nova cena ou alteração pictórica. Manutenção e tratamento ocupa uma posição própria, com um desnível moderado e leitura independente. Não há cards, numeração de etapas, resultados comerciais ou obras inventadas.

No mobile, a ordem visual foi redesenhada: fotografia vertical com sangria à esquerda, título abaixo, projeto, renovação com detalhe e manutenção. A imagem chega antes da tipografia; ela não precisa passar por trás do texto. O detalhe de material acompanha a descrição da renovação numa escala menor, preservando a largura do título e a área de toque.

### Tipografia

Syne e Instrument Sans foram preservadas. O título usa peso 400, duas linhas alinhadas à esquerda e escala calculada pela sua coluna. Em 1440px, fica em aproximadamente **70px**, frente a aproximadamente 128px na proposta anterior. O limite superior é 82px. No mobile de 390px, fica em aproximadamente 49px.

Os títulos comerciais têm proporção menor que o título editorial. Descrições e ações permanecem legíveis, sem a repetição de grandes manchetes da revisão anterior. As descrições concisas e os três nomes de serviços foram mantidos. A alteração principal é sua distribuição na composição.

### Cor

As cinco cores foram mantidas:

| Cor | Uso atual |
| --- | --- |
| `#083C63` — azul profundo | Título, estrutura, texto e ação principal do projeto. |
| `#E9F9E7` — claro mineral | Campo de leitura e luz revelada durante a transformação. |
| `#1658BA` — azul luminoso | Links comerciais e estados funcionais. |
| `#16C7AD` — turquesa | Vínculos, bordas das ações e continuidade da identidade. |
| `#F6D567` — amarelo | Detalhe da ação de projeto; a presença do hero permanece preservada. |

O título deixa de ser uma massa amarela. A cor da seção depende mais da própria fotografia, da água e das ações. O campo claro sustenta o espaço negativo; a identidade cromática mais intensa da abertura e do orçamento continua no conjunto da página.

Contrastes sólidos relevantes: profundo/claro **10,44:1**; azul luminoso/claro **6,11:1**; amarelo/profundo **7,97:1**. O turquesa atua como acento e sublinhado, sem texto essencial nessa cor sobre o fundo claro. O atalho de serviços possui base clara própria para manter contraste mesmo no estado inicial da narrativa.

## Continuidade preservada

O destino continua sendo medido no HTML. A mesma fonte horizontal ou vertical da abertura converge para o quadro novo, com recorte `cover` que conserva proporção e referências arquitetônicas. `scene.ts`, shader e renderer não foram alterados.

A atmosfera muda do azul profundo para o claro mineral. No desktop, a leitura da margem aparece entre aproximadamente 80% e 98% da passagem, quando o quadro já liberou a área do texto. Usa apenas opacidade, sem retângulos, blur, deslocamento independente ou efeito de cursor. Foco por teclado torna o grupo imediatamente visível. No mobile, o título vem depois da foto e segue o fluxo normal, sem esse tratamento.

Foi adicionada uma verificação geométrica específica: em 390, 820 e 1440px, nos estados 82%, 90% e 100%, o título visível permanece fora do retângulo da fotografia. A composição também foi revisada nos quadros extraídos das gravações.

O scroll permanece nativo e reversível. Não houve pin, captura de wheel ou espaçador artificial. Refração continua restrita à água, sem influência da posição do mouse ou do dedo. A prova de screenshots idênticas antes/depois do movimento do mouse passou em Chromium, Firefox e WebKit.

### Alternativas gráficas

- Sem WebGL: pôster HTML com o mesmo quadro e recorte.
- Movimento reduzido: composição estática completa, sem a entrada coordenada da margem.
- Falha de textura ou contexto: alternativas e restauração existentes preservadas.
- Sem JavaScript: conteúdo e âncoras presentes; simulação desabilitada com explicação.
- Descarte: as variáveis visuais da história são limpas, além dos recursos gráficos.

## Refinamentos encontrados no navegador

1. O detalhe de material esticava a distribuição das linhas da revitalização e afastava a descrição do título. A grade passou a manter a primeira linha na altura do conteúdo, aproximando a leitura.
2. Zoom de 200% deixava a coluna textual estreita demais. O layout passa a responder à largura real da seção por container queries, inclusive quando o viewport ainda aciona regras de tablet.
3. A auditoria do hero encontrou contraste insuficiente no atalho de serviços ainda fora da tela, sobre o fundo profundo inicial. Sua pequena área funcional passou a ter base clara; ela não acrescenta um plano atrás do título nem altera a relação da fotografia com o conteúdo.
4. A lógica de descarte passou a limpar também o campo cromático, devolvendo a composição estática ao estado claro de leitura.

## Comparação crítica

| Critério | Avaliação e limite |
| --- | --- |
| Leveza | A imagem deixa de ser interrompida por planos tipográficos. O peso do título e das superfícies foi reduzido. |
| Hierarquia | Título editorial, projeto e cuidados têm escalas e posições distintas. O orçamento do primeiro serviço aparece junto da imagem no desktop. |
| Integração | A fotografia se relaciona à margem e à base do projeto; o detalhe aproxima a renovação dos materiais. A imagem mantém limites retos, coerentes com a arquitetura, sem moldura decorativa. |
| Cor | O campo claro e a fotografia assumem mais área. O resultado é deliberadamente menos intenso que a proposta rejeitada; a vivacidade passa a depender mais da água, dos materiais e das ações. |
| Ritmo | A margem vazia entre introdução e projeto é intencional. As demais categorias deixam de repetir três grandes linhas uniformes. |
| Mobile | Fotografia antes do título, cuidado com a largura de leitura e detalhe próximo da renovação. Não replica a grade desktop. |
| Extensão | A seção completa desktop passou de **1742px para 1334px** de altura. Há mais diferenciação interna sem alongar a seção anterior. |
| Originalidade | A relação entre paisagem e detalhe se torna literal na fotografia e nos materiais. A composição ainda utiliza uma grade editorial reconhecível; sua qualidade deve ser julgada pelo conjunto renderizado, não por uma alegação de exclusividade ou premiação. |

A comparação mostra uma substituição estrutural: título fora da fotografia; projeto ligado ao primeiro quadro; renovação ligada ao material; manutenção com espaço próprio. Ela atende à correção de linguagem solicitada. A avaliação estética final permanece com o proprietário.

## Evidências

São **80 capturas principais**, mais comparações e sequências. PNGs preservam a resolução do navegador em densidade 1; as prévias WebP da apresentação são reduzidas. As capturas completas usam um viewport alto na mesma largura para registrar todo o canvas. Dimensões e estados estão em [evidencias.json](evidencias.json).

| Formato | Composição | Continuação comercial | Passagem |
| --- | --- | --- | --- |
| Desktop 1440px | [PNG](evidencias/desktop-servicos.png) | [PNG](evidencias/desktop-oferta.png) | [PNG](evidencias/desktop-passagem.png) |
| Desktop 1920px | [PNG](evidencias/wide-servicos.png) | [PNG](evidencias/wide-oferta.png) | [PNG](evidencias/wide-passagem.png) |
| Tablet 768px | [PNG](evidencias/tablet-768-servicos.png) | [PNG](evidencias/tablet-768-oferta.png) | [PNG](evidencias/tablet-768-passagem.png) |
| Tablet 820px | [PNG](evidencias/tablet-servicos.png) | [PNG](evidencias/tablet-oferta.png) | [PNG](evidencias/tablet-passagem.png) |
| Tablet 1024px | [PNG](evidencias/tablet-1024-servicos.png) | [PNG](evidencias/tablet-1024-oferta.png) | [PNG](evidencias/tablet-1024-passagem.png) |
| Tablet horizontal 1180px | [PNG](evidencias/tablet-horizontal-servicos.png) | [PNG](evidencias/tablet-horizontal-oferta.png) | [PNG](evidencias/tablet-horizontal-passagem.png) |
| Mobile 390px | [PNG](evidencias/mobile-servicos.png) | [PNG](evidencias/mobile-oferta.png) | [PNG](evidencias/mobile-passagem.png) |
| Mobile 320px | [PNG](evidencias/small-servicos.png) | [PNG](evidencias/small-oferta.png) | [PNG](evidencias/small-passagem.png) |

Há também capturas em 375 e 430px. As [comparações desktop](evidencias/desktop-comparacao-completa.png), [tablet](evidencias/tablet-comparacao-completa.png) e [mobile](evidencias/mobile-comparacao-completa.png) colocam a proposta rejeitada à esquerda e a nova à direita, sem reamostrar os PNGs. O espaço inferior acomoda alturas diferentes.

- [Vídeo desktop: chegada e reversão, 1440 × 900](videos/continuidade-desktop.webm).
- [Vídeo mobile: toque e reversão, 390 × 844](videos/continuidade-mobile.webm).
- Quadros reais a cada segundo: [desktop](evidencias/video-desktop-sequencia.png) e [mobile](evidencias/video-mobile-sequencia.png).
- Sem WebGL: [desktop](evidencias/desktop-fallback-destino.png) e [mobile](evidencias/mobile-fallback-destino.png).
- Movimento reduzido: [desktop](evidencias/desktop-movimento-reduzido.png) e [mobile](evidencias/mobile-movimento-reduzido.png).

Os vídeos são brutos, sem montagem ou transições adicionadas. Registram o carregamento inicial, a rolagem e o retorno. As cópias públicas são verificadas contra os arquivos originais.

## Testes e desempenho

**62 verificações do protótipo aprovadas**: [46 da continuidade](testes.json) e [16 específicas da revisão](testes-servicos.json). Mais [6 verificações da apresentação](revisao.json) passaram.

- Chromium, Firefox e WebKit: desenho, repouso, reversão, interrupção, mouse, teclado, pré-seleção, contexto, movimento reduzido, ausência de JS e descarte.
- 320, 375, 390, 430, 768, 820, 1024, 1440 e 1920px: título, oferta e ações dos três serviços sem overflow. A suíte geral também cobre 1280px e rotação durante a passagem.
- Axe A/AA e WCAG 2.1 AA: 0 violações nos estados hero, passagem, chegada e oferta em 390, 820 e 1440px. A apresentação passou em 320, 390, 820 e 1440px.
- Teclado, foco visível e pré-seleção dos três serviços verificados. O resumo demonstrativo continua local, sem envio ou persistência.
- Zoom de 200% por CSS `zoom`: reflow e ações dentro da largura disponível. Não cobre todas as diferenças do zoom nativo de cada navegador.
- Alinhamento do destino, mesma fonte no HTML/canvas e comparação de cobertura. Filtros de amostragem diferentes não produzem pixels idênticos entre WebGL e imagem HTML.
- `npm run check`: **60 arquivos, 0 erros, 0 avisos, 0 hints**. Build: **5 rotas**, concluído.
- Lint de texto: **179 palavras, 0 FAIL, 0 WARN**.

A suíte dos três navegadores foi executada fora do sandbox para evitar o encerramento do Firefox já identificado nas execuções anteriores. Nenhuma configuração do sistema foi alterada.

Medição local em produção, GTX 1650 / ANGLE / Direct3D11, viewport 1440 × 900: 90 amostras rAF, mediana **16,7ms**, p95 **16,8ms**, média da chamada de render no CPU **0,45ms**. Não é medição do tempo real da GPU nem de frames apresentados em aparelhos físicos.

JS alcançável com imports dinâmicos: **182.141 bytes**, soma gzip **66.722 bytes**. CSS: **15.177 bytes**, gzip **3.825 bytes**. Não inclui imagens, fontes, cabeçalhos HTTP e galeria. Detalhes em [desempenho.json](desempenho.json). Nenhuma dependência ou fonte nova foi adicionada.

## Arquivos e preservação

[Inventário com hashes e bytes](inventario.json).

Modificados:

- `src/studies/etapa-2/Services.astro`: nova composição e distribuição das categorias.
- `src/studies/etapa-2/services.css`: substituição integral da direção anterior, proporções e reflow por largura disponível.
- `src/studies/etapa-2/continuity.ts`: campo cromático, entrada da margem e limpeza de estado.
- `src/studies/etapa-2/ServicesReview.astro`: apresentação da correção.
- `scripts/studies/capture-services-redesign.mjs`: destinos de evidência/recursos configuráveis.
- `scripts/studies/verify-services-redesign.mjs`: destino configurável, auditoria do hero e teste de separação entre título e foto.

Criados:

- `src/studies/etapa-2/ServiceEntry.astro`: conteúdo comercial compartilhado pelos três posicionamentos, mantendo os identificadores de seleção.
- `scripts/studies/prepare-editorial-services.mjs`: preservação anterior e três estudos renderizados.
- `scripts/studies/package-editorial-services.mjs`: galeria local, inventário e orçamento de recursos.
- `docs/redirecao/etapa-2/servicos-editoriais/`: estudos, fontes anteriores, capturas, vídeos e relatórios.
- `public/studies/etapa-2/servicos-editoriais/`: 20 prévias WebP e 2 cópias de vídeos.

Preservados: hero e `Story.astro`, original, estudos A/B, `scene.ts`, shader, renderer, fotografias, fontes, dados compartilhados, lógica/componente do orçamento, AGENTS e Skills. As evidências e a documentação das revisões anteriores não foram sobrescritas.

## Limitações e recomendação

A seção é deliberadamente mais clara e contida; a cor da fotografia passa a ter mais responsabilidade na identidade. A margem vazia do desktop e a ordem da fotografia antes do título no celular são decisões para avaliação, não uma redução mecânica do layout anterior.

As fotografias continuam sintéticas e demonstrativas. A fonte horizontal tem 1586px; o novo quadro evita ampliá-la por toda a largura de 1920px, mas isso não equivale a fornecer originais de alta resolução para qualquer densidade. O detalhe usa um recorte específico da fonte, não uma nova fotografia documental.

Não houve teste em aparelhos físicos, Safari real, leitor de tela ou GPU modesta real. A passagem permanece bidimensional. Permanecem as limitações comerciais do protótipo: empresa fictícia e simulação sem envio.

Recomendo avaliar **Margem aberta** como nova direção da seção. O foco desta correção está na relação entre arquitetura, tipografia e leitura comercial, com a imagem livre de caixas e o movimento subordinado ao enquadramento.

Skills utilizadas: frontend-design, ui-ux-pro-max, design-motion-principles, design-taste-frontend e web-design-guidelines. As [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) foram consultadas na revisão. Preferências genéricas de templates, hover de fotografia ou substituição de WebGL não prevaleceram sobre o briefing.

Sugestão de commit: `feat: refina serviços da Lâmina com composição editorial aberta`.
