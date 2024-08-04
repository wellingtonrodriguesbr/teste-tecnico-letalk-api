![Cover](./.github/cover.png)

# Teste técnico Letalk

O teste consiste em criar uma Web Application para simulação de empréstimo para pessoa física.

## Requisitos

- Node.js;
- Pnpm

## Tecnologias

- TypeScript;
- Node.js;
- Fastify;
- Prisma;
- SQLite;
- Zod;
- Dayjs;

## Steps

- Clone o repositório;
- Instale as dependências (`pnpm install`);
- Crie as tabelas no banco de dados (`pnpm prisma migrate dev`);
- Copie e cole `.env.example` file (`cp .env.example .env`);
- Rode a aplicação (`pnpm run dev`);

<br/>
<br/>

# RFs (Requisitos funcionais)

- [x] Deve ser possível simular um empréstimo;
- [x] Deve ser possível realizar a projeção de parcelas de um empréstimo;
- [x] Deve ser possível efetivar um empréstimo;
- [x] Deve ser possível buscar todos os empréstimos efetivados;

<br/>

# RNs (Regras de negócio)

- [x] Não deve ser possível simular um empréstimo com valor abaixo de R$ 50.000,00;
- [x] Não deve ser possível escolher o valor da parcela desejada com um valor abaixo de 1% do valor do empréstimo;

<br/>

# RNFs (Requisitos não-funcionais)

- [x] Os dados da aplicação precisam estar persistidos de alguma forma (JSON ou Banco de dados);

</br>

---

<p align="center">Desenvolvido por <a href="https://www.linkedin.com/in/wellingtonrodriguesbr/" target="_blank">Wellington Rodrigues</a> ✌🏽</p>
