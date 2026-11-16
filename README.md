# Lâmina — Piscinas & Paisagens

Website demonstrativo de uma empresa fictícia de projeto, construção, revitalização e manutenção de piscinas. A direção **A Superfície** combina fotografia sintética, tipografia e uma passagem óptica entre a abertura e os serviços.

## Executar

Requer **Node.js 22.23.4+**, conforme a versão de Astro fixada no lockfile. Validado neste projeto com Node.js 24.19.0.

```sh
npm ci
npm run dev
```

Abra **http://127.0.0.1:4321/**. No PowerShell, use `npm.cmd` se a política local bloquear `npm.ps1`. Não abra o HTML de `dist/` diretamente pelo sistema de arquivos.

```sh
npm run check
npm run build
npm run preview -- --port 4322
```

O build estático publica apenas a página principal. Estudos e versões anteriores permanecem no histórico do Git.

## Interações e alternativas

- A rolagem nativa conduz a refração reversível da abertura até a fotografia dos serviços.
- A galeria oferece seleção direta, setas, toque e teclas direcionais/Home/End. O parâmetro `?ambiente=jardim` ou `?ambiente=noite` abre uma atmosfera específica.
- Os materiais usam disclosures nativos, acessíveis por teclado.
- A simulação de orçamento reúne serviço e tipo de imóvel em um resumo local. Não calcula preços, coleta dados pessoais ou envia solicitações.
- `prefers-reduced-motion` apresenta a página estática. Sem JavaScript, os três ambientes e o conteúdo continuam disponíveis; a simulação informa sua limitação.
- `?grafico=fallback` permite conferir a alternativa sem WebGL. `?qualidade=baixa` exercita a resolução gráfica reduzida.

## Verificar

Depois do build, instale os navegadores de teste na pasta local ignorada pelo Git:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.cache/ms-playwright'
npx.cmd playwright install chromium firefox webkit
npm.cmd test
```

`npm test` inicia o preview na porta 4322 quando necessário e encerra o servidor que iniciou. A suíte cobre Chromium, Firefox e WebKit, dez larguras entre 320 e 1920px, teclado, toque, galeria, orçamento, axe, movimento reduzido e falhas gráficas. O resultado atual substitui `test-results/results.json`, ignorado pelo Git; não cria galerias de evidências.

No sandbox Windows usado no desenvolvimento, o Firefox exigiu execução com permissão ampliada. Em um terminal local, execute os mesmos comandos acima.

`npm run measure`, com o preview ativo, imprime peso dos bundles e amostras locais de LCP, CLS e rAF. Não representa métricas de campo nem desempenho em aparelho físico. `BASE_URL` seleciona outro servidor; `ENGINES=chromium` limita a suíte a um motor.

## Organização

```text
src/
  assets/images/   Matrizes das sete cenas utilizadas
  components/      Seções e apresentação semântica
  data/            Conteúdo e opções da simulação
  graphics/        Renderer OGL, shader e geometria óptica
  pages/           Página principal
  scripts/         Continuidade, galeria e orçamento
  styles/          Base e estilos por seção
public/            19 WebPs, duas fontes e favicon
scripts/           Preparação de assets, testes e medição
tests/             Verificações funcionais e de interface
docs/              Origem dos recursos, prompts e licenças
```

`npm run assets:prepare` regenera os recursos a partir das matrizes locais. A origem, os recortes e as licenças estão em [docs/recursos.md](docs/recursos.md). `.agents/`, `AGENTS.md` e as configurações de projeto orientam a manutenção.

## Limites

Projeto fictício, sem contato comercial ou backend. As imagens não documentam obras reais. A refração é bidimensional e dispõe de pôster, limite de resolução, pausa fora da tela e recuperação de contexto. Testes emulados e axe complementam a revisão; aparelhos físicos, Safari real, leitores de tela e desempenho térmico precisam de validação própria. A página mantém `noindex,nofollow` por ser demonstrativa.
