# Etapa 3 — a experiência completa

Website demonstrativo de serviços de piscinas. Público: quem planeja construir, renovar ou cuidar de uma piscina. Ação principal: simular um orçamento local, sem envio, valores ou dados pessoais.

## Continuidade e composição

Rota nova: `/estudos/etapa-3/`. Original, A/B e Etapa 2 permanecem disponíveis. O hero é reproduzido sem mudança de composição; apenas o destino de Ambientes passa a ser local. Serviços, renderer, shader, coreografia e lógica comercial são importados da base aprovada. Não se inicia a Etapa 4.

Paleta preservada: profundo `#083C63`, água `#16C7AD`, solar `#F6D567`, mineral `#E9F9E7`, azul `#1658BA`. Syne nos títulos; Instrument Sans no conteúdo, ambas locais. A cor muda a atmosfera, sem retângulos atrás dos títulos nem um fundo único para toda a página.

| Momento | Composição | Papel da fotografia e do movimento |
| --- | --- | --- |
| Abertura → serviços | Hero e Margem aberta existentes | Assinatura principal: refração restrita à água e passagem reversível no scroll. |
| Ambientes | Uma imagem ampla, margem cromática, seleção de três atmosferas | Luz aberta, jardim de geometria curva e noite. Travessia curta entre imagens por ação explícita; sem autoplay, hover ou refração adicional. |
| Materiais | Campo solar, detalhe próximo e leitura em três assuntos | Fotografia nova de encontro entre pedra, cerâmica e água. Disclosures nativos, sem uma segunda galeria. |
| Processo | Campo profundo, título à esquerda e percurso vertical contínuo | A tipografia explica quatro momentos hipotéticos de atendimento. Sem cards, promessas de prazo ou revelações que escondam conteúdo. |
| Simulação | Campo azul, introdução e formulário em relação lateral | Mesmos dados e lógica existentes. Em celular, sequência linear, controles amplos e resumo acessível. |
| Encerramento | Pátio ilustrativo, convite ao orçamento e marca em escala ampla | Retoma a abertura por luz, água e tipografia; sem repetir as três imagens da galeria. |

Desktop usa relações laterais e imagens panorâmicas. Tablet redistribui a margem da galeria; mobile recebe enquadramentos verticais próprios, controles abaixo da fotografia e processo linear. Bordas de conteúdo seguem o gutter já estabelecido.

## Movimento e interação

Contexto: apresentação autoral de serviços em Astro/TypeScript. Perspectiva principal de acabamento: Jakub; secundária de exploração fotográfica: Jhey; contenção nos controles e formulário. O briefing detalha o contexto e autoriza esta implementação.

- Principal: continuidade existente, sem reconstrução.
- Secundário: troca de ambiente com sobreposição e pequeno deslocamento, sem distorção; interrupções usam a última seleção. Teclado e movimento reduzido recebem troca imediata.
- Controles: resposta curta em cor e borda; nenhum zoom de fotografia no hover.
- Sem JS: todos os ambientes e o processo continuam legíveis; formulário informa a limitação.
- Sem WebGL: fallback aprovado é reutilizado. Conteúdo novo não depende do canvas.

## Recursos e revisão crítica

Novas imagens sintéticas via imagegen integrado, originais, prompts e derivados locais documentados. As imagens não representam obras realizadas. A imagem de encerramento vem do acervo sintético já autorizado. Nenhum contato, equipe, cliente ou resultado é inventado.

Skills: frontend-design na autoria; design-motion-principles na troca de estado; ui-ux-pro-max em teclado, toque e imagens responsivas; design-taste-frontend como crítica de repetição, texto e acabamento; web-design-guidelines na auditoria. As receitas de template, sorteio de paleta, proibição genérica de shader e hover fotográfico da taste não substituem a direção explicitamente preservada pelo proprietário.

Verificar dez larguras de 320 a 1920px, orientação, teclado, toque, links, seleção comercial, resumo sem rede/persistência, ausência de JS, movimento reduzido e fallback gráfico. Inspecionar capturas reais e quadros das gravações. Documentar limites físicos e oportunidades da Etapa 4 sem implementá-la.
