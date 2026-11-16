# Recursos da Lâmina

Todas as cenas são sintéticas, geradas com **image_gen integrado** para esta empresa fictícia. Não representam obras executadas, clientes ou locais de atendimento. Não foram copiados recursos de referências nem adquiridas fotografias de bancos pagos.

## Imagens

As sete matrizes utilizadas ficam em `src/assets/images/`. São fontes de edição e regeneração dos recursos públicos, não backups de versões anteriores. Os prompts e as datas de geração estão em [recursos-prompts.json](recursos-prompts.json).

| Matriz | Uso e origem |
| --- | --- |
| `superficie-horizontal.png` | Abertura e serviços; geração de 10/11/2026. |
| `superficie-vertical.png` | Reenquadramento da mesma cena para celular e tablet; 10/11/2026. |
| `luz-aberta.png` | Atmosfera de casa e piscina; 11/11/2026. |
| `jardim-adentro.png` | Atmosfera de jardim; 11/11/2026. |
| `depois-do-sol.png` | Atmosfera noturna; 11/11/2026. |
| `materia-e-agua.png` | Detalhe de materiais; 11/11/2026. |
| `patio-final.png` | Encerramento; geração de 09/11/2026. |

`npm run assets:prepare` produz os **19 WebPs** usados em `public/images/` e copia as duas fontes locais. O processamento usa sharp para recortar, redimensionar e codificar, sem retoque pictórico. A cena vertical tem enquadramento próprio; os três tamanhos horizontais da galeria e do encerramento atendem ao `srcset`. Materiais utiliza somente o recorte vertical.

Ao trocar as matrizes da abertura, revisar também `src/graphics/scene.ts`: dimensões, máscara de água e geometria da transição dependem dessas cenas.

## Fontes e bibliotecas

- **Syne** e **Instrument Sans:** WOFF2 variável, subconjunto latino com acentos; pacotes Fontsource Variable fixados no lockfile. Licenças OFL preservadas em [Syne](licencas/syne-OFL.txt) e [Instrument Sans](licencas/instrument-sans-OFL.txt). Origens: [Syne](https://github.com/google/fonts/tree/main/ofl/syne) e [Instrument Sans](https://github.com/google/fonts/tree/main/ofl/instrumentsans).
- **Astro:** MIT; licença distribuída no pacote instalado.
- **OGL:** Unlicense; declaração distribuída no pacote instalado.
- **GSAP:** licença própria Standard No Charge; utilizados core e ScrollTrigger. Termos distribuídos no pacote instalado.
- As ferramentas de desenvolvimento mantêm suas licenças nos respectivos pacotes. Nenhum código de referências visuais foi incorporado.

O site carrega imagens e fontes locais, sem depender de provedores externos durante a navegação.
