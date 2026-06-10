# Receitas API

API REST do aplicativo **Seu Livro de Receitas**, desenvolvida para o processo seletivo da empresa A4PM. Mais informações podem ser encontradas em: [Especificação do Processo Seletivo A4PM](https://gitlab.devrgesus.com.br/codelabs/desafio_rg_receitas_culinarias).

É um backend em NestJS (TypeScript) usando Prisma sobre um banco MySQL-compatível, com a documentação dos endpoints exposta via Swagger/OpenAPI.

---

## Onde o projeto está hospedado

A ideia foi manter tudo rodando em infraestrutura **serverless e gratuita**, sem nenhum servidor sempre ligado para manter:

- **API - [Vercel](https://vercel.com/)**, no plano **Hobby (gratuito)**. Em vez de um processo Node escutando uma porta o tempo todo, a aplicação Nest é publicada como uma _serverless function_: a Vercel acorda a função quando chega uma requisição e a coloca para dormir quando não há tráfego, ela pode ser acessada pelo link: [https://psel-am4pm-backend.vercel.app/](https://psel-am4pm-backend.vercel.app/).
- **Banco - [TiDB Cloud](https://www.pingcap.com/tidb-cloud-serverless/)**, no **TiDB Serverless (free tier)**. O TiDB fala o protocolo do MySQL, então deu para manter o Prisma com `provider = "mysql"` sem adaptações no schema. A conexão é feita pelo **adapter MariaDB** ([`@prisma/adapter-mariadb`](https://www.prisma.io/docs/orm/overview/databases/mysql)), configurado em [`src/prisma/prisma.service.ts`](src/prisma/prisma.service.ts).

> ⚠️ O TiDB Serverless exige conexão **TLS/SSL**, então a `DATABASE_URL` de produção precisa apontar para o host do TiDB com os parâmetros de SSL que o provedor pede.

### Sobre o entrypoint na Vercel

O arquivo [`src/main.ts`](src/main.ts) foge da configuração "de fábrica" que o NestJS gera. No modelo padrão, o `main.ts` apenas cria o app e chama `app.listen()` - o que funciona localmente, mas gerou problemas na hora de hospedar na Vercel, justamente porque lá não existe uma porta para escutar: a plataforma espera um _handler_ no formato `(req, res)`.

Para resolver isso, o `main.ts` faz duas coisas:

- **Localmente** (quando a variável `VERCEL` não existe) ele continua subindo o servidor normal com `app.listen()`, como qualquer projeto Nest.
- **Na Vercel** ele exporta um `handler` que inicializa o app uma única vez e o mantém em cache entre as invocações, reaproveitando a mesma instância nas requisições seguintes para evitar pagar o custo de inicialização toda vez.

Ou seja: o mesmo código serve para desenvolvimento local e para o deploy serverless, sem precisar de dois builds diferentes.

---

## Pré-requisitos

- **Node.js** `>= 22`
- **Docker** + **Docker Compose** (para subir o MySQL local) - ou um banco MySQL/TiDB já disponível.

---

## 1. Instalar dependências

```sh
npm install
```

O `postinstall` roda `prisma generate` automaticamente, gerando o client em [`src/generated/prisma`](src/generated/prisma).

## 2. Configurar o `.env`

Copie o exemplo e preencha os valores:

```sh
cp .env.example .env
```

As variáveis usadas pela aplicação são:

- **`DATABASE_URL`** (obrigatória) - string de conexão MySQL/TiDB usada pelo Prisma.
- **`JWT_SECRET`** (obrigatória) - segredo usado para assinar e validar os tokens JWT.
- **`JWT_EXPIRES_IN`** (opcional) - tempo de expiração do token; o padrão é `1d`.
- **`API_KEY`** (opcional) - se definida, passa a exigir o header `x-api-key` nas rotas protegidas. Se ficar em branco, essa checagem é simplesmente ignorada.

As variáveis `MYSQL_*` que aparecem no `.env` **não** são lidas pela aplicação: elas existem só para o [`docker-compose.yml`](docker-compose.yml) provisionar o banco local.

```env
DATABASE_URL="mysql://receitas:receitas@localhost:3306/teste_receitas_rg_sistemas"
JWT_SECRET="troque-por-um-segredo-forte"
JWT_EXPIRES_IN="1d"
# API_KEY=apikey
```

---

## 3. Subir o banco de dados local

O [`docker-compose.yml`](docker-compose.yml) sobe um MySQL 8.4 já inicializado com o schema e as categorias padrão:

```sh
docker compose up -d
```

A inicialização usa o script [`docker/mysql/init/script.sql`](docker/mysql/init/script.sql), que cria as tabelas `usuarios`, `categorias` e `receitas` e popula as 13 categorias da especificação.

> O `script.sql` é exatamente o **script fornecido no desafio, seguido à risca**: nenhuma alteração foi feita nele. Em produção, esse mesmo script foi **executado manualmente no TiDB**, sem migrations do Prisma - o Prisma é usado apenas em modo "introspect"/client, refletindo a estrutura que o script já criou.

O script só roda na **primeira** criação do volume. Para reaplicá-lo do zero, remova o volume com `docker compose down -v` e suba de novo.

---

## Rodando em desenvolvimento

```sh
npm run start:dev
```

A API sobe em `http://localhost:8000`.

---

## Documentação da API (Swagger)

Com a aplicação rodando, a documentação interativa fica disponível em:

```
http://localhost:8000/docs
```

É de lá que dá para enxergar todas as rotas, conferir os formatos de request/response, autenticar (Bearer JWT e/ou `x-api-key`) e testar as chamadas direto pelo navegador. Em produção, a mesma página fica acessível em `/docs` sob o domínio da Vercel.

---

## Autenticação

A autenticação segue a implementação recomendada pela documentação oficial do NestJS com [Passport](https://docs.nestjs.com/security/authentication): uma local strategy para validar login e senha, uma JWT strategy para proteger as rotas, e os guards aplicados globalmente.

Na prática:

- O cadastro (`POST /usuarios`) e o login (`POST /auth/login`) são **públicos**, marcados com o decorator `@Public()`.
- Todas as demais rotas exigem um **token JWT** no header `Authorization: Bearer <token>`, obtido no login.
- Há ainda uma camada opcional de **API key** (`x-api-key`), que só entra em ação quando a variável `API_KEY` está configurada.

---

## Testes

```sh
npm run test        # testes unitários (Jest)
npm run test:watch  # modo watch
npm run test:cov    # com cobertura
npm run test:e2e    # testes end-to-end
```

---

## Arquitetura do projeto

Código-fonte em [`src/`](src/), organizado por domínio (seguindo o padrão de módulos do NestJS):

```
src/
├── auth/         # Autenticação: estratégias (JWT, local), guards globais, decorators
├── usuarios/     # Módulo de usuários (cadastro, CRUD)
├── categorias/   # Módulo de categorias (somente leitura)
├── receitas/     # Módulo de receitas (CRUD escopado ao usuário)
├── prisma/       # PrismaService (adapter MariaDB) + filtro de exceções do Prisma
├── generated/    # Prisma Client gerado (não versionado)
├── app.module.ts # Módulo raiz que agrega os demais
└── main.ts       # Bootstrap + Swagger + handler serverless da Vercel
```

### Modelo de dados

São três tabelas, espelhadas em [`prisma/schema.prisma`](prisma/schema.prisma) a partir do script do desafio:

- **`usuarios`** - credenciais (senha com hash `bcrypt`) e metadados.
- **`categorias`** - catálogo fixo de categorias culinárias.
- **`receitas`** - pertence a um usuário (`id_usuarios`) e, opcionalmente, a uma categoria (`id_categorias`).

### Principais decisões e bibliotecas

- **[NestJS 11](https://nestjs.com/)** - framework de back-end.
- **[Prisma 7](https://www.prisma.io/) + [adapter MariaDB](https://www.prisma.io/docs/orm/overview/databases/mysql)** - ORM e acesso ao banco MySQL/TiDB.
- **[Passport](https://www.passportjs.org/) + JWT** - autenticação via `passport-jwt` (Bearer) e `passport-local` (login), no formato recomendado pelo Nest.
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - hash de senhas.
- **[class-validator](https://github.com/typestack/class-validator) + [class-transformer](https://github.com/typestack/class-transformer)** - validação e transformação dos DTOs.
- **[@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)** - geração automática da documentação OpenAPI em `/docs`.
- **`PrismaExceptionFilter`** - filtro global que traduz erros do Prisma em respostas HTTP adequadas.
