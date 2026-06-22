-- Migration 003 : ajout colonne delai_unite sur relances
alter table relances add column delai_unite text not null default 'jours'
  check (delai_unite in ('jours', 'heures'));
