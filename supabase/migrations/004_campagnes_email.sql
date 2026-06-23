-- ============================================================
-- Force 7 Plateforme — Migration 004 : Campagnes d'emailing
-- Tables : campagnes_email, campagnes_email_criteres
-- ============================================================

create table campagnes_email (
  id          uuid        primary key default gen_random_uuid(),
  nom         text        not null,
  objet       text        not null default '',
  corps       text        not null default '',
  actif       boolean     not null default false,
  mode_envoi  text        not null default 'maintenant', -- 'maintenant' | 'programme'
  envoyer_le  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Critères de ciblage (logique ET entre eux)
-- cle : 'statut' | 'type_formation' | 'formation_id'
create table campagnes_email_criteres (
  id          uuid        primary key default gen_random_uuid(),
  campagne_id uuid        not null references campagnes_email(id) on delete cascade,
  cle         text        not null,
  valeur      text        not null,
  created_at  timestamptz not null default now()
);

create index on campagnes_email_criteres(campagne_id);

create trigger campagnes_email_updated_at
  before update on campagnes_email
  for each row execute function update_updated_at();

alter table campagnes_email          enable row level security;
alter table campagnes_email_criteres enable row level security;

create policy "admins_full_access" on campagnes_email
  for all using (exists (select 1 from user_profiles where id = auth.uid() and role = 'admin'));

create policy "admins_full_access" on campagnes_email_criteres
  for all using (exists (select 1 from user_profiles where id = auth.uid() and role = 'admin'));

-- Retourne dynamiquement toutes les valeurs du type enum statut_dossier.
-- Tout nouveau statut ajouté à l'enum apparaît automatiquement dans l'UI.
create or replace function get_statut_dossier_values()
returns table(valeur text)
language sql security definer as $$
  select e.enumlabel::text
  from   pg_enum e
  join   pg_type t on e.enumtypid = t.oid
  where  t.typname = 'statut_dossier'
  order  by e.enumsortorder;
$$;
