# Lâmina — Etapa 4: refinamento artístico e técnico

Entrega de 11/11/2026. Refinamento da experiência completa, preservando a Etapa 3 e a página principal. Nenhum commit, push ou deploy foi realizado. A substituição da página principal depende da avaliação do proprietário.

## Experimentar e encontrar os relatórios

Na raiz do projeto, execute `npm.cmd run dev` no PowerShell. O atalho `.cmd` funciona sem mudar a política de execução do sistema.

- [Versão refinada](http://127.0.0.1:4321/estudos/etapa-4/).
- [Comparação, capturas e gravações](http://127.0.0.1:4321/estudos/etapa-4/revisao/).
- [Diagnóstico inicial no navegador](http://127.0.0.1:4321/estudos/etapa-4/diagnostico/).
- [Este relatório no navegador](http://127.0.0.1:4321/estudos/etapa-4/relatorio/).
- [Etapa 3 preservada](http://127.0.0.1:4321/estudos/etapa-3/).
- [Versão refinada sem WebGL](http://127.0.0.1:4321/estudos/etapa-4/?grafico=fallback).

Também há uma galeria local `docs/redirecao/etapa-4/index.html`, que abre os PNGs e vídeos originais sem depender do servidor. Os servidores usados na revisão são encerrados ao finalizar a entrega.

## Diagnóstico antes de implementar

A Etapa 3 foi aberta e percorrida no navegador em 1440, 820, 390 e 320px. Foram usados controles da galeria, teclado nos materiais, seleção de serviço, imóvel e resumo. Um carregamento de imagem foi retido para observar a espera. A inspeção foi registrada antes das alterações em `DIAGNOSTICO.md`, `diagnostico-navegador.json` e `antes/`.

Os problemas eram específicos: oferta de serviços espaçada, introdução longa da galeria mobile, detalhe de materiais muito alto no tablet, grande superfície amarela em torno da fotografia, processo com corpo de 15px concentrado à direita, quebra artificial do título final e ausência de retorno durante a espera pela próxima imagem. Não foi encontrado motivo para reconstruir o hero ou trocar a arquitetura.

## Melhorias e sua justificativa

| Diagnóstico | Refinamento |
| --- | --- |
| R1 — serviços discretos e afastados | Intervalos da oferta menores, manutenção mais próxima da renovação e texto comercial discretamente maior. Margem aberta, imagem livre e destino do movimento preservados. |
| R2 — percurso longo na galeria mobile | Introdução e saída mais próximas, fotografia vertical um pouco menos alta e mesmos controles de seleção/setas. A galeria continua um momento fotográfico expressivo. |
| R3/R5 — peso do amarelo e isolamento da fotografia | O detalhe alcança o limite superior e a margem direita em desktop/tablet. O solar permanece, mas fica contido pela imagem; o intervalo até o processo diminui. No celular, um recorte mais próximo ocupa menos altura. |
| R4 — processo fragmentado e estreito | Título com abertura horizontal; verbos e parágrafos distribuídos pela largura. Corpo de 17px no desktop/tablet e 16px no celular. Numeração visual e divisões internas retiradas após a primeira inspeção do refinamento. A sequência continua uma lista ordenada semântica, com os quatro momentos e o mesmo conteúdo. |
| R6 — orçamento e conclusão pouco articulados | Formulário com a mesma lógica e controles amplos, em um ritmo mais próximo do processo. Título de encerramento com quebra natural e balanceada, preservando seu texto; foto mobile mais horizontal. A marca continua concluindo a experiência. |
| M1 — deslocamento do painel inteiro | A transição fica somente na fotografia: crossfade de 420ms, com a imagem anterior opaca atrás da nova. A margem, o título e a descrição não deslizam nem produzem dupla exposição. |
| T1 — espera sem retorno | Mensagem estática após uma espera perceptível de 200ms, sem spinner ou pulso. A cena atual permanece até a próxima imagem estar pronta. Falha de imagem mantém a navegação e oferece uma alternativa legível. |

O ritmo foi trabalhado por proporção, espaço, alinhamento e legibilidade. Não foram acrescentados efeitos para esconder limites entre fundos. As mudanças de cor continuam deliberadas: a oferta clara abre a leitura, a galeria intensifica fotografia e margem, o solar aproxima a matéria e o azul profundo prepara o planejamento.

## Comparação real entre versões

As duas rotas foram novamente capturadas nesta execução, no mesmo navegador e viewport. Os limites de seção foram posicionados na mesma coordenada vertical. As páginas completas usam movimento reduzido nativo; limites de seção e vídeos mantêm movimento ativo. Os arquivos estão em `comparacoes/`, com medições em `comparacao.json`.

| Viewport | Etapa 3 | Etapa 4 | Diferença de percurso |
| --- | ---: | ---: | ---: |
| 1440 × 900 | 7.612px | 7.340px | −272px / −3,57% |
| 820 × 1180 | 7.181px | 6.872px | −309px / −4,30% |
| 390 × 844 | 8.792px | 7.905px | −887px / −10,09% |
| 320 × 700 | 8.419px | 7.678px | −741px / −8,80% |

A redução de altura não é usada como sinônimo de qualidade. No desktop, o processo cresceu cerca de 32px porque o texto ganhou corpo e largura; no tablet, cerca de 12px. Essa troca favorece leitura. O encurtamento do mobile vem principalmente de fotografia, limites de seção e encerramento, sem retirar conteúdo ou reduzir o tamanho dos controles.

## Movimento e interação

A assinatura óptica não mudou. Hero, renderer, shader, máscara da água, curva de passagem, cálculo do destino e fallback são importados dos arquivos anteriores. A nova composição dos serviços continua sendo medida pelo renderer; não foram introduzidas coordenadas fixas para acomodá-la.

A galeria mantém seleção direta, setas, teclas direcionais, Home/End, URL compartilhável e alternativa por toque. A última escolha prevalece quando uma imagem demora. Teclado e movimento reduzido não iniciam animações. A redução de movimento durante uma transição conclui o estado corretamente.

O novo crossfade não anima geometria, tipografia, blur, zoom, refração ou distorção. O ponteiro não controla a fotografia. Materiais continuam usando disclosures nativos; o processo permanece inteiramente visível. Nenhum scroll-jacking, pin novo ou animação pesada foi acrescentado ao encerramento.

## Evidências da entrega

- **47 capturas da versão refinada**, em PNG, incluindo desktop, tablet e mobile completos, três atmosferas, materiais, processo, orçamento, resumo, encerramento, fallback e zoom.
- **56 capturas comparativas** de ambas as rotas em quatro formatos: seis limites de seção e uma captura integral por versão/formato.
- **Duas gravações brutas**, desktop 1440 × 900 e mobile 390 × 844. O percurso inclui passagem óptica, reversão, galeria, materiais, processo, resumo local e conclusão.
- Quadros extraídos dos vídeos, sem interpolação, servem para inspeção; não foram usados como substituto do teste direto da interação.
- PNGs preservam a resolução da captura. WebPs da página de revisão são prévias reduzidas, com dimensões reais reservadas no HTML.

As gravações incluem a preparação e o carregamento inicial do navegador, inclusive eventuais quadros anteriores ao aparecimento da página. Não houve montagem ou transições adicionadas na edição. As cópias públicas são verificadas contra os originais.

As capturas integrais usam a preferência nativa de movimento reduzido para registrar abertura e destino na mesma imagem longa. Um canvas fixo vinculado à rolagem não pode representar simultaneamente ambos os estados em uma captura integral. O funcionamento com movimento foi avaliado separadamente por controles, wheel, toque, testes e vídeos.

## Validação técnica

Resultados detalhados em `testes.json`, `revisao.json` e `desempenho.json`.

- **43 verificações funcionais aprovadas**, com Chromium, Firefox e WebKit e sem erros de execução na suíte.
- **24 verificações finais de composição, evidências e documentos**, mais **três verificações específicas do anúncio de carregamento**, aprovadas. São 70 verificações no conjunto da entrega.
- Larguras **320, 375, 390, 430, 768, 820, 1024, 1280, 1440 e 1920px**, orientação 1180 × 820 e ampliação de 200% por CSS `zoom`.
- Axe A/AA, WCAG 2.1 e 2.2 AA: nenhuma violação detectada nos estados auditados em 390, 820 e 1440px; galeria avaliada nas três atmosferas.
- Teclado, foco, áreas de toque, âncoras, seleção comercial e resumo local. Sem POST, cookies, localStorage, sessionStorage ou dados pessoais no fluxo.
- Rede lenta e falha de imagem: retorno visível, preservação da cena anterior e alternativa legível. Uma imagem atrasada não substitui a última escolha.
- A mensagem visual de espera é espelhada na região `aria-live` já existente fora da área `aria-busy`, para não adiar o anúncio até o fim da decodificação. Essa estrutura é verificada nos três navegadores em `feedback.json`; não substitui o teste futuro com leitor de tela. A decisão segue o comportamento documentado de [aria-busy](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy).
- Movimento somente na fotografia da galeria e comparação de pixels antes/depois de movimentar o ponteiro sobre ela: nenhuma alteração por hover.
- WebGL indisponível, baixa qualidade e limite de resolução, perda/restauração de contexto, pôster de apoio e pausa fora da abertura.
- Conteúdo sem JavaScript, redução de movimento e mudança de preferência durante a interação.
- Página de evidências, relatórios, imagens e vídeos avaliados no navegador, incluindo reprodução dos arquivos e verificação de suas cópias.
- `npm.cmd run check` e `npm.cmd run build` executados. O build final contém as rotas históricas e as quatro rotas da Etapa 4.

Firefox foi executado fora do sandbox, pois o encerramento ao criar a página nesse ambiente já havia sido identificado nas etapas anteriores. Não houve mudança de configuração do sistema.

## Desempenho

JavaScript alcançável, incluindo imports dinâmicos: **68.282 bytes gzip**. CSS: **9.364 bytes gzip**. Nenhuma biblioteca, fonte ou fotografia nova. As mesmas 20 variantes de imagem da Etapa 3 são reutilizadas, com carregamento tardio abaixo da dobra.

Medição local de produção, Chromium/Windows e GTX 1650, sem throttling: LCP de **688ms** na amostra desktop e **236ms** na amostra mobile emulada; CLS **0** no carregamento e percurso medido. Em 90 intervalos de rAF da passagem, mediana **16,7ms**, p95 **17,0ms**. A média da chamada de render no CPU ficou próxima de **0,49ms**.

Esses valores descrevem o computador local. Não são métricas de campo, FPS efetivamente apresentado ou tempo de GPU. A emulação de celular não comprova desempenho em aparelho modesto, rede móvel ou uso térmico prolongado.

## Avaliação crítica e limites restantes

O refinamento torna a leitura dos serviços mais presente, contém o campo amarelo pela fotografia, dá mais largura e corpo ao processo e conclui a página com uma frase balanceada e uma imagem mais breve. A abertura mantém sua força, sem exigir que as demais seções imitem o shader. A galeria fica mais legível durante a troca e mais clara durante uma espera real.

O site continua extenso em 320px. Parte disso é consequência de manter texto legível, os serviços completos e o caráter fotográfico. A escolha de ritmo deve ser avaliada pelo proprietário na navegação contínua; o percentual de redução, isoladamente, não decide o acabamento.

As fronteiras cromáticas são intencionais e permanecem visíveis. Não foi adicionada uma transição animada entre cada fundo. Caso alguma passagem ainda pareça forte na avaliação, o próximo ajuste deve considerar conteúdo e composição local, sem encobrir a separação com um efeito.

Não foram validados aparelhos físicos iOS/Android, Safari real, leitor de tela, todas as variações de zoom nativo ou desempenho térmico. WebKit no Windows e axe complementam a revisão, sem certificar acessibilidade integral. A refração continua bidimensional; os originais sintéticos mantêm os limites de nitidez em alta densidade.

Não se afirma equivalência comprovada aos melhores projetos de galerias profissionais. A entrega é apresentada para avaliação visual e funcional do proprietário, com evidências e limites explícitos.

## Arquivos e preservação

`ARQUIVOS.md` lista os arquivos novos; `inventario.json` registra caminhos, bytes e hashes. O snapshot `preservacao-inicial.json` registra os **1.270 arquivos anteriores** e o estado do índice Git no começo da tarefa.

Os arquivos anteriormente staged, a Etapa 3, original, estudos, recursos, dados comerciais, lógica do formulário, AGENTS e Skills foram preservados byte a byte. A página principal não foi substituída. A implementação nova contém somente os componentes que precisaram de mudança estrutural/interativa, CSS por responsabilidade, documentação e ferramentas de validação.

Todo o acervo visual vem das gerações já documentadas em `docs/redirecao/etapa-3/fontes/` e `docs/fontes/`. Não foram geradas novas cenas nem utilizados recursos de terceiros sem origem documentada. Os ambientes continuam identificados como sintéticos e ilustrativos.

## Skills e critérios

Frontend-design orientou a revisão de composição, hierarquia e ritmo; ui-ux-pro-max, a leitura, toque e retorno de carregamento; design-motion-principles, a contenção da galeria e suas interrupções; design-taste-frontend, a crítica da uniformidade tabular e dos intervalos; web-design-guidelines, a auditoria de interface.

A prioridade foi o acabamento de Jakub, com contenção de Emil nos controles. Receitas genéricas de blur, hover fotográfico, sorteio de paleta ou remoção de shaders não prevaleceram sobre o briefing. As [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) foram consultadas durante a revisão. A aplicação das Skills não implicou instalar seus kits, reconstruir o site ou adicionar dependências.

Sugestão de commit: `feat: refina ritmo e acabamento da experiência Lâmina`.

**Aguardando avaliação do proprietário antes de substituir a página principal.**
