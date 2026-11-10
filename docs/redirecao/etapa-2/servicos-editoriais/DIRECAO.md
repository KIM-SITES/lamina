# Correção editorial — decisão antes da implementação

A direção de cartaz da revisão anterior foi descartada: título amarelo de escala excessiva, fundos azuis atrás das linhas e interrupção da arquitetura. A correção não consiste em suavizar esses retângulos. Eles deixam de fazer parte da composição.

Três alternativas foram renderizadas em HTML, desktop e mobile, antes de alterar o protótipo. Ver `alternativas/comparacao-desktop.png` e `comparacao-mobile.png`.

| Alternativa | Construção | Decisão |
| --- | --- | --- |
| Margem aberta | Título na margem, fotografia ampla à direita, projeto junto ao quadro, detalhe de material e cuidado em segundo ritmo | Selecionada: separa hierarquia sem sufocar a imagem; permite ler espaço e material como partes do mesmo assunto. |
| Pausa horizontal | Panorama primeiro, título abaixo, três serviços distribuídos horizontalmente | Mais leve, mas a oferta ainda se aproxima de uma organização convencional de três colunas. |
| Profundidade | Campo profundo, título claro, fotografia e serviços em duas áreas | Atmosfera coerente com água, porém a superfície escura continua dominante demais para a correção pedida. |

## Sistema escolhido

Serviço demonstrativo de arquitetura e cuidado de piscinas. Ação principal: selecionar o serviço na simulação já existente. Fontes preservadas: Syne nos títulos editoriais, Instrument Sans no conteúdo e nas ações. Título principal em azul profundo, peso 400, escala controlada por sua coluna, sem plano colorido atrás. O amarelo aparece na ação comercial; o turquesa nos vínculos e estados funcionais. O fundo claro mineral `#E9F9E7` recebe a luz que emerge da fotografia. As outras cores permanecem as cinco aprovadas.

```text
desktop                             mobile
título     fotografia aberta        fotografia vertical
intro      à direita, sem moldura    com sangria à esquerda
                                    título + introdução
projeto    fotografia               projeto + ação

renovação  detalhe    manutenção     renovação + detalhe
ação                  ação          manutenção + ação
```

O primeiro serviço ancora a margem no desktop, em vez de se juntar a uma lista densa. Revitalização se relaciona ao detalhe da borda; manutenção recebe espaço próprio, sem caixa ou card. No mobile, a foto precede o título e a renovação divide espaço com um detalhe pequeno. Não se replica o empilhamento da grade desktop.

## Continuidade

A mesma matriz fotográfica deve chegar ao novo retângulo medido pelo controlador. Não há nova cena, perspectiva falsa ou máscara arbitrária. A foto conserva eixos arquitetônicos, mas deixa de funcionar como fundo tipográfico.

No desktop, a margem textual assume a leitura depois que a fotografia libera espaço à esquerda; apenas opacidade coordenada, sem caixas, blur ou translação independente. No mobile, o texto entra no fluxo após a foto, sem esse tratamento. Movimento reduzido apresenta a composição estática completa. Perspectiva de motion prioritária: acabamento e continuidade de Jakub, com exploração espacial de Jhey subordinada ao briefing. Contexto já definido pelo proprietário; não há pedido de nova fase.

Limites de escopo: somente protótipo isolado da Etapa 2 e ferramentas/evidências necessárias. Original, estudos A/B, hero, shader e simulação comercial preservados. Sem commits, push ou deploy.
