drop schema if exists picpay cascade;

create schema picpay;

create table picpay.transaction (
    transaction_id uuid primary key,
    payer_id uuid not null,
    payee_id uuid not null,
    amount numeric not null,
    type text not null,
    status text not null,
    occured_at timestamp
);