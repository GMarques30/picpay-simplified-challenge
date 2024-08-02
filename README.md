<p align="center" width="100%">
    <img width="30%" src="resources\picpay-logo.jpg"> 
</p>

<h3 align="center">
  Desafio Backend do PicPay
</h3>

<p align="center">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-%2304D361">
  <img alt="Language: Node" src="https://img.shields.io/badge/language-node-green">
  <img alt="Language: Typescript" src="https://img.shields.io/badge/language-typescript-blue">
  <img alt="Version: 1.0" src="https://img.shields.io/badge/version-1.0-yellowgreen">
</p>

Essa é a minha proposta de solução para o desafio da entrevista para vaga de desenvolvedor do Picpay.

O desafio pode ser encontrado [neste link](https://github.com/PicPay/picpay-desafio-backend/tree/main).

### Usuários

- Existem dois tipos de usuários: comuns e lojistas.
- Usuário deve ter o seguites campos **nome completo**, **CPF** ou **CNPJ**, **email**, **senha** para ambos tipos de usuários.
- Os campos **CPF/CNPJ** e **email** devem ser únicos.

### Transferência de dinheiro

- Usuários do tipo comum podem enviar dinheiro para outros usuários comouns e lojistas.
- Lojistas apenas recebem transferências e não podem enviar dinheiro.
- É necessário validar o saldo do usuário antes da transferência.

### Transações

- As transferências devem ser tratadas como transações, revertendo-as em qualquer caso de inconsistência.

### Serviço autorizador

- Consultar um mock de serviço autorizador externo antes de finalizar uma transferência `GET` [https://util.devi.tools/api/v2/authorize](https://util.devi.tools/api/v2/authorize).

### Serviço de envio de notificação

- Usar um mock de serviço de notificação externo para simular o envio de notificações para o usuário ou lojista `POST` [https://util.devi.tools/api/v1/notify](https://util.devi.tools/api/v1/notify).

### RESTFul

- Aplicação RESTFul.

## Solução

Foi escolhido a utilização de Nodejs juntamente com Typescript para o desenvolvimento do desafio.

A aplicação conta com a utilização dos seguintes conceitos:

- Arquitetura Limpa
- Arquitetura Hexagonal
- Arquitetura Orientada a Eventos
- Microserviços
- Domain Driven Design
- SOLID
- Design Patterns
- Gateway Pattern
- Retry Pattern

## Tecnologias

- Nodejs
- Typescript
- PostgreSQL
- Jest
- RabbitMQ
- Docker

## Arquitetura

A partir desse diagrama de classe, é possível entender melhor sobre a estrutura da aplicação.

![Diagrama de classe](resources/diagrama-de-classe.png)

## Como executar

1. Clone o repositório do git:

```text
git clone https://github.com/GMarques30/picpay-simplified-challenge.git
```

2. Instale as dependências:

```text
yarn install
```

3. Execute a aplicação:

```text
docker-compose up -d
```

## Endpoints

#### Para fazer um depósito

```typescript
POST localhost:3000/deposit
{
    "accountId": 1,
    "value": 100
}
```

#### Para fazer um saque

```typescript
POST localhost:3000/withdraw
{
    "accountId": 1,
    "value": 100
}
```

#### Para criar nova transferência

```typescript
POST localhost:3000/transfer
{
    "payerId": 1,
    "payeeId": 2,
    "value": 100
}
```

#### Para visualizar uma conta

```typescript
GET localhost:3000/accounts/1
```
