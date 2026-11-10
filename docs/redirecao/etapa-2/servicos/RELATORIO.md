# Lâmina — redesign editorial dos serviços

Revisão da **Etapa 2**, em 10/11/2026. Base preservada no Git: `56441f5` — continuidade cromática e óptica. A Etapa 3 não foi iniciada. Não houve commit, push ou deploy nesta execução.

## Avaliar a entrega

- [Protótipo desde o hero](http://127.0.0.1:4321/estudos/etapa-2/).
- [Nova seção de serviços](http://127.0.0.1:4321/estudos/etapa-2/#servicos).
- [Apresentação com alternativas, comparações e vídeos](http://127.0.0.1:4321/estudos/etapa-2/revisao/).
- [Galeria local, sem servidor](index.html).
- [Comparação completa desktop](evidencias/desktop-comparacao-completa.png), [tablet](evidencias/tablet-comparacao-completa.png) e [mobile](evidencias/mobile-comparacao-completa.png).

O servidor de desenvolvimento já existente em 4321 foi reutilizado. Não foi substituído com `--force` nem encerrado por esta execução. O servidor auxiliar de produção em 4322 foi encerrado ao finalizar os checks.

## Diagnóstico e escolha entre três alternativas

A inspeção confirmou quatro relações que enfraqueciam a seção anterior: o turquesa se sobrepunha à fotografia como material dominante; a coluna direita concentrava título, introdução e toda a oferta; o recorte vertical se comportava como um objeto separado; a hierarquia editorial terminava antes de alcançar os serviços.

Antes de modificar a implementação, foram renderizados **três HTMLs independentes** em desktop e mobile. Capturas, fontes anteriores e a [decisão de direção](DIRECAO.md) permanecem nesta pasta.

| Alternativa | Relação entre imagem e texto | Avaliação |
| --- | --- | --- |
| [A — Coluna de água](alternativas/vertical.html) | Imagem vertical muito alta, serviços ao lado | Preserva bem perspectiva e degraus; mantém a relação convencional de duas colunas. O estudo mobile coloca a fotografia depois de conteúdo demais. Rejeitada. |
| [B — Horizonte contínuo](alternativas/panorama.html) | Panorama atravessando a composição, título sobre a linha do quadro | Melhor integração com a arquitetura e com a transformação existente. Permite distribuir título, fotografia e leitura comercial em momentos próprios. **Selecionada e refinada.** |
| [C — A margem](alternativas/assimetrica.html) | Fotografia deslocada e sobreposição assimétrica sobre fundo profundo | Cria tensão espacial, mas abre um intervalo longo no celular e volta a separar introdução e fotografia. Rejeitada. |

Comparações dos estudos: [desktop](alternativas/comparacao-desktop.png) e [mobile](alternativas/comparacao-mobile.png). São explorações de composição, não três implementações completas da transição.

## Direção implementada

O panorama substitui a imagem lateral. “Da paisagem” abre o plano editorial e “ao detalhe” alcança a linha superior da fotografia pela margem oposta. Os fundos tipográficos têm função de plano e de contraste: permanecem legíveis inclusive quando a fotografia passa atrás deles durante a chegada.

A imagem mantém eixos retos, perspectiva e materiais da arquitetura. A sangria e a sobreposição do título alteram a percepção do quadro sem converter a piscina em uma forma orgânica arbitrária. O efeito visual vem da relação entre os elementos, não de uma nova máscara decorativa.

Os serviços deixam a coluna comprimida. Passam a ocupar linhas amplas, com título, descrição e ação em relações claras. Os recuos avançam gradualmente no desktop, acompanhando a direção da borda da piscina. No mobile, são menores: o segundo serviço recebe apenas 20px de recuo, e o terceiro volta à margem principal. Não há cards, indicadores de etapas ou informações comerciais inventadas.

As três categorias e os identificadores comerciais permanecem: **Projeto e construção**, **Revitalização e reforma**, **Manutenção e tratamento**. As descrições locais passaram de **52 para 30 palavras**, preservando execução, materiais, revestimentos, bordas, sistemas, água e equipamentos. O arquivo compartilhado de conteúdo não foi alterado.

### Cor com intensidade controlada

Nenhuma cor nova foi introduzida:

| Cor | Uso nesta revisão | Contraste relevante |
| --- | --- | ---: |
| `#083C63` — profundo | Estrutura e texto comercial | 10,44:1 sobre o tom claro |
| `#1658BA` — azul luminoso | Plano de chegada e fundo tipográfico | Amarelo sobre azul: 4,66:1 |
| `#F6D567` — solar | Título editorial expressivo; ações existentes do hero/orçamento | 7,97:1 sobre azul profundo |
| `#16C7AD` — turquesa | Faixa curta de ligação e feedback funcional | Texto profundo: 5,34:1 |
| `#E9F9E7` — claro mineral | Plano de leitura dos serviços | Texto profundo: 10,44:1 |

A transformação cromática foi integrada ao novo destino: azul profundo → azul luminoso. O turquesa fica depois da fotografia, como passagem para os serviços. A região de leitura clara equilibra a intensidade do título e da paisagem; não transforma o restante do site em uma sequência bege.

A [medição cromática](comparacao-cromatica.json), contando apenas pixels de RGB idêntico nas capturas completas desktop, encontrou **73,92% de turquesa sólido antes e 6,41% depois**. Na nova seção, azul luminoso ocupa 17,31%, amarelo 1,44% e tom claro 44,19%; os demais pixels incluem fotografia, tipografia e antialiasing. Isso mede presença de cor nas imagens, não elegância percebida. A melhoria compositiva é avaliada pelas relações e pelas capturas, não por essa estatística isolada.

## Continuidade e comportamento

A nova proporção exige a matriz integral da mesma fotografia, em vez de ampliar o recorte vertical antigo. Desktop horizontal utiliza a fonte de 1586 × 992; mobile e tablet vertical, a de 1024 × 1536. A janela editorial final agora é a fonte inteira submetida ao `cover` do quadro medido.

O controlador continua medindo o destino HTML. Proporção, recorte e posição são recalculados durante resize e mudança de orientação. O shader e o renderer foram preservados byte a byte: a máscara permanece vinculada à água da fonte, independentemente do novo recorte. Não houve troca de cena ou alteração na geometria da piscina.

Ajustes de movimento ficaram restritos à janela final e à cor de chegada. A progressão, o scroll nativo, a saída do hero e a reversão existentes continuam. Nenhuma animação de revelação foi adicionada aos serviços. Ao final, a fotografia acompanha o fluxo da página, sem sticky na composição nova.

**O conteúdo do hero foi preservado integralmente.** Não há mouse, posição de toque, hover ou iluminação localizada no caminho óptico. A invariância ao movimento do mouse continuou passando nos três motores, com screenshots idênticas antes/depois e sem frames novos. Toque só altera a transição quando provoca a rolagem nativa. Links e foco mantêm feedback funcional.

### WebGL e pôster HTML

O quadro no destino tem desvio inferior a 1,5px nos testes. A fonte da imagem é a mesma no canvas e no HTML. Os filtros de amostragem, entretanto, são diferentes: a comparação de canais em recortes nativos registrou diferenças médias de 2,69/255 no desktop, 3,29/255 no tablet e 2,84/255 no mobile.

A hipótese inicial de filtros visualmente equivalentes em resolução nativa foi rejeitada pelo teste. A verificação foi corrigida para distinguir **alinhamento/fonte** de **interpolação de pixels**, mantendo os valores brutos no resultado. Na comparação reduzida a 64px para avaliar cobertura e enquadramento, as médias ficaram em 0,39, 0,63 e 0,83/255. O limite usado nesse teste é 1,5/255. Isso não é uma alegação de igualdade de pixels entre os renderizadores.

Sem WebGL, o pôster mantém o enquadramento transformado. Com movimento reduzido, a composição usa as imagens no fluxo normal. Sem JavaScript, conteúdo, âncoras e explicação da limitação da simulação permanecem. Perda/restauração de contexto e textura falha continuam cobertas pela suíte da continuidade.

## Revisão crítica do resultado real

| Critério | Resultado e limite |
| --- | --- |
| Originalidade | A escala do panorama, a linha quebrada do título e os recuos dos serviços relacionam a seção à arquitetura da piscina. A leitura comercial ainda utiliza linhas editoriais familiares; o conjunto depende de seu vínculo com a passagem para ter identidade. |
| Fotografia | A borda diagonal e o pavilhão agora têm presença horizontal. A vista vertical preserva água e degraus. O panorama corta parte do céu e do primeiro plano, de forma esperada para sua proporção. |
| Sofisticação cromática | O turquesa deixa de ser o ambiente único. Azul/amarelo, fotografia e plano claro estabelecem ritmos diferentes. O azul luminoso continua deliberadamente assertivo. |
| Hierarquia | Título editorial, imagem e ações têm momentos próprios. As descrições são menores e os títulos comerciais maiores. Não há uma segunda introdução longa competindo com os três serviços. |
| Estados intermediários | Os planos tipográficos atravessam a cena com contraste estável. Essa sobreposição é mais gráfica que a proposta anterior e deve ser avaliada no vídeo em velocidade normal. |
| Mobile | Imagem vertical com sangria à direita, título reposicionado e ações com largura disponível. O recuo comercial é curto; não se reproduzem as colunas comprimidas do desktop. |
| Clareza comercial | As três categorias, ações individuais e pré-seleção estão explícitas. Uma âncora na faixa turquesa permite alcançar diretamente a oferta. |
| Extensão | O ritmo exige mais rolagem. A captura completa desktop passou de 1229px para 1742px de altura. É o custo da redução de densidade, sem ocultar serviços. |

A comparação mostra uma mudança estrutural, não apenas cromática: fotografia lateral → panorama integrado; coluna única de oferta → linhas editoriais amplas; título pequeno junto à lista → plano tipográfico que participa do quadro. A seção está mais articulada à abertura, mas não é apresentada como equivalência comprovada aos melhores projetos de [Landing Love](https://www.landing.love/).

### Problemas encontrados e corrigidos

1. Na separação dos estilos antigos, o pôster HTML chegou a permanecer visível junto ao canvas, duplicando parte da paisagem em estados intermediários. A regra foi restaurada e ganhou verificação específica.
2. A escala em `vw` do novo título não era uma base adequada para zoom de 200%. O título usa agora a largura efetiva do contêiner; os serviços também reorganizam a leitura conforme o espaço disponível.
3. Uma sobreposição direta de texto amarelo na fotografia deixaria o contraste dependente da cena. Os planos azuis sob as linhas do título tornam a leitura consistente, sem blur ou sombra decorativa.
4. O recorte editorial vertical anterior não correspondia ao panorama novo. A fonte integral e o `cover` passaram a determinar o destino, com comparação do pôster e do canvas.
5. A referência de captura anterior recebeu uma proteção no script de preparação para não ser sobrescrita por uma execução posterior.
6. Uma regra de fundo fixo prevalecia sobre a variável da passagem. O plano externo foi vinculado à mesma cor progressiva dos fundos tipográficos; estados intermediários e vídeos foram novamente capturados.

## Evidências

Há **80 capturas principais novas**, além das comparações e sequências dos vídeos. As capturas anteriores foram produzidas nesta execução antes das alterações, em 1440 × 900, 820 × 1180 e 390 × 844.

| Formato | Composição | Leitura comercial | Passagem |
| --- | --- | --- | --- |
| Desktop 1440px | [PNG](evidencias/desktop-servicos.png) | [PNG](evidencias/desktop-oferta.png) | [PNG](evidencias/desktop-passagem.png) |
| Desktop 1920px | [PNG](evidencias/wide-servicos.png) | [PNG](evidencias/wide-oferta.png) | [PNG](evidencias/wide-passagem.png) |
| Tablet 768px | [PNG](evidencias/tablet-768-servicos.png) | [PNG](evidencias/tablet-768-oferta.png) | [PNG](evidencias/tablet-768-passagem.png) |
| Tablet 820px | [PNG](evidencias/tablet-servicos.png) | [PNG](evidencias/tablet-oferta.png) | [PNG](evidencias/tablet-passagem.png) |
| Tablet 1024px | [PNG](evidencias/tablet-1024-servicos.png) | [PNG](evidencias/tablet-1024-oferta.png) | [PNG](evidencias/tablet-1024-passagem.png) |
| Tablet horizontal 1180px | [PNG](evidencias/tablet-horizontal-servicos.png) | [PNG](evidencias/tablet-horizontal-oferta.png) | [PNG](evidencias/tablet-horizontal-passagem.png) |
| Mobile 390px | [PNG](evidencias/mobile-servicos.png) | [PNG](evidencias/mobile-oferta.png) | [PNG](evidencias/mobile-passagem.png) |
| Mobile 320px | [PNG](evidencias/small-servicos.png) | [PNG](evidencias/small-oferta.png) | [PNG](evidencias/small-passagem.png) |

Também foram capturados 375 e 430px. Os PNGs preservam a resolução do navegador com densidade 1. As capturas completas utilizam um viewport alto na mesma largura para manter todo o canvas dentro da área visível; suas dimensões constam em [evidencias.json](evidencias.json). As comparações não reamostram os PNGs. Somente as prévias WebP da apresentação são reduzidas.

- [Vídeo desktop — chegada e reversão, 1440 × 900](videos/continuidade-desktop.webm).
- [Vídeo mobile — toque e reversão, 390 × 844](videos/continuidade-mobile.webm).
- [Sequência desktop](evidencias/video-desktop-sequencia.png) e [mobile](evidencias/video-mobile-sequencia.png): 1 quadro por segundo, até 16 quadros, sem interpolação.
- [Sem WebGL desktop](evidencias/desktop-fallback-destino.png) e [mobile](evidencias/mobile-fallback-destino.png).
- [Movimento reduzido desktop](evidencias/desktop-movimento-reduzido.png) e [mobile](evidencias/mobile-movimento-reduzido.png).

Os vídeos são arquivos brutos do navegador, com wheel real ou gestos CDP e carregamento inicial. Não contêm animações feitas na edição. Suas cópias públicas têm os mesmos hashes dos originais.

## Testes e desempenho

**61 verificações do protótipo aprovadas**, sem falhas: [46 da continuidade](testes.json) e [15 específicas desta revisão](testes-servicos.json). Outras [6 verificações da apresentação](revisao.json) passaram.

- Chromium 158.0.8127.18, Firefox 159.0 e WebKit 27.2: continuidade, alinhamento, reversão, interrupção, mouse, teclado, simulação, contexto gráfico, movimento reduzido, ausência de JS e descarte.
- 320, 375, 390, 430, 768, 820, 1024, 1280, 1440 e 1920px na suíte geral. As nove larguras requeridas pelo AGENTS também tiveram título, oferta, foco e pré-seleção dos três serviços verificados especificamente.
- Axe WCAG A/AA e 2.1 AA: 0 violações nos estados intermediário, chegada e oferta em 390, 820 e 1440px. A apresentação passou também em 320px, sem overflow.
- Rotação durante a passagem, WebGL 1, indisponibilidade de WebGL, textura falha, perda/restauração e qualidade reduzida.
- Zoom de 200% via CSS `zoom`, com título e ações dentro da largura disponível. Não cobre todas as diferenças do zoom nativo de cada navegador.
- 0 erros normais de console. A URL de textura deliberadamente inexistente pertence a um cenário de falha controlada.
- `npm run check`: **57 arquivos, 0 erros, 0 avisos, 0 hints**. `npm run build`: **5 rotas**, concluído.
- Lint de texto da Skill de crítica: **180 palavras, 0 FAIL, 0 WARN**. O sistema visual próprio do projeto foi preservado, sem aplicar o template ou o hover de fotografias proposto genericamente pela Skill.

O Firefox encerrou ao criar uma página na primeira execução dentro do sandbox. A suíte foi executada novamente fora dessa restrição, com os três motores aprovados. Não foi necessário alterar configuração do sistema ou o código do site por esse encerramento.

Medição local em produção, GTX 1650 / ANGLE / Direct3D11, 1440 × 900, sem captura ou gravação concorrente: 90 amostras rAF, mediana **16,7ms**, p95 **16,9ms**, média da chamada de render no CPU **0,51ms**. Não mede tempo real da GPU, frames efetivamente apresentados, consumo térmico ou resultados de campo.

JS alcançável da rota, incluindo imports dinâmicos: **181.954 bytes**, soma gzip **66.689 bytes**. CSS: **13.626 bytes**, gzip **3.530 bytes**. Sem imagens, fontes, cabeçalhos HTTP e galeria. Detalhes em [desempenho.json](desempenho.json). Nenhuma dependência foi adicionada.

## Arquivos e preservação

O [inventário](inventario.json) registra hashes, bytes e situação de cada arquivo e recurso. Foram modificados **8 arquivos rastreados**:

- `src/pages/estudos/etapa-2.astro`: importação dos novos estilos locais.
- `src/pages/estudos/etapa-2/revisao.astro`: apresentação atualizada, delegada ao componente de revisão.
- `src/studies/etapa-2/Story.astro`: extração da nova seção em componente próprio.
- `src/studies/etapa-2/surface.css`: remoção dos estilos antigos dos serviços.
- `src/studies/etapa-2/scene.ts`: janela editorial integral.
- `src/studies/etapa-2/continuity.ts`: novo destino cromático.
- `scripts/studies/verify-stage2.mjs` e `review-stage2.mjs`: parâmetros opcionais de saída para preservar os relatórios anteriores.

Foram criados **7 arquivos de implementação/ferramentas**: `Services.astro`, `services.css`, `ServicesReview.astro` e os scripts `prepare-services-redesign.mjs`, `verify-services-redesign.mjs`, `capture-services-redesign.mjs`, `package-services-redesign.mjs`.

Recursos novos ficam exclusivamente em `public/studies/etapa-2/servicos/` — 20 prévias WebP e 2 cópias dos vídeos. Documentação, alternativas, capturas e fontes anteriores ficam em `docs/redirecao/etapa-2/servicos/`. Nenhuma fotografia nova foi gerada.

Original, estudos A/B, `src/data/content.ts`, componente/lógica compartilhados do orçamento, fontes, matrizes fotográficas, shader, renderer, `AGENTS.md` e Skills não foram alterados. Relatórios e evidências anteriores da Etapa 2 permanecem preservados. A apresentação online passa a mostrar esta revisão mais recente.

## Limitações e recomendação

A seção é mais longa. O panorama também amplia a fonte horizontal de 1586px em telas de 1920px; essa limitação de nitidez continua perceptível. As matrizes permanecem sintéticas e demonstrativas. A passagem é uma transformação bidimensional, sem câmera volumétrica ou profundidade reconstruída.

A composição gráfica do título é intencionalmente mais marcada. Os planos azuis garantem contraste, mas também ficam visíveis como sobreposição durante o movimento. Esse é um ponto artístico para avaliação, não um defeito ocultado por uma animação nova.

Não houve validação em aparelhos físicos, Safari real, leitor de tela ou GPU modesta real. Os testes automatizados de contraste não substituem a avaliação humana de todos os quadros possíveis. Permanecem as limitações anteriores da simulação local, sem envio comercial.

Recomendo avaliar **Horizonte contínuo** como substituta da seção turquesa no protótipo isolado: ela resolve a concentração de conteúdo e coloca fotografia e tipografia na mesma composição, mantendo a cor da Lâmina. A aprovação desta revisão e qualquer continuidade de fase dependem do proprietário.

Skills utilizadas: `frontend-design`, `ui-ux-pro-max`, `design-motion-principles`, `design-taste-frontend` e `web-design-guidelines`. A revisão consultou as [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md); decisões e avaliações artísticas acima se baseiam nas evidências locais, sem adoção de templates das referências.

Sugestão de commit: `feat: redesenha serviços da Lâmina com composição panorâmica`.
