# Lâmina — A Superfície

Protótipo interativo da Fase 1 para **Lâmina — Piscinas & Paisagens**, empresa fictícia. Hero com refração WebGL, passagem reversível para serviços, dois ambientes ilustrativos e simulação local de orçamento. Não é o website definitivo.

## Abrir no VS Code

Abra esta pasta no VS Code. No terminal integrado PowerShell:

```powershell
npm.cmd run dev
```

Abra **http://127.0.0.1:4321**. Não abra `dist/index.html` diretamente como arquivo: os módulos e recursos precisam de um servidor HTTP.

Node usado: **24.19.0**. Dependências já foram instaladas neste workspace. Em uma cópia nova, execute `npm.cmd ci` antes de iniciar. O sufixo `.cmd` evita o bloqueio do `npm.ps1` pela política de execução deste Windows, sem modificar a política do sistema.

## O que experimentar

1. Mova “Explorar a superfície” com mouse, toque ou setas/Home/End.
2. Role até os serviços e retorne para observar a transição reversível.
3. Alterne os dois ambientes ilustrativos.
4. Escolha serviço e tipo de imóvel e pressione “Ver resumo”. Nenhuma informação é enviada ou armazenada.
5. Ative movimento reduzido no sistema ou nas ferramentas do navegador.

Variações para revisão:

- `/?calibracao=discreta`
- `/?calibracao=moderada` — escolhida, também é o padrão.
- `/?calibracao=expressiva`
- `/?grafico=fallback` — alternativa sem shader.
- `/?ambiente=patio#ambientes` — segundo ambiente diretamente.

## Documentação e evidências

- [Relatório completo da Fase 1](docs/relatorio-fase1.md).
- [Galeria local de capturas e gravações](docs/evidencias/index.html) — pode ser aberta no navegador como arquivo.
- [Planejamento aprovado](docs/planejamento-aprovado.md).
- [Briefing de execução autorizado](docs/briefing-execucao-fase1.md).
- [Registro das três etapas](docs/etapas.md).
- [Origem das imagens, prompts e licenças](docs/fontes/README.md).
- [Medições brutas](docs/evidencias/performance.json).

## Build e validação

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd run preview -- --port 4322
```

Para instalar os navegadores de teste em uma cópia nova:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.cache\ms-playwright'
npx.cmd playwright install chromium firefox webkit
```

Depois de gerar a build, `npm.cmd test` executa os testes e inicia o preview de teste automaticamente caso a porta 4322 esteja livre. Não modifica preferências globais dos navegadores. Neste ambiente restrito, Firefox precisou de execução de testes com permissão ampliada para iniciar; o diagnóstico e a execução autorizada foram concluídos.

Para regenerar evidências e medições, mantenha o preview ativo em outro terminal:

```powershell
$env:BASE_URL = 'http://127.0.0.1:4322'
npm.cmd run evidence
npm.cmd run measure
node scripts/evidence-index.mjs
```

Execute as medições sem outros testes/gravações concorrentes. `scripts/review-motion.mjs` extrai quadros dos vídeos para inspeção; usa o FFmpeg disponibilizado pelo Playwright.

## Organização

- `src/components`: apresentação e HTML semântico.
- `src/data`: conteúdo e escolhas comerciais.
- `src/scripts`: interação, orçamento, galeria e coordenação de rolagem.
- `src/graphics`: renderizador OGL, shaders e calibrações.
- `src/styles`: base, superfície, seções e responsividade.
- `public`: recursos locais otimizados.
- `tests` e `scripts`: validação, captura e medição.
- `docs`: planejamento, decisões e evidências.

Nenhum commit, push, repositório remoto ou deploy foi realizado. A Fase 1 termina neste protótipo; o website definitivo depende de avaliação posterior.
