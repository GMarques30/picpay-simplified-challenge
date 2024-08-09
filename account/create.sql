drop schema if exists picpay cascade;

create schema picpay;

create table picpay.account (
    account_id uuid primary key,
    name text not null,
    email text not null unique,
    password text not null,
    document text not null unique,
    balance numeric not null
);