# Etapa 4 — diagnóstico antes da implementação

Inspeção de 11/11/2026 na rota `/estudos/etapa-3/`, executada no Chromium real local com mouse, teclado, emulação de toque, formulários e imagens carregadas. A interface foi percorrida seção por seção; capturas de limites estão em `antes/`, medições e interações em `diagnostico-navegador.json`. Capturas integrais anteriores não foram usadas como prova de funcionamento.

## Problemas observados e intervenção delimitada

| ID | Observação concreta | Intervenção justificada |
| --- | --- | --- |
| R1 | Serviços ocupam 1.333px em desktop; renovação e manutenção ficam afastadas, e a manutenção começa 95px abaixo. A oferta parece menos presente que a galeria seguinte. | Reduzir os intervalos internos e o deslocamento da manutenção; aumentar discretamente a leitura comercial. Preservar Margem aberta, fotografia livre, títulos e destino da passagem. |
| R2 | Em 390px, serviços → galeria acumula saída clara e uma introdução longa; a galeria inteira ocupa 1.405px. | Aproximar os limites, compactar a introdução e reduzir moderadamente a altura da foto mobile. Manter as três atmosferas, a margem cromática e os controles. |
| R3 | O detalhe de materiais tem 800px de altura em tablet. O amarelo reaparece em torno da imagem, ocupa 944px e prolonga o intervalo até o processo. | Aproximar o detalhe das bordas superior/direita da seção e conter a altura no tablet. Em mobile, mostrar um recorte mais próximo e horizontal; manter o solar e controles amplos. |
| R4 | Processo: 1.051px desktop, 1.101px tablet e 1.379px mobile; corpo de 15px em uma coluna à direita. A grande manchete disputa espaço com uma linha numerada de textos pequenos. | Dar ao título uma abertura horizontal e distribuir os quatro momentos pela largura. Manter a sequência, com verbos maiores, corpo de 16–17px e menos fragmentação. Sem cards ou animações de revelação. |
| R5 | A transição materiais → processo acumula aproximadamente 215px de respiro em desktop, junto a uma mudança de fundo forte. | Compartilhar um ritmo de espaçamento entre as seções; deixar o contraste de cor e a aproximação fotográfica conduzir a passagem, sem efeito adicional. |
| R6 | Orçamento termina em azul e o encerramento repete imediatamente uma ação de simulação. O título final força quatro linhas com “ideia.” isolada; a foto final repete outra altura vertical de 457px no celular. | Ajustar a densidade do formulário, equilibrar o título final sem mudar seu texto e reduzir a proporção da foto de encerramento mobile. Manter a função da conclusão e o convite ao orçamento. |
| M1 | A troca da galeria mistura duas opacidades e desloca o painel completo em 18px, incluindo tipografia e margem. Isso faz o texto competir com a mudança de fotografia. | Conter a transição na fotografia e manter a margem legível imediatamente. Crossfade mais breve, sem zoom, blur ou deformação. Teclado continua imediato. |
| T1 | Com a imagem Jardim retida pela rede, após 250ms `aria-busy=true`, o status está vazio e a seleção continua em Luz sem retorno visível. | Exibir uma mensagem estática de carregamento apenas quando a espera é perceptível; manter a cena atual até a próxima estar decodificada. Testar também falha de imagem e seleção interrompida. |

## Escala do percurso atual

| Viewport | Página | Galeria | Materiais | Processo | Orçamento | Encerramento |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1440 × 900 | 7.612px | 1.224px | 1.035px | 1.051px | 714px | 1.355px |
| 820 × 1180 | 7.181px | 1.027px | 944px | 1.101px | 715px | 1.106px |
| 390 × 844 | 8.792px | 1.405px | 1.277px | 1.379px | 947px | 1.321px |
| 320 × 700 | 8.419px | 1.332px | 1.242px | 1.465px | 947px | 1.193px |

Medidas obtidas no fluxo normal com movimento ativo e primeira atmosfera. O crescimento causado pela abertura deliberada de disclosures ou pelo resumo é uma interação esperada e será avaliado separadamente.

## O que já funciona e será preservado

Hero, máscara da água, arquitetura estável, ausência de influência do ponteiro, passagem reversível, fontes, paleta, categorias comerciais, simulação local, três atmosferas, navegação por controles e teclado, redução de movimento e alternativas sem WebGL/JavaScript.

No diagnóstico, seleção da galeria, abertura nativa de material e resumo de manutenção para residência funcionaram nos quatro formatos. Não há motivo para trocar a arquitetura, gerar novas fotografias, instalar dependências ou reconstruir a abertura.

## Plano do refinamento

Website demonstrativo de serviços, com fotografia sintética identificada. Paleta mantida: profundo `#083C63`, água `#16C7AD`, solar `#F6D567`, mineral `#E9F9E7`, azul `#1658BA`. Syne e Instrument Sans mantidas. As bordas de conteúdo continuam seguindo o mesmo gutter.

Rota nova `/estudos/etapa-4/`, sem alterar Etapa 3, página principal, AGENTS ou Skills. Componentes e lógica bem resolvidos serão importados; cópias específicas serão usadas apenas onde a estrutura ou a interação exigir mudança. A fotografia será reaproveitada sem duplicar recursos. Os arquivos já staged antes desta tarefa serão preservados byte a byte e o índice Git não será alterado.

Perspectiva de movimento: acabamento de Jakub como prioridade, contenção de Emil nos controles, exploração apenas na assinatura óptica já existente. O briefing já determina o contexto e autoriza o refinamento; não é necessário reabrir uma escolha de direção artística. Nenhuma ausência de animação nativa em formulário ou disclosure será tratada automaticamente como defeito.

Comparar a versão anterior e a refinada em viewport idêntico; testar diretamente as interações, nove larguras obrigatórias e 1280px adicional, zoom, rotação, movimento reduzido, WebGL indisponível/perda de contexto e conteúdo sem JS. Capturas, gravações, resultados e limitações acompanharão a entrega.
