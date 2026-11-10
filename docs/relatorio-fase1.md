# Relatório de entrega — Fase 1 da Lâmina

**Estado: protótipo integrado concluído e revisado.** As três etapas foram executadas continuamente, conforme autorização expressa. O website definitivo não foi iniciado. Não houve commit, push, criação de repositório remoto ou deploy.

## 1. Experiência desenvolvida

O protótipo apresenta Lâmina — Piscinas & Paisagens pelo conceito **A Superfície**. Uma piscina de água verde mineral e luz solar recebe uma refração localizada; o visitante explora sua posição e conduz uma passagem para um detalhe da água ao rolar. A narrativa continua em serviços, dois ambientes ilustrativos e uma simulação local de orçamento.

O título, os serviços resumidos, as ações e a identificação demonstrativa são HTML disponível antes do WebGL. A navegação não depende de esperar a animação terminar.

## 2. Arquitetura e tecnologias

| Tecnologia | Versão | Responsabilidade |
| --- | --- | --- |
| Astro | 7.4.8 | Build estática e componentes HTML |
| TypeScript | 6.0.3 | Contratos de conteúdo, interação e renderização |
| GSAP | 3.15.1 | Coordenação de estado de movimento |
| ScrollTrigger | parte do GSAP | Progresso reversível pela rolagem natural |
| OGL | 1.0.11 | Infraestrutura WebGL mínima |
| CSS / APIs nativas | plataforma | Layout, controles, galeria, observadores e alternativas |
| Playwright | 1.65.0 | Testes de navegador e gravação real |
| axe-core Playwright | 4.14.0 | Auditoria automática de acessibilidade |
| sharp | 0.35.5 | Otimização de recursos e composição das evidências |

A estrutura separa apresentação, dados, estado e gráficos. O renderizador recebe posição da superfície, progresso, energia e ponteiro; não altera texto nem foco. OGL foi preferido a Three.js porque a cena é fotográfica e plana, sem necessidade de câmeras ou modelos 3D. Não foram adicionados React, CMS, backend ou biblioteca de rolagem suave.

## 3. Arquivos criados e preservados

| Grupo | Arquivos e função |
| --- | --- |
| Página e componentes | `src/pages/index.astro`; `src/components/{Brand,SurfaceHero,Services,Environments,Quote}.astro` |
| Conteúdo | `src/data/content.ts` |
| Interações | `src/scripts/{main,surface,gallery,quote}.ts` |
| Gráficos | `src/graphics/{SurfaceRenderer,shaders,calibrations}.ts` |
| Estilos | `src/styles/{global,base,surface,sections,responsive}.css` |
| Recursos | Imagens WebP e fontes WOFF2 em `public`; favicon SVG próprio |
| Configuração | `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `playwright.config.ts`, `.gitignore` |
| Validação | `tests/prototype.spec.ts`; scripts de captura, medição, diagnóstico e preparação de recursos |
| Documentação | README, planejamento aprovado, briefing autorizado, registro de etapas, revisão de interface, fontes/licenças e evidências |

O [inventário completo](inventario-arquivos.txt) registra os arquivos de entrega. `AGENTS.md`, `.agents/skills` e `skills-lock.json` foram preservados. Não havia aplicação anterior a modificar. Nenhum arquivo do projeto Entrear foi acessado ou alterado.

## 4. Animação principal

Um triângulo de tela inteira executa um fragment shader próprio com duas texturas: a cena principal e um detalhe derivado da mesma imagem. Três componentes senoidais de frequências e velocidades diferentes formam o campo de deslocamento. Uma envoltória concentra a deformação na lâmina e uma crista luminosa discreta reforça a mudança óptica.

O range “Explorar a superfície” desloca essa região. Ponteiro de mouse acrescenta uma perturbação breve; toque e teclado operam o mesmo controle nativo. O relógio gráfico avança somente durante o desenho, evitando saltos de fase depois do repouso. A animação inicial se acomoda e o loop para; uma interação ou alteração de rolagem solicita novos quadros.

É uma interpretação óptica em duas dimensões, não uma simulação hidrodinâmica ou uma cena subaquática 3D. A escolha permite concentrar o custo na imagem e manter conteúdo nítido e independente.

## 5. Comparação das três calibrações

Comparadas em páginas reais do Chromium, com os mesmos controles, capturas de detalhe, vídeos e sequências extraídas das gravações.

| Calibração | Força / largura normalizadas | Observação visual | Decisão |
| --- | --- | --- | --- |
| Discreta | 0,006 / 0,10 | Preserva quase integralmente os degraus; a intervenção tende a desaparecer sobre os reflexos já presentes. | Preservada para comparação. |
| Moderada | 0,013 / 0,14 | Movimento perceptível sem deformar demais as linhas da pedra; melhor equilíbrio entre materialidade e leitura da piscina. | **Padrão escolhido.** |
| Expressiva | 0,026 / 0,20 | Maior presença óptica, mas altera mais a geometria dos degraus e aproxima algumas posições de um efeito de gelatina. | Preservada como alternativa experimental. |

As evidências estão em [calibrações](evidencias/index.html). A diferença de custo entre essas intensidades não foi isolada em benchmark: usam a mesma quantidade de amostragens e não se atribui ganho de desempenho a uma delas sem medição específica.

## 6. Transições

O fundo fica sticky somente dentro da sequência hero → passagem. O conteúdo permanece no fluxo normal. ScrollTrigger mapeia a posição da página ao progresso; não há interceptação de wheel, bloqueio de toque, alteração da velocidade da página ou pinning por longas distâncias.

A primeira revisão revelou dupla exposição na mistura global das imagens. A solução final revela o detalhe junto à frente da lâmina, preservando a fotografia inicial do outro lado. A faixa cresce durante a passagem e o detalhe ocupa a cena antes de entrar a superfície clara dos serviços. A sequência foi testada nos dois sentidos.

A galeria usa uma máscara curta e opacidade, sem repetir a coreografia principal. Trocas rápidas cancelam a limpeza anterior e mantêm um único ambiente ativo, legenda e estado de botão coerentes.

## 7. Funcionalidades

- Âncoras de serviços, ambientes, orçamento e retorno ao início.
- Exploração por mouse, toque e teclado, incluindo Home e End.
- Seleção dos dois ambientes por botões; estado compartilhável por `?ambiente=patio`.
- Links de serviço pré-selecionam a opção correspondente no orçamento.
- Simulação com somente serviço e tipo de imóvel; validação nativa e resumo anunciado por aria-live.
- Alterar uma escolha limpa o resumo anterior para não apresentar informação desatualizada.
- Nenhum dado pessoal, envio de formulário, contato fictício, cookie ou persistência da simulação.

## 8. Desktop, tablet e mobile

Validadas as larguras **320, 375, 390, 430, 768, 820, 1024, 1280, 1440 e 1920 px**, nos três motores. Também foram exercitados redimensionamento, orientação horizontal de tablet e zoom CSS de 200%.

Desktop usa cena panorâmica e composição ampla. Tablet reorganiza espaçamento, tipografia e controles para toque. Mobile usa um arquivo vertical recortado para preservar árvore, borda, degraus e água; a navegação se distribui em duas linhas, os serviços assumem fluxo vertical e a galeria usa proporção própria.

Não houve overflow horizontal nos cenários automatizados. Em telas estreitas ou baixas, o hero pode ultrapassar a primeira dobra para preservar conteúdo e controles. As áreas seguras do sistema foram consideradas no CSS. Não foi usado aparelho físico para confirmar notch, teclado virtual ou gestos do sistema.

## 9. Fallback e acessibilidade

Fotografia HTML é a base. WebGL só assume a imagem após a preparação das texturas e do programa. Falha gráfica mantém a alternativa CSS. A perda de contexto remove o canvas da apresentação e a restauração recria renderizador, recursos e caches de estado.

DPR limitado a 1,5 em ponteiro preciso e 1,25 em toque, com teto de dois milhões de pixels. Resolução pode ser reduzida progressivamente diante de intervalos de quadro persistentemente altos. O efeito para fora da área visível, com aba oculta e depois de acomodar o estado. Há descarte de texturas, buffers, programa, observadores e listeners gráficos.

Com movimento reduzido, não se inicia o renderer ou a transição contínua; as trocas são imediatas e o controle altera somente uma representação estática da região óptica. Sem JavaScript, as duas cenas e todo o conteúdo permanecem disponíveis; a simulação fica desabilitada com explicação visível.

HTML semântico, labels, fieldsets, controles nativos, foco visível, skip link e status acessível foram revisados. Os links têm tabindex zero para foco sequencial explícito no WebKit Windows, sem valores positivos. Consulte a [revisão de interface](revisao-interface.md).

## 10. Resultado dos testes

**39 testes aprovados, zero falhas, zero ignorados e zero instáveis**, na execução final de aproximadamente 66 segundos.

| Motor executado | Versão | Resultado |
| --- | --- | --- |
| Chromium completo | 158.0.8127.18 | 13/13 |
| Firefox | 159.0 | 13/13 |
| WebKit Windows | 27.2 | 13/13 |

Cobertura: navegação e destinos de âncora; simulação sem envio/persistência; dez larguras; orientação e zoom; teclado/foco/range; seleção rápida da galeria; preferência de movimento reduzido e mudança em tempo real; ausência de JavaScript; WebGL indisponível; textura interrompida; rolagem reversível; repouso/descarte; perda e restauração de contexto; toque emulado.

`npm.cmd run check`: zero erros, avisos ou hints. `npm.cmd run build`: concluído. Auditoria axe com tags WCAG 2 A/AA e WCAG 2.1 AA: nenhuma violação automática nos três motores. A verificação final de console também registrou zero erros, avisos e exceções na execução normal; [registro dos navegadores](evidencias/navegadores.json).

A primeira inicialização do Firefox ficou presa na restrição de processos do ambiente. O diagnóstico e a suíte foram executados com permissão ampliada autorizada; não foi alterada configuração de segurança do sistema.

## 11. Medições de desempenho

Build de produção, servidor local, Chromium completo headless. Três contextos móveis novos, viewport 390×844, DPR 2, toque e mobile emulados, cache HTTP desabilitado, CPU 4×, latência de 150 ms, download de 200 KiB/s e upload de 90 KiB/s.

| Medida | Resultado | Orçamento |
| --- | --- | --- |
| Todos os módulos JS, soma gzip | **65.647 bytes ≈ 64,1 KiB** | 120 KB |
| CSS gzip | 4.367 bytes ≈ 4,3 KiB | Sem teto específico |
| Duas fontes WOFF2 | **64.700 bytes ≈ 63,2 KiB** | 140 KB |
| Hero vertical mobile | **194.050 bytes ≈ 189,5 KiB** | 300 KB |
| Hero desktop 1440 | 287.672 bytes ≈ 280,9 KiB | 550 KB |
| Hero desktop maior | 360.032 bytes ≈ 351,6 KiB | 550 KB |
| Detalhe da água | 113.006 bytes ≈ 110,4 KiB | Recurso progressivo |
| LCP, três amostras | **1.736 / 1.252 / 1.124 ms** | Até 2.500 ms |
| CLS, três amostras | **0 / 0 / 0** | Até 0,1 |

Na amostra de movimento em 1440×900, a GPU identificada foi **NVIDIA GeForce GTX 1650, ANGLE/Direct3D11**. Foram 120 intervalos rAF em cerca de dois segundos: mediana 16,7 ms e percentil 95 de 16,8 ms. O custo médio da chamada JavaScript de renderização foi aproximadamente 0,38 ms.

Isso é compatível com agendamento próximo de 60 Hz neste computador, mas não mede diretamente apresentação da GPU nem garante esse desempenho em outros dispositivos. Uma medição anterior por SwiftShader ficou próxima de 33,3 ms de mediana; o [registro por software](evidencias/performance-software.json) foi preservado.

Não foi medido INP de campo. Os vídeos são codificados pelo gravador do navegador e sua taxa não corresponde ao FPS efetivo da aplicação. Dados completos em [performance.json](evidencias/performance.json).

## 12. Limitações e pendências de validação externa

- Não foram executados aparelhos Android/iOS físicos, testes térmicos ou de bateria, Safari real ou GPU integrada modesta.
- WebKit de Playwright em Windows não equivale a validar Safari em iPhone.
- Leitor de tela real não foi executado; houve revisão semântica e auditoria automática.
- O Chromium headless não mudou document.hidden ao alternar abas na tentativa de teste. O tratamento de visibilidade foi verificado por evento simulado; a pausa por oclusão real de janela ainda requer validação manual. O repouso e a pausa fora da seção foram exercitados normalmente.
- O teste comercial com três participantes do planejamento não pôde ser realizado nesta sessão. A clareza foi avaliada por inspeção, sem inventar participantes ou resultados.
- As cenas são sintéticas. A legenda identifica isso nos ambientes e a origem é documentada; não representam obras da marca.
- A recuperação automática de qualidade foi implementada, mas não foi certificada por ensaio prolongado em hardware modesto. Foi testado o fallback forçado e o ciclo de contexto nos três motores.
- As gravações do Landing Love não foram reproduzidas na pesquisa; não se afirma equivalência comprovada com essas experiências.
- Capturas de página inteira não reconstituem todos os estados de um fundo sticky. A sequência de estados e os vídeos são as evidências apropriadas de movimento.

Não há falha funcional conhecida nos cenários executados. As limitações acima permanecem explícitas e não foram convertidas em afirmações de testes realizados.

## 13. Capturas e gravações

São **52 capturas principais** e **seis vídeos WebM**, além das sequências extraídas para revisão e registros da primeira iteração.

- [Galeria completa, aberta como arquivo local](evidencias/index.html).
- Hero: [desktop](evidencias/responsividade/hero-1440.png), [tablet](evidencias/responsividade/hero-820.png), [mobile](evidencias/responsividade/hero-390.png).
- Percursos: [desktop](evidencias/videos/percurso-desktop.webm), [tablet](evidencias/videos/percurso-tablet.webm), [mobile](evidencias/videos/percurso-mobile.webm).
- [Sequência do vídeo desktop](evidencias/movimento/percurso-desktop-sequencia.png) e [mobile](evidencias/movimento/percurso-mobile-sequencia.png).
- [Manifesto de arquivos](evidencias/manifesto.json).

Os vídeos finais dos percursos mantêm a proporção de cada viewport. Nenhum vídeo foi incorporado ao carregamento do protótipo; estão somente na documentação.

## 14. Executar no VS Code

Abra esta pasta e um terminal integrado PowerShell. Dependências estão instaladas:

```powershell
npm.cmd run dev
```

Abra **http://127.0.0.1:4321**. Para uma cópia nova: `npm.cmd ci`. Para a build: `npm.cmd run check`, depois `npm.cmd run build` e `npm.cmd run preview`.

O uso de `npm.cmd` evita o bloqueio local de `npm.ps1`, sem alterar políticas do Windows. Há instruções completas de testes, navegador e regeneração de evidências no [README](../README.md).

## 15. Sugestões de commits

Somente sugestões; nenhum commit foi executado:

1. `feat: cria hero interativo com lâmina óptica`
2. `feat: integra serviços e orçamento ao protótipo`
3. `fix: refina acessibilidade e desempenho do protótipo`

Como as etapas já estão integradas sem commits intermediários, a recomendação prática é um único commit de consolidação: **`feat: entrega protótipo interativo da Lâmina`**.

## 16. Avaliação crítica

A composição comunica piscina imediatamente, sustenta a paleta mineral e mantém conteúdo comercial disponível. O recorte mobile funciona como uma composição própria; a passagem tem continuidade com a cena inicial e não depende de bloquear a navegação. A versão moderada evita deformar ostensivamente a construção.

O ponto mais forte é a relação entre fotografia, detalhe da água e controle de exploração. A assinatura permanece contida: ela não constitui uma simulação física e pode parecer discreta em uma visita rápida. O próximo refinamento artístico, se aprovado após avaliação, deve buscar mais leitura de profundidade na fronteira óptica e melhor continuidade de detalhe, sem simplesmente aumentar distorção.

Considero esta uma primeira versão refinada e viável para avaliação do conceito. Não considero demonstrada ainda a mesma qualidade de movimento em aparelhos modestos nem uma equivalência universal ao padrão das galerias. Essa conclusão depende da avaliação do proprietário e dos testes externos listados acima. A execução para aqui, ao fim da Fase 1.
