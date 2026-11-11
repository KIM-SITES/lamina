# Origem das imagens — Etapa 3

Quatro cenas novas foram geradas com **image_gen integrado** em 11/11/2026 para este website demonstrativo. São imagens sintéticas com aparência fotográfica, identificadas na página. Não documentam construções ou serviços da Lâmina. Não foram copiados recursos de referências nem utilizados bancos de imagem pagos.

| Original local | Função |
| --- | --- |
| [luz-aberta.png](luz-aberta.png) | Galeria: piscina retangular, cerâmica clara, luz aberta e casa contemporânea. |
| [jardim-adentro.png](jardim-adentro.png) | Galeria: geometria curva, cerâmica verde, madeira e vegetação. |
| [depois-do-sol.png](depois-do-sol.png) | Galeria: piscina noturna, tijolo, luz submersa e reflexos. |
| [materia-e-agua.png](materia-e-agua.png) | Materiais: encontro entre borda de pedra, cerâmica e água. |

Prompts integrais: [prompts.json](prompts.json). Os originais estão preservados aqui; a execução não depende do diretório pessoal do agente.

O encerramento reutiliza a cena sintética de pátio, gerada para a Fase 1 e ainda não mostrada nesta nova página: `docs/fontes/originais/patio.png`. Sua origem e seu prompt estão em `docs/fontes/`. A abertura e os serviços usam as fontes aprovadas da Etapa 2.

O script `scripts/studies/etapa-3/prepare-assets.mjs` gera três larguras WebP e um recorte vertical próprio para cada imagem. [derivados.json](derivados.json) registra tamanho, bytes e coordenadas. O processamento apenas recorta, redimensiona e codifica; não inventa alterações pictóricas ou novas cenas.

Não se alega exclusividade, certificação técnica ou autenticidade documental das imagens sintéticas. A biblioteca é local, sem requisição a provedores de imagens durante a navegação. Fontes e bibliotecas mantêm as licenças documentadas em `docs/fontes/README.md`.
