# Levantamento da #79 — o que o produto faz e a página não conta

Feito em 07/09/2026, sobre a landing **com a [#62](https://github.com/mateus-vitor-ferreira-dev/so-mais-um-landing/issues/62), a [#63](https://github.com/mateus-vitor-ferreira-dev/so-mais-um-landing/issues/63) e a [#64](https://github.com/mateus-vitor-ferreira-dev/so-mais-um-landing/issues/64) já dentro** — que é o que a #79 exige, para não medir o que já estava sendo consertado.

## Método

A queixa original era um julgamento — *"ela entrega bem menos do que o produto"* —, e julgamento não vira trabalho sozinho. O levantamento foi feito por **diferença**, contra três fontes, e não por leitura impressionista da página:

1. os **27 módulos de domínio** da api, pela tabela do `README.md` de lá;
2. as **rotas que a api publica em produção**, pelo `docs.json` de `api.so-mais-um.com` — 148 no dia da medição;
3. as **telas que o web serve em produção**, pela `origin/main` do `so-mais-um-web` — e não pela `develop`, que tem coisa que ainda não saiu.

A terceira fonte é a que salva o levantamento de virar promessa falsa. Rota viva na api **não** é funcionalidade entregue: se não há tela, o visitante não consegue fazer aquilo, e a landing diria uma inverdade — o erro da [#15](https://github.com/mateus-vitor-ferreira-dev/so-mais-um-landing/issues/15) e da [#64](https://github.com/mateus-vitor-ferreira-dev/so-mais-um-landing/issues/64), outra vez.

## O achado principal: a quadra se vende de três jeitos, e a página contava um

O README da api abre com isso, com todas as letras:

> **E a quadra se vende de três jeitos, não de um.** A **partida** é combinada e rateada. A **turma** é a regra semanal da escolinha: mesmo dia, mesmo horário. […] Os três dividem a mesma agenda de quadra.

A landing contava **a partida**. Sobre os outros dois, nada — e não é questão de ênfase. Busca por palavra nas dezessete seções, antes deste PR:

| Termo | Ocorrências na página |
|---|---:|
| `turma` | 1 — e é *"depende de você já ter uma turma"*, na `PertoSection`, no sentido de "galera" |
| `escolinha`, `aula`, `professor`, `mensalidade` | **0** |
| `day use`, `chamada` | **0** |

Do outro lado, o que a api publica **em produção** para esses dois formatos:

| Recurso | Rotas em produção |
|---|---:|
| turmas | 8 |
| day use | 6 |
| aulas | 4 |
| matrículas | 3 |
| mensalidades | 2 |
| membros do espaço (professor) | 2 |
| chamada | 1 |
| **total** | **26 de 148** |

**Um sexto da api em produção serve a dois formatos de venda que a página nunca mencionou.**

### O que dá para prometer hoje, e o que não dá

Aqui o levantamento se separa em duas metades, e a distinção é o que impede a #79 de repetir a #64.

**Dá para prometer ao dono, e entrou nesta leva.** As duas telas estão na `main` do web:

- `/owner/turmas` — cadastra quadra, modalidade, dia da semana, horário, duração, vagas, **valor da mensalidade** e o professor, que vem de `/owner/professores` (também na `main`);
- `/owner/day-uses` — e a lista de entradas de cada day use.

**Dá para prometer ao jogador, mas só o day use.** O `components/DayUsesDoDia` mostra os day uses acontecendo dentro do "Quero Jogar", e está na `main`. É o único dos dois formatos com as duas pontas vivas — por isso a linha nova da `OwnerSection` diz *"que o jogador encontra no Quero Jogar"*, e a da turma não diz nada equivalente.

**Não dá para prometer ao aluno, e ficou de fora de propósito.** Não existe área do aluno: `GET /me/turmas` e `GET /me/aulas` respondem em produção, e **nenhuma tela do web as consome**. O que existe fora do painel do dono é um bloco no perfil — `VinculosDeProfessor`, *"Você dá aula em: Arena Sul"* — e ele é para o **professor**, não para o aluno. Uma seção de escolinha voltada a quem faz aula prometeria uma tela que não existe.

Pelo mesmo motivo ficaram fora **chamada**, **matrícula** e **mensalidade** como afirmação: as rotas estão vivas, mas as telas correspondentes do web estão só na `develop`. Entram quando saírem.

## O segundo achado, menor: a rede social aparece só como cadeado

`follows` — seguir, e a amizade como follow mútuo — sustenta os requisitos de entrada, e é assim que a `AcessoSection` a apresenta: como **critério de quem pode entrar** numa partida. Mas ela também é funcionalidade de uso direto, com menu próprio no app (*Amigos*) e página pública de jogador (`/jogador/:userId`, web#375).

A página não diz que dá para seguir alguém, ver o perfil de um jogador ou ter uma lista de amigos. Diz só que a partida pode exigir isso de você.

Isto é **card**, não seção — e não entrou nesta leva porque a `FeaturesSection` já tem oito cards e o nono precisa de uma decisão de peso da página que a #79 não é dona. Fica registrado aqui e virou issue própria.

## O que este PR fez, e o que não fez

**Fez:** duas linhas novas na `OwnerSection` — turma e day use —, cada uma apontando em comentário para a tela de produção que a sustenta, como a regra da casa pede.

**Não fez, e por quê:**

- **Seção própria para escolinha e day use.** É trabalho de tamanho da #63 — seção inteira, com animação e prova visual —, e metade dela depende de telas que ainda não saíram. Issue própria.
- **Card da rede social na `FeaturesSection`.** Ver acima. Issue própria.
- **Área do aluno na página.** Não existe produto para prometer. Volta quando a tela existir.

## O que muda o resultado deste levantamento

Ele foi medido contra a `main` do web em 07/09/2026. **Toda leva que sobe telas de turma para produção reabre a pergunta** — chamada, matrícula e mensalidade já estão prontas na `develop`, e no dia em que forem ao ar a página passa a poder contar a escolinha inteira, inclusive para quem faz aula. Refazer a contagem de rotas do `docs.json` e a lista de `paginas.ts` da `main` é meia hora de trabalho, e é o que mantém isto honesto.
