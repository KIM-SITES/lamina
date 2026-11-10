# Lâmina — Etapa 2: protótipo da continuidade

Entrega de 10/11/2026. Base experimental: composição A, “Superfície arquitetônica contínua”. Escopo executado: hero, passagem para o primeiro bloco de serviços e preservação dos caminhos comerciais. A Etapa 3 não foi iniciada.

## Experimentar e comparar

Execute `npm run dev` na raiz do projeto e abra:

- [Protótipo da Etapa 2](http://127.0.0.1:4321/estudos/etapa-2/).
- [Apresentação com comparações e vídeos](http://127.0.0.1:4321/estudos/etapa-2/revisao/).
- [Alternativa sem WebGL](http://127.0.0.1:4321/estudos/etapa-2/?grafico=fallback).
- [Composição A](http://127.0.0.1:4321/estudos/etapa-1/), [composição B](http://127.0.0.1:4321/estudos/etapa-1/?composicao=editorial) e [original](http://127.0.0.1:4321/).

Sem servidor, abra a [galeria local](index.html). Ela reúne PNGs e vídeos brutos com caminhos relativos. As imagens podem ser abertas separadamente em resolução original. Os servidores usados durante a execução foram encerrados; as portas 4321 e 4322 foram verificadas livres, para liberar `npm run dev`.

## Direção artística e avaliação crítica

A proposta mantém a fotografia arquitetônica e a escala tipográfica da composição A. A mudança principal é fazer a cor participar da transformação: o azul de profundidade se abre em turquesa, que ocupa integralmente os serviços. O amarelo aparece no título de grande escala e na ação principal. O hero permanece legível mesmo antes da fotografia carregar.

Na comparação em viewport idêntico, há uma diferença perceptível em dois níveis: o título deixa de depender do branco para dominar a composição; os serviços deixam de habitar o campo claro da Etapa 1 e passam a constituir um ambiente turquesa. O pavilhão, a borda diagonal e os degraus submersos mantêm referências reconhecíveis durante a passagem. A fotografia não é trocada por outra cena no meio da transformação.

| Critério | Avaliação do resultado renderizado |
| --- | --- |
| Intensidade cromática | Mais forte que A: amarelo em grande escala, azul no cabeçalho e turquesa ocupando toda a apresentação comercial. Não depende de detalhes de interface. |
| Harmonia | O verde da água e o calor da pedra encontram correspondência no turquesa e no amarelo. O azul ancora a navegação e o encerramento. A saturação dos serviços é deliberadamente alta. |
| Originalidade | A continuidade da mesma piscina e do recorte editorial constitui uma ideia específica para “A Superfície”. A estrutura do destino ainda é uma composição editorial de imagem e texto; sua autoria depende da relação com a passagem, não de um layout final inédito em todos os momentos. |
| Sofisticação | Escala tipográfica, poucos materiais, alinhamentos e ausência de cards favorecem a proposta. O turquesa é mais assertivo que a sobriedade de A; essa intensidade precisa ser avaliada pelo proprietário. |
| Hierarquia | “Piscinas” dá clareza imediata ao serviço; subtítulo, descrição e orçamento seguem em níveis distintos. Serviços têm títulos e ações próprios, sem ocultação por revelações. |
| Continuidade | A fotografia converge para o destino HTML sem corte, deformação de proporção ou duplicação de cenas. A cor e a saída da tipografia acompanham o mesmo progresso. |
| Refração | Contida na água e perceptível durante a passagem, sem tornar a arquitetura instável. É um efeito óptico estilizado sobre fotografia, não uma simulação volumétrica da piscina. |
| Qualidade cinematográfica | Há mudança coordenada de quadro, recorte, luz, margem e atmosfera, com reversão determinística. A experiência permanece uma câmera bidimensional sobre uma imagem; não implica paralaxe real entre planos. |
| Mobile | Matriz vertical própria, quebra tipográfica e ações reorganizadas. A imagem chega primeiro; a descrição comercial continua pelo fluxo natural. Não replica as duas colunas do desktop. |
| Clareza comercial | Projeto/construção, revitalização/reforma e manutenção/tratamento aparecem explicitamente. Ações selecionam o serviço na simulação reaproveitada. Ambientes continuam acessíveis no estudo anterior. |

As [comparações desktop](evidencias/desktop-comparacao-cromatica.png), [tablet](evidencias/tablet-comparacao-cromatica.png) e [mobile](evidencias/mobile-comparacao-cromatica.png) usam original, A e Etapa 2 lado a lado. A [comparação dos serviços](evidencias/desktop-servicos-comparacao.png) torna a mudança de presença cromática especialmente clara. O resultado avança em cor e conexão espacial; não é apresentado como equivalência comprovada aos melhores projetos de uma galeria profissional.

## Paleta e aplicação

| Cor | Valor | Aplicação |
| --- | --- | --- |
| Profundidade | `#083C63` | Base do hero, cabeçalho, tipografia sobre turquesa, rodapé e estrutura de navegação. |
| Turquesa | `#16C7AD` | Campo contínuo revelado durante a passagem e fundo integral dos serviços. |
| Luz solar | `#F6D567` | Título principal, ação de orçamento, destaque tipográfico e foco. |
| Azul | `#1658BA` | Caminho para a simulação de orçamento, com contraste em relação aos serviços. |
| Luz | `#E9F9E7` | Texto sobre os azuis. Não é utilizada como grande superfície dominante. |

O campo da história interpola azul profundo → turquesa. Essa interpolação tem função narrativa e não é um gradiente decorativo repetido pelas seções. Os cabeçalhos mantêm azul sólido para não perder contraste no cruzamento entre fotografia e campo cromático.

Contrastes calculados a partir dos tokens utilizados:

| Par texto / fundo | Razão |
| --- | ---: |
| Profundidade / turquesa | 5,34:1 |
| Solar / profundidade | 7,97:1 |
| Luz / profundidade | 10,44:1 |
| Solar / azul | 4,66:1 |
| Luz / azul | 6,11:1 |
| Profundidade / solar | 7,97:1 |

Esses valores descrevem superfícies sólidas. Sobre fotografia, a camada escura mantém a leitura e desaparece junto com a tipografia do hero. Auditoria automática sem violações nos estados intermediários inspecionados não prova contraste em cada pixel de todos os quadros possíveis.

## Coreografia implementada

1. O HTML apresenta marca, fotografia, mensagem e caminhos comerciais imediatamente. O canvas é uma melhoria visual sobre o pôster existente.
2. O scroll nativo controla um único progresso, sem pin, captura de wheel, espaçador artificial ou atraso obrigatório.
3. O texto do hero sai entre aproximadamente 8% e 53% da passagem. Elementos focados permanecem legíveis por teclado.
4. A moldura começa a convergir depois de 13%. O recorte interno já se desloca a partir de 8%; uma aproximação intermediária de até 2,5% se acomoda completamente no destino.
5. O azul se transforma em turquesa; a sombra da fotografia diminui. A refração atravessa a região aquática e a pequena variação da borda inferior se acomoda no quadro editorial.
6. A fotografia encontra o retângulo medido do elemento HTML nos serviços. Ao final, a borda é estável e a amplitude óptica chega a zero. Reverter o scroll reproduz o mesmo estado para o mesmo progresso.

O trecho ocupa 95% da altura do hero no desktop e 90% no mobile. A curva suave é aplicada às transformações internas; `ScrollTrigger` usa progresso linear e `scrub: true`, sem inércia que faça a imagem continuar viajando depois da rolagem. A entrada do texto comercial decorre do fluxo da página.

### Fotografia, recortes e máscara

Não foram geradas novas cenas. As matrizes aprovadas da Etapa 1 foram reaproveitadas:

- Horizontal: **1586 × 992**, com janela editorial em `x=440, y=0, 790 × 992`.
- Vertical: **1024 × 1536**, com janela editorial em `x=102, y=160, 820 × 1100`.

O algoritmo recalcula `cover` a cada formato da moldura e preserva a proporção da fonte. A orientação vertical utiliza a matriz vertical; tablet horizontal retorna à horizontal. As duas matrizes são imagens distintas: a troca de orientação não é apresentada como uma câmera contínua entre fotografias diferentes.

A máscara aquática usa coordenadas da imagem, com margem conservadora em relação à borda. O shader não recebe coordenadas do ponteiro. As [vistas horizontal](evidencias/mascara-horizontal.png) e [vertical](evidencias/mascara-vertical.png) mostram o domínio óptico em alaranjado: a faixa de segurança deixa pedra seca, vegetação e edifício fora do efeito. É uma delimitação analítica específica para essas duas matrizes, não uma segmentação automática reutilizável em qualquer fotografia.

### Influência do cursor

O caminho novo não registra movimento de mouse ou toque e não contém uniformes de posição do ponteiro. Não há ripple, iluminação localizada, zoom de fotografia por hover ou animação ambiental em loop. Apenas scroll, resize e mudanças de capacidade/preferência atualizam a cena.

Além da inspeção do código, os testes movem o cursor por 12 posições sobre a cena parada, capturam a tela antes/depois e comparam SHA-256: **imagens idênticas e nenhum frame adicional em Chromium, Firefox e WebKit**. Um toque parado no mobile também não muda o estado óptico. Arrastar o dedo pode rolar a página e, portanto, alterar o progresso normal da transição. Feedback funcional de ações e foco permanece.

## Arquitetura e preservação

Todos os arquivos implementados nesta etapa são novos. Nenhum arquivo rastreado anterior foi substituído. Base preservada: `63dcb61ea339c9d58ae94e5fc4e9ff5dd7abdc5b`. O original e A/B permanecem nas mesmas rotas. Não houve mudança de dependências, `AGENTS.md` ou Skills.

| Arquivo / área criada | Responsabilidade |
| --- | --- |
| `src/pages/estudos/etapa-2.astro` | Rota isolada, metadados, componentes e inicialização. |
| `src/studies/etapa-2/Story.astro` | Conteúdo e destinos HTML da narrativa. |
| `src/studies/etapa-2/scene.ts` | Matrizes, coordenadas, proporção e progressão geométrica. |
| `src/studies/etapa-2/continuity.ts` | GSAP/ScrollTrigger, sincronização DOM/canvas, preferência e ciclo de vida. |
| `src/studies/etapa-2/ContinuityRenderer.ts` | OGL, textura, resolução, pausa, perda/restauração e descarte. |
| `src/studies/etapa-2/shaders.ts` | Refração e delimitação óptica. |
| `src/studies/etapa-2/surface.css` | Composição, paleta, estados de foco e responsividade. |
| `src/pages/estudos/etapa-2/revisao.astro` e `review.css` | Apresentação comparativa no navegador. |
| `public/studies/etapa-2/superficie-vertical.webp` | Codificação otimizada da matriz vertical já existente, 230.258 bytes. |
| `public/studies/etapa-2/revisao/` | Prévias WebP e cópias idênticas dos dois vídeos brutos. |
| `scripts/studies/{verify,capture,package,review}-stage2.mjs` | Verificação, evidências, inventário/galeria e revisão da entrega. |
| `docs/redirecao/etapa-2/` | Relatório, galeria local, PNGs, vídeos, quadros, inventário e resultados JSON. |

O [inventário](inventario.json) contém bytes e hashes dos 14 arquivos de código/asset principais e dos recursos reaproveitados. O manifesto [evidencias.json](evidencias.json) registra tamanho dos viewports, progresso, moldura e recorte de cada captura principal. Não foram criadas dependências adicionais.

O formulário é o componente funcional da Etapa 1, com sua lógica existente. Produz um resumo local demonstrativo, sem POST, dados persistidos ou contato real. O acesso a ambientes leva à seção existente na Etapa 1. Não foram construídas as demais seções finais para disfarçar o limite de escopo.

## Alternativas e desempenho

- **Sem WebGL:** o pôster HTML aplica a mesma matriz de recorte e transformação. Fotografia, cor e fluxo permanecem; não há refração.
- **Falha de textura WebGL:** o pôster permanece. O teste induz uma URL de textura inexistente; a resposta 404 desse cenário é esperada e separada dos erros normais.
- **Perda de contexto:** a camada gráfica é ocultada, preservando o pôster na posição atual; a restauração recria os recursos e reaplica o estado.
- **Movimento reduzido:** remove a transformação ligada ao scroll e usa fotografias no fluxo nativo. Mudanças da preferência durante a sessão são tratadas.
- **Sem JavaScript:** conteúdo e âncoras permanecem. A simulação fica desabilitada, com explicação visível.
- **Resolução limitada:** teto de 2 milhões de pixels; DPR máximo de 1,5 em ponteiro preciso e 1,25 em toque. `?qualidade=baixa` permite verificar uma resolução menor. A redução automática usa amostras do custo de submissão no CPU; não substitui um medidor real de tempo da GPU.
- **Repouso e cena fora da tela:** sem loop de desenho contínuo. A página oculta pausa o agendamento; descarte libera textura, programa, geometria e contexto associado ao renderer.

Medição local em produção, sem captura ou vídeo concorrente, NVIDIA GTX 1650 / ANGLE / Direct3D11, viewport 1440 × 900:

| Medida | Resultado |
| --- | ---: |
| Amostras de intervalos rAF durante scroll programático | 90 |
| Intervalo mediano | 16,7 ms |
| Percentil 95 | 16,9 ms |
| Média diagnóstica da chamada de render no CPU | 0,52 ms |
| Buffer na amostra | 1440 × 900 |
| JS alcançável, incluindo imports dinâmicos e bibliotecas | 181.998 bytes; 66.730 bytes gzip somados por módulo |
| CSS da rota | 12.175 bytes; 3.247 bytes gzip |

Detalhes em [desempenho.json](desempenho.json). Esses intervalos **não são uma medição de frames apresentados pela GPU**, nem um teste em celular físico. A soma gzip não inclui imagens, fontes, cabeçalhos HTTP ou a galeria; não é um valor de transferência de campo. Os vídeos são carregados somente sob solicitação na página de revisão.

## Testes e revisão no navegador

**46 verificações passaram; 0 falhas; 0 erros normais de console.** Resultado completo: [testes.json](testes.json).

- Chromium **158.0.8127.18**, Firefox **159.0**, WebKit **27.2**: desenho, repouso, alinhamento, interrupção/reversão, invariância ao mouse, pausa, teclado, simulação, perda/restauração de contexto, mudança de preferência, ausência de JS e descarte.
- Chromium: 320, 375, 390, 430, 768, 820, 1024, 1280, 1440 e 1920px; nenhuma rolagem horizontal nos estados verificados. Capturas adicionais em 1180 × 820 para tablet horizontal.
- Rotação durante a passagem, retorno à matriz anterior e zoom de **200% via CSS `zoom`** para verificar reflow. Isso não equivale à cobertura de todas as diferenças entre zoom nativo dos navegadores.
- Axe WCAG A/AA e 2.1 AA: **0 violações automáticas** nos estados intermediários a 390, 820 e 1440px. Navegação funcional por teclado exercitada nos três motores.
- WebGL indisponível, WebGL 1 sem WebGL 2, textura falha, alternativa solicitada e resolução reduzida.
- Comparação de screenshots e contagem de frames antes/depois do movimento do mouse nos três motores.
- `npm run check`: **51 arquivos, 0 erros, 0 avisos, 0 hints**. `npm run build`: **5 rotas estáticas**, concluído.

A apresentação comparativa teve revisão separada: 320, 390, 820 e 1440px sem overflow e sem violações axe; todas as 11 imagens decodificaram, ambos os vídeos responderam 200. Na galeria local, as 22 imagens decodificaram. Evidências: [revisao.json](revisao.json).

O lint de texto da Skill de crítica resultou em **0 falhas e 1 aviso de ritmo**: 17 frases curtas, média de 8,2 palavras. O aviso foi mantido porque o protótipo contém instruções e descrições comerciais breves; alongá-las para alterar a estatística reduziria a clareza. Isso não foi usado como substituto da revisão visual.

### Problemas encontrados e corrigidos

1. A interpolação inicial usava a posição móvel do destino e fazia a fotografia descer antes de subir. O destino agora é projetado para o final da passagem; a trajetória se torna coerente com o scroll.
2. Uma faixa de interface do hero atravessava a imagem intermediária. Foi removida: a tipografia e as ações saem em conjunto, preservando a continuidade da cena.
3. Cabeçalho translúcido perdia contraste quando o campo turquesa surgia. As faixas de navegação e identificação usam azul sólido.
4. Zoom de 200% causava recorte e erro de coordenadas. O cálculo considera o fator de zoom, e o bloco comercial reorganiza colunas conforme sua largura disponível.
5. OGL tentava atualizar `WRAP_R` de textura 2D em WebGL 1. O renderer evita esse estado inválido somente no caminho WebGL 1, sem modificar a dependência.
6. Redimensionamento durante o carregamento podia invalidar uma textura ainda válida. A geração de carga muda somente quando a fonte precisa mudar.
7. O título da apresentação de revisão excedia 320px. Sua escala foi ajustada e a galeria foi novamente auditada.

## Evidências visuais

As **62 capturas principais** são PNGs sem reamostragem, com densidade de dispositivo 1 e dimensões do viewport. Há também duas capturas da apresentação, comparações compostas e sequências amostradas dos vídeos. Apenas as prévias públicas WebP foram reduzidas para apresentação.

| Formato | Hero | Passagem | Serviços |
| --- | --- | --- | --- |
| Desktop 1440 × 900 | [PNG](evidencias/desktop-hero.png) | [PNG](evidencias/desktop-passagem.png) | [PNG](evidencias/desktop-servicos.png) |
| Desktop 1920 × 1080 | [PNG](evidencias/wide-hero.png) | [PNG](evidencias/wide-passagem.png) | [PNG](evidencias/wide-servicos.png) |
| Tablet 820 × 1180 | [PNG](evidencias/tablet-hero.png) | [PNG](evidencias/tablet-passagem.png) | [PNG](evidencias/tablet-servicos.png) |
| Tablet horizontal 1180 × 820 | [PNG](evidencias/tablet-horizontal-hero.png) | [PNG](evidencias/tablet-horizontal-passagem.png) | [PNG](evidencias/tablet-horizontal-servicos.png) |
| Mobile 390 × 844 | [PNG](evidencias/mobile-hero.png) | [PNG](evidencias/mobile-passagem.png) | [PNG](evidencias/mobile-servicos.png) |
| Mobile 320 × 700 | [PNG](evidencias/small-hero.png) | [PNG](evidencias/small-passagem.png) | [PNG](evidencias/small-servicos.png) |

- [Vídeo desktop 1440 × 900](videos/transicao-desktop.webm): ida lenta, reversão, deslocamento rápido e retorno com wheel nativo.
- [Vídeo mobile 390 × 844](videos/transicao-mobile.webm): gestos de toque enviados via CDP, com rolagem e animação reais do navegador.
- [Sequência desktop](evidencias/video-desktop-sequencia.png) e [sequência mobile](evidencias/video-mobile-sequencia.png): amostragem de 1 quadro por segundo, sem interpolação ou transições criadas na edição.
- [Fallback desktop](evidencias/desktop-fallback-passagem.png), [fallback mobile](evidencias/mobile-fallback-servicos.png), [movimento reduzido desktop](evidencias/desktop-movimento-reduzido.png) e [mobile](evidencias/mobile-movimento-reduzido.png).

Os vídeos são brutos e incluem a apresentação antes da imagem carregar. A ausência inicial da fotografia mostra a base HTML/azul; não é um efeito de abertura adicionado à gravação. Os hashes dos arquivos brutos estão em `evidencias.json` e correspondem às cópias públicas da galeria.

## Skills consultadas e decisões

- **frontend-design:** grande escala, composição e cor como material da marca.
- **ui-ux-pro-max:** hierarquia, contraste, pontos de interação, reflow e adaptação por orientação. Recomendações de minimalismo corporativo incompatíveis com o briefing não foram adotadas.
- **design-motion-principles:** uma narrativa principal, aceleração suave, repouso, reversão e acessibilidade do movimento.
- **design-taste-frontend:** crítica de soluções genéricas, fotografia, consistência, texto e revisão no navegador; a preferência genérica por páginas sem shader não substituiu a assinatura óptica autorizada.
- **web-design-guidelines:** teclado, foco, semântica, contraste, toque e alternativas.

Referências técnicas primárias consultadas: [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) e [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). As decisões artísticas e a avaliação acima decorrem das capturas e gravações locais.

## Limitações e recomendação

As fotografias continuam sendo cenas sintéticas da Etapa 1. Nesta etapa não houve nova geração nem correção pictórica. A matriz horizontal de 1586px limita nitidez em 1920px e telas de alta densidade; a vertical tem 1024px. Uma eventual produção final deve tratar esses originais como recursos demonstrativos.

A refração e a pequena modulação da borda são bidimensionais. Não há separação real de profundidade, simulação física, travessia volumétrica da água ou animação das plantas. A máscara é conservadora e específica das duas fontes. A maior intensidade cromática deve ser julgada na experiência inteira, não apenas em uma captura do hero.

Os testes usam navegadores desktop e emulação de toque. WebKit não equivale a Safari real. Permanecem sem validação física: iOS/Android, barras móveis do navegador, desempenho térmico, GPU modesta real, leitor de tela e retorno pelo cache de navegação em dispositivos reais. A pausa/restauração e o tratamento de `pagehide` estão implementados, sem uma afirmação de cobertura física desses ambientes. Não há medições de campo de LCP, INP ou CLS.

Recomendo submeter **esta variação cromática da composição A** à avaliação: ela preserva o reconhecimento da piscina e dá aos serviços a mesma personalidade do hero. Os pontos de decisão são a intensidade do turquesa, a presença do amarelo e o ritmo da passagem em toque. Não é necessário alterar a versão histórica para avaliar esses três aspectos.

Nenhum commit, push ou deploy foi realizado. Não há autorização inferida para a Etapa 3.

Sugestão de commit, caso esta etapa seja aprovada: `feat: prototipa continuidade cromática e óptica da Lâmina`.
