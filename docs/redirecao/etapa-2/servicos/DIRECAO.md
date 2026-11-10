# Serviços — decisão antes da implementação

Empresa demonstrativa de projeto, construção, renovação e cuidado de piscinas. Ação principal: pré-selecionar um serviço na simulação existente. Contexto e identidade já autorizados; esta revisão permanece na Etapa 2.

## Diagnóstico no navegador

O turquesa ocupa toda a seção e se torna mais presente que a arquitetura. Título, introdução, três descrições e três ações concorrem na mesma coluna. A fotografia alta à esquerda tem um limite muito autônomo em relação à tipografia. Capturas anteriores, estados intermediários e fontes preservados em `anterior/`, antes de modificar o protótipo.

## Três estudos renderizados

Ver `alternativas/comparacao-desktop.png` e `alternativas/comparacao-mobile.png`. As três opções possuem HTML independente, as matrizes fotográficas sintéticas existentes e capturas do navegador. São estudos estáticos, não alternativas completas de animação.

| Estudo | Construção | Vantagem | Problema / decisão |
| --- | --- | --- | --- |
| A — Coluna de água | Vertical alta, fundo claro, serviços em coluna lateral | Perspectiva e degraus muito legíveis | Mantém a estrutura de fotografia ao lado dos textos; a primeira composição mobile coloca a imagem tarde demais. Não selecionado. |
| B — Horizonte contínuo | Panorama em largura ampla, título sobre a linha superior do enquadramento, faixa turquesa curta | Arquitetura reconhecível, fotografia participa da largura e do ritmo da seção; permite separar título e serviços | Exige refinar a borda entre texto e foto para garantir contraste; melhor base para implementação. |
| C — A margem | Foto deslocada à direita, margem profunda com título sobreposto | Assimetria expressiva e profundidade | Grande intervalo até os serviços no celular; texto e foto voltam a se comportar como duas áreas separadas. Não selecionado. |

## Direção escolhida: Horizonte contínuo

Refinar B. Manter as cinco cores aprovadas. Azul luminoso no plano tipográfico de chegada, amarelo no título editorial; fotografia panorâmica atravessando a largura; turquesa restrito a uma faixa de ligação e feedback funcional; plano claro mineral para a leitura comercial. Azul profundo permanece na tipografia e na estrutura. Não há novo tom bege ou perda de personalidade cromática.

Syne mantém a voz expressiva dos títulos; Instrument Sans sustenta descrições e ações. Três serviços explícitos, com descrições menores e espaço entre títulos e detalhes. Linhas editoriais amplas, sem três cards, numeração fictícia ou métricas inventadas.

```text
desktop                           mobile
Da paisagem                       Da paisagem
                 ao detalhe.           ao detalhe.
fotografia panorâmica             fotografia vertical
atravessando a composição         com margem assimétrica
faixa turquesa de ligação          frase em campo turquesa
Projeto             descrição     Projeto
                    ação          descrição + ação
    Revitalização   descrição        Revitalização
                    ação             descrição + ação
        Manutenção  descrição     Manutenção
                    ação          descrição + ação
```

No mobile, a imagem retorna a uma proporção vertical própria e sangra pela direita; as ações ocupam a largura disponível, e a progressão dos serviços recebe recuos curtos, sem colunas comprimidas. Tablet preserva a vista arquitetônica adequada à orientação.

## Integração necessária

Alterar o destino para fontes integrais já existentes, em vez de ampliar o recorte vertical antigo. A janela final da cena passa a corresponder à fonte completa e ao `cover` do novo quadro; a máscara aquática continua nas mesmas coordenadas da fotografia. A moldura permanece retangular por respeitar o eixo arquitetônico. A relação com título, sangria e plano cromático dá forma ao enquadramento, sem recorte orgânico arbitrário.

O motion será ajustado somente para alinhar o novo destino e a cor. Critério principal de acabamento: Jakub; exploração espacial secundária: Jhey. Ações por teclado são imediatas, o scroll é nativo e a preferência de movimento reduzido continua obrigatória. Nenhum comportamento depende da posição do mouse ou do dedo.

Avaliar depois de implementar: a ordem título/foto deve permanecer legível nos estados intermediários; o destino não pode pular, alongar a piscina nem divergir do pôster HTML. Validar novamente os três serviços e a simulação.
