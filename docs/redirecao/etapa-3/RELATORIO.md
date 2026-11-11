# Lâmina — Etapa 3: a experiência completa

Entrega de 11/11/2026. A base provisória da Etapa 2, **Margem aberta**, foi continuada em uma rota nova. A Etapa 4 não foi iniciada. Nenhum commit, push ou deploy foi realizado.

## Abrir a experiência

No PowerShell, na raiz do projeto, execute `npm.cmd run dev`. A forma `.cmd` evita a política de execução que pode bloquear o atalho `npm.ps1`, sem alterar configurações do sistema.

- [Experiência completa](http://127.0.0.1:4321/estudos/etapa-3/).
- [Capturas e gravações](http://127.0.0.1:4321/estudos/etapa-3/revisao/).
- [Alternativa sem WebGL](http://127.0.0.1:4321/estudos/etapa-3/?grafico=fallback).
- [Começar na atmosfera noturna](http://127.0.0.1:4321/estudos/etapa-3/?ambiente=noite#ambientes).
- [Etapa 2 preservada](http://127.0.0.1:4321/estudos/etapa-2/), [estudos A/B](http://127.0.0.1:4321/estudos/) e [original](http://127.0.0.1:4321/).

Sem servidor, a [galeria local](index.html) permite abrir PNGs, vídeos e documentação por caminhos relativos. Os servidores de desenvolvimento e de medição usados na execução são encerrados ao concluir a entrega.

## O que foi construído

**Abertura e serviços:** hero reproduzido com a mesma marcação, composição, fotografia e conteúdo; somente o link Ambientes passa a apontar para a própria página. Serviços, passagem, renderer, shader, calibração da água e lógica de orçamento são importados dos arquivos históricos, sem modificá-los. A diferença é demonstrada também pelo teste que compara a marcação do hero.

**Ambientes:** uma galeria editorial com três atmosferas originais. Luz aberta apresenta piscina retangular e pedra clara; Jardim adentro explora contorno curvo, cerâmica verde e vegetação; Depois do sol trabalha azul noturno, iluminação submersa e tijolo. Uma fotografia ampla se relaciona com uma margem de cor; não são três cards. Os nomes, botões anterior/próximo e teclas direcionais permitem selecionar a cena. Home/End levam à primeira/última. Há suporte adicional a gesto horizontal, sem tornar o gesto necessário. O estado pode ser compartilhado pelo parâmetro `ambiente`.

A troca combina sobreposição e deslocamento curto de 18px em 580ms; a saída é mais breve. A última seleção prevalece durante a decodificação da imagem. Teclado e movimento reduzido recebem troca imediata. Não há autoplay, zoom no hover, refração adicional ou influência do ponteiro. Sem JavaScript, os três ambientes aparecem em sequência e os controles inoperantes não são expostos.

**Materiais:** um campo solar aproxima pedra, cerâmica e água. A fotografia é um detalhe novo, não um recorte repetido da abertura. Três disclosures HTML nativos explicam revestimento, borda e sistemas. A foto usa o enquadramento vertical também no desktop/tablet para evitar ampliar um pequeno recorte de uma variante horizontal.

**Processo:** um percurso tipográfico contínuo apresenta entender, observar, planejar e realizar/cuidar. A coluna introdutória acompanha a leitura no desktop; o celular usa fluxo linear. O texto descreve um atendimento hipotético, sem inventar prazos, equipes, garantias, preços ou procedimentos exclusivos da empresa.

**Orçamento:** mesmo componente, categorias e função existentes. A apresentação relaciona introdução e formulário em duas áreas no desktop e segue uma coluna no celular ou quando a largura disponível se reduz pelo zoom. Links comerciais pré-selecionam o serviço. O resumo é local; não há envio, persistência ou coleta de dados pessoais.

**Encerramento:** convite ao orçamento, fotografia de pátio do acervo sintético existente e marca em grande escala. O turquesa e o azul retomam a identidade da abertura. Nenhuma das fotografias novas da galeria é repetida para preencher o rodapé.

## Direção artística e avaliação crítica

| Critério | Resultado e limite |
| --- | --- |
| Continuidade | A escala sai da arquitetura, aproxima os ambientes, chega à matéria e depois ao planejamento. O encerramento recupera água e tipografia. A maior coreografia continua concentrada na abertura. |
| Variedade fotográfica | Quatro novas cenas sintéticas e um pátio do acervo, com funções diferentes. A repetição da mesma piscina permanece apenas no hero, destino dos serviços e detalhe histórico desses serviços, preservados por instrução. |
| Cor | Azul profundo, mineral, solar, azul luminoso e turquesa estabelecem atmosferas distintas. A galeria também muda a cor da margem de acordo com a fotografia. Não há predominância de fundos brancos/bege nem títulos apoiados em retângulos azuis. |
| Composição | Fotografia ampla na galeria, detalhe vertical nos materiais, percurso tipográfico no processo, formulário lateral e marca final. As seções não repetem uma mesma família de cards. |
| Movimento | Passagem óptica principal preservada e galeria como interação secundária. Materiais, processo e encerramento não recebem revelações automáticas para esconder conteúdo. A animação pode ser interrompida e cessa no modo reduzido. |
| Mobile | Enquadramentos verticais próprios; imagem e margem se tornam uma sequência; controles de seleção e setas permanecem visíveis. A ação da margem se ancora na base e a troca não altera a altura do quadro. |
| Clareza comercial | Serviços, aplicações, percurso e simulação formam um caminho legível. O visitante pode selecionar o serviço a partir de várias partes do conteúdo, sem contatos ou projetos executados inventados. |
| Originalidade | A identidade está na combinação da assinatura óptica existente, margens cromáticas e diferentes escalas fotográficas. O processo usa um percurso vertical conhecido, integrado à linguagem da página; não se apresenta cada componente isolado como uma invenção inédita. |

A experiência ficou mais variada e completa, mas **a duração no celular merece avaliação do proprietário**. Fotografias generosas, serviços preservados e quatro momentos de processo produzem um percurso longo. A Etapa 4 poderá calibrar densidade, pausas e a relação entre galeria e materiais a partir dessa avaliação. Nesta entrega, o fluxo completo foi implementado sem reconstruir as partes anteriores.

O resultado foi avaliado em imagens e gravações reais locais. Não se afirma equivalência comprovada aos melhores projetos do Landing Love nem se atribuem observações de movimento a referências externas não reproduzidas nesta sessão.

## Capturas e gravações

**47 capturas da experiência** em PNG, com densidade de dispositivo 1, mais três capturas da apresentação de evidências. PNGs principais não foram reamostrados; as versões WebP públicas são prévias reduzidas. [Manifesto com dimensões e hashes](evidencias.json).

| Formato | Página inteira | Galeria | Materiais | Encerramento |
| --- | --- | --- | --- | --- |
| Desktop 1440 × 900 | [PNG](evidencias/desktop-completa.png) | [Jardim](evidencias/desktop-ambiente-jardim.png) | [PNG](evidencias/desktop-materiais.png) | [PNG](evidencias/desktop-encerramento.png) |
| Tablet 820 × 1180 | [PNG](evidencias/tablet-completa.png) | [Jardim](evidencias/tablet-ambiente-jardim.png) | [PNG](evidencias/tablet-materiais.png) | [PNG](evidencias/tablet-encerramento.png) |
| Mobile 390 × 844 | [PNG](evidencias/mobile-completa.png) | [Noite](evidencias/mobile-ambiente-noite.png) | [PNG](evidencias/mobile-materiais.png) | [PNG](evidencias/mobile-encerramento.png) |

As capturas longas usam **a preferência nativa de movimento reduzido**. Um canvas fixo com coreografia vinculada à rolagem não pode ocupar simultaneamente as posições de abertura e de destino em uma captura integral. A alternativa estática nativa registra esses dois enquadramentos sem montagem. Capturas de seções, passagem e gravações mantêm movimento ativo.

- [Gravação desktop](videos/percurso-desktop.webm): wheel, chegada aos serviços, reversão, seleção de atmosferas, materiais, processo, resumo e marca final.
- [Gravação mobile](videos/percurso-mobile.webm): gestos CDP, toque nos controles e formulário, percurso até o encerramento.
- Sequências de quadros reais: [desktop](evidencias/video-desktop-sequencia.png) e [mobile](evidencias/video-mobile-sequencia.png), amostradas aproximadamente a cada dois segundos, sem interpolação.
- Fallback: [desktop](evidencias/desktop-fallback.png), [tablet](evidencias/tablet-fallback.png), [mobile](evidencias/mobile-fallback.png).
- Limites de largura: [320px](evidencias/small-ambientes.png), [1920px](evidencias/wide-ambientes.png); [zoom CSS 200%](evidencias/tablet-zoom-200.png).

Os vídeos são brutos: incluem preparação e carregamento inicial do navegador, inclusive os primeiros quadros antes da página aparecer. Não há montagem, interpolação ou transições adicionadas na edição. As cópias públicas são verificadas byte a byte e reproduzidas no navegador. A cadência de gravação não é usada como medida de FPS da experiência.

## Validação

[Testes funcionais](testes.json), [revisão final de composição e apresentação](revisao.json), [medições](desempenho.json).

- **38 verificações funcionais aprovadas**, em Chromium, Firefox e WebKit, sem erros de execução na suíte final de produção.
- **20 verificações finais de composição e apresentação aprovadas**, incluindo as dez larguras após o refinamento da fotografia e da margem.
- Dez larguras: **320, 375, 390, 430, 768, 820, 1024, 1280, 1440 e 1920px**. Também reorientação para 1180 × 820 e ampliação de 200% por CSS `zoom`.
- Axe A/AA, WCAG 2.1 e 2.2 AA: **zero violações detectadas** nos nove estados avaliados por formato em 390, 820 e 1440px; a revisão posterior dos ajustes de margem e fotografia repete a auditoria nos três formatos.
- Seleção e interrupção da galeria, teclado, foco visível, nomes acessíveis, URL, conteúdo inativo, materiais nativos, âncoras, toque e resumo comercial.
- Ausência de POST, cookies, localStorage e sessionStorage no fluxo de simulação.
- Conteúdo sem JavaScript, movimento reduzido, mudança de preferência durante a animação e fallback sem WebGL.
- Continuidade/reversão do hero, alinhamento do quadro de destino e ausência de desenho do canvas fora da abertura.
- Apresentação em 320, 390, 820 e 1440px: imagens decodificadas, links e recursos respondendo 200, ausência de overflow, axe e reprodução dos dois vídeos.
- `npm.cmd run check`: zero erros, avisos e hints. `npm.cmd run build`: sete rotas estáticas.

A revisão aplica as [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), consultadas nesta sessão. A auditoria automatizada complementa a inspeção; não certifica acessibilidade integral.

## Problemas encontrados e correções

1. **Zoom a 200%:** a área do formulário ficava estreita e o botão excedia a largura. Os novos blocos passaram a responder à largura dos próprios containers, com reflow dos elementos e limite do botão.
2. **Mudança de altura entre atmosferas no celular:** títulos e descrições ocupavam alturas diferentes. A margem ganhou reserva de altura e ação ancorada à base, evitando deslocar o restante da página durante a troca.
3. **Nitidez do detalhe no tablet:** um recorte vertical dentro da variante horizontal pequena causava ampliação desnecessária. Materiais agora solicita diretamente a variante vertical própria.
4. **Sandbox/Firefox:** o navegador encerrou ao criar a página dentro do sandbox. A suíte foi executada fora dele, como nas etapas anteriores. Nenhuma configuração do sistema foi alterada.
5. **Import interrompido no teste:** o harness restaurava a preferência de movimento e navegava antes de os imports dinâmicos terminarem, causando erro de cancelamento no Firefox. O teste passou a aguardar a restauração. O renderer e a coreografia históricos não foram modificados.
6. **Amostragem dos vídeos:** o ffmpeg do Playwright não inclui o filtro `fps`. A extração usa a opção de cadência de saída suportada, preservando os registros brutos.

Lint editorial: **592 palavras, zero FAIL e um WARN** por duas manchetes em frases curtas (“A água muda. O lugar, também.” e “Outra luz. A mesma pausa.”). O aviso foi mantido deliberadamente: a primeira apresenta o tema da galeria e a segunda descreve a mudança de luz noturna. Não se espalhou esse recurso por todas as seções. O lint é uma heurística de estilo, não uma falha funcional.

## Desempenho e limites

JavaScript alcançável, incluindo imports dinâmicos: aproximadamente **68 KB gzip**. CSS: aproximadamente **7,6 KB gzip**. Nenhuma dependência ou fonte nova foi adicionada. Os 20 arquivos de imagem somam cerca de 3,64 MB, considerando todas as variantes; cada dispositivo solicita apenas as variantes aplicáveis e as imagens abaixo da dobra usam carregamento tardio.

Medição local sem throttling, no build de produção, em Chromium/Windows com GTX 1650: LCP abaixo de um segundo nas duas amostras; CLS zero no carregamento e percurso medido. Noventa intervalos de rAF durante a passagem tiveram mediana próxima de 16,7ms. Valores exatos e o ambiente estão em `desempenho.json`.

Essas amostras não são métricas de campo, nem provam desempenho em celular modesto. rAF não mede tempo real de GPU nem frames efetivamente apresentados. WebKit no Windows não equivale a Safari físico. Não foram validados aparelhos reais iOS/Android, leitor de tela, uso térmico prolongado, conexão móvel lenta ou todas as variações de zoom nativo.

A fotografia continua sintética. Textura e geometria não devem ser interpretadas como especificação técnica para executar uma piscina. Os originais históricos limitam nitidez em alta densidade; os novos originais também não são fotografias 4K. A refração preservada é uma interpretação óptica bidimensional sobre uma máscara da água.

## Arquivos, origem e Skills

[Lista de arquivos criados e preservados](ARQUIVOS.md), [inventário com hashes](inventario.json), [decisão anterior à implementação](DIRECAO.md), [fontes e prompts](fontes/README.md).

Todas as alterações de código desta etapa são **arquivos novos**. Não foram modificados AGENTS.md, Skills, dados compartilhados, lógica de orçamento, renderer, shader ou rotas históricas. Não houve dependência adicional. Astro, TypeScript, GSAP e OGL continuam sendo a base.

Skills aplicadas: frontend-design na composição; design-motion-principles no ritmo, interrupção e alternativas; ui-ux-pro-max em teclado, toque e imagens responsivas; design-taste-frontend na crítica fotográfica, texto e repetição; web-design-guidelines na revisão. A taste foi usada como crítica complementar: seu kit, sorteio de paleta, regras genéricas contrárias a shaders e hover fotográfico não substituem a direção preservada pelo proprietário. Sites orientou apenas o fluxo local, sem registro, sincronização ou publicação. Imagegen gerou os quatro novos originais, com prompts integrais e derivados dentro do projeto.

## Para a avaliação do proprietário

Avaliar a duração total em mobile, o tamanho e o ritmo das fotografias, a margem da galeria, o peso dos campos solar/azul e o encerramento. A Etapa 4 poderá tratar o refinamento global após essa avaliação; não foi iniciada automaticamente.

Sugestão de commit semântico: `feat: desenvolve experiência completa da Lâmina na etapa 3`.
