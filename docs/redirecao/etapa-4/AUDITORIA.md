# Revisão final de interface — Etapa 4

Aplicada à experiência renderizada, aos novos componentes e às diferenças em relação à Etapa 3. Diretrizes consultadas: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md.

## Resultados por arquivo

- `src/studies/etapa-4/styles/services.css:3` — intervalos corrigidos; títulos, imagem e ações preservados. Sem overflow nas dez larguras.
- `src/studies/etapa-4/styles/materials.css:3` — fotografia integrada à borda; recorte próprio em mobile, sem animação de hover.
- `src/studies/etapa-4/styles/materials.css:9` — controles nativos com 64px de altura, foco e contraste preservados.
- `src/studies/etapa-4/styles/process.css:14` — corpo ampliado para 17px; 16px em mobile. Conteúdo inteiro visível.
- `src/studies/etapa-4/styles/commercial.css:10` — título final balanceado, sem quebra forçada ou palavra isolada.
- `src/studies/etapa-4/scripts/atmospheres.ts:53` — retorno após espera perceptível, com cena atual mantida.
- `src/studies/etapa-4/scripts/atmospheres.ts:58` — aviso acessível fora de `aria-busy`; mensagem visual duplicada apenas para apresentação, escondida da árvore acessível.
- `src/studies/etapa-4/scripts/atmospheres.ts:63` — falha de imagem tratada sem substituir uma cena válida por imagem quebrada.
- `src/studies/etapa-4/scripts/atmospheres.ts:88` — somente opacidade na foto; margem e texto estáveis, sem blur, deslocamento ou zoom.
- `src/studies/etapa-4/components/DocumentLayout.astro:5` — relatórios acessíveis pelo próprio site, com skip link, navegação e foco.

## Evidência

`testes.json`: 43 verificações funcionais nos três navegadores. `revisao.json`: 24 verificações de composição, recursos, vídeos e documentos. `feedback.json`: três verificações do status acessível em carregamento lento. Nenhuma violação detectada pelo axe nos estados avaliados. A revisão visual também usa `comparacao.json`, PNGs antes/depois e os registros brutos de movimento.

O lint editorial encontrou 596 palavras, zero FAIL e um WARN pela repetição de manchetes em duas frases na galeria. As duas manchetes existentes foram mantidas porque a interação e a identidade da galeria deveriam ser preservadas. Esse orçamento heurístico da Skill não justifica trocar arbitrariamente o texto aprovado.

## Limites em aberto

O percurso em 320px ainda é extenso, embora menor e mais legível. Permanecem necessários testes físicos em iOS/Android, Safari real, leitor de tela e desempenho em hardware modesto. Não há certificação de acessibilidade ou aprovação estética automática decorrente dos resultados.
