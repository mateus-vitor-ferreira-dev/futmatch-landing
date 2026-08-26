<!-- Título no padrão Conventional Commits em pt-BR: feat: adiciona filtro por modalidade -->

## O que muda

<!-- Uma ou duas frases. O que este PR faz do ponto de vista de quem usa. -->

Closes #

## Por quê

<!-- O problema que isso resolve. Se a issue já explica, escreva "ver issue". -->

## Como testar

<!-- Passo a passo para quem revisa reproduzir. Inclua usuário de teste, rota ou tela. -->

1.
2.

## Checklist

- [ ] CI verde — lint, typecheck, build e testes
- [ ] Teste automatizado cobrindo o comportamento novo (ou justificativa abaixo)
- [ ] **Afirmação nova sobre o produto aponta para o arquivo que a sustenta** — ver abaixo
- [ ] Rota nova ou alterada documentada no Swagger (só API)
- [ ] Validado no preview
- [ ] Documentação atualizada, se o comportamento mudou

<!-- Sem teste? Explique aqui o porquê. -->

## O que a landing afirma sobre o produto

<!--
Preencha só se este PR acrescenta ou muda alguma afirmação sobre o que o Só+1
faz. Uma linha por afirmação, com o arquivo da api ou do web que a sustenta:

  "sorteio equilibrado por nível" → so-mais-um-api/src/modules/draw/draw.service.ts

**Por que este item existe.** A landing#47 corrigiu quatro afirmações falsas de
uma vez — entre elas "painel com métricas de ocupação e receita", que é a
promessa mais cara da página, feita para quem vai pagar assinatura. O painel
devolve `totalPlaces`, `totalCourts`, `activeEvents` e `pendingRequests`.
Nenhuma veio de má-fé: vieram de escrever a copy sem abrir o código.

O `npm run contrato:check` já trava o que é enumerável — as 12 modalidades e as
6 tags, contra `GET /sports` e `GET /review-tags`. Ele não alcança frase em
prosa, e é essa metade que este item cobre. Ver landing#49.

Se o PR não muda afirmação nenhuma, escreva "nenhuma" e siga.
-->
