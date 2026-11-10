# Recursos visuais e tipográficos

## Imagens

As duas cenas foram geradas originalmente para este protótipo usando a ferramenta **image_gen integrada**, em 9 de novembro de 2026, com autorização do proprietário. São imagens sintéticas com aparência fotográfica, não fotografias de obras reais da Lâmina. Não foram adquiridos ou copiados recursos de bancos pagos ou das referências do Landing Love.

| Cena | Original preservado | Uso |
| --- | --- | --- |
| Piscina junto ao jardim | [superficie.png](originais/superficie.png) | Hero, primeiro ambiente, recorte vertical e detalhe de água |
| Piscina no pátio | [patio.png](originais/patio.png) | Segundo ambiente ilustrativo |

Os [prompts completos](prompts.json) documentam as duas gerações. As transformações posteriores são redimensionamento, recorte e codificação WebP pelo sharp; não foi alterada a cena por código. O script `scripts/prepare-assets.mjs` usa os originais deste diretório, sem depender do diretório pessoal do agente.

Derivados locais: `public/images/superficie-{640,960,1440,1920}.webp`, `superficie-vertical.webp`, `agua-detalhe.webp` e `patio-{640,960,1440,1920}.webp`. Não há requisições a serviços externos para exibi-los.

## Fontes

Arquivos WOFF2 locais, subconjunto latino com acentos do português. Distribuídos pelos pacotes Fontsource Variable 5.3.0, instalados com versões fixadas.

- **Syne:** [origem](https://github.com/google/fonts/tree/main/ofl/syne), [licença OFL local](syne-OFL.txt).
- **Instrument Sans:** [origem](https://github.com/google/fonts/tree/main/ofl/instrumentsans), [licença OFL local](instrument-sans-OFL.txt).

## Bibliotecas

- Astro: MIT, licença no pacote instalado e [repositório oficial](https://github.com/withastro/astro/blob/main/LICENSE).
- OGL: Unlicense, declaração no [repositório oficial](https://github.com/oframe/ogl). Não foi classificado como MIT.
- GSAP: licença própria Standard No Charge; termos em https://gsap.com/community/standard-license/. Usados somente core e ScrollTrigger.
- Nenhum código das referências foi incorporado.
