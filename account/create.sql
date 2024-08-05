create schema picpay;

create table picpay.account (
    account_id uuid primary key,
    name text not null,
    email text not null,
    password text not null,
    document text not null,
    balance numeric not null
);