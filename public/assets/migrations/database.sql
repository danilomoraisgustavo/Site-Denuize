CREATE DATABASE IF NOT EXISTS escola_denuize;
USE escola_denuize;


CREATE TABLE IF NOT EXISTS public.dados_pessoais
(
    id integer NOT NULL DEFAULT nextval('dados_pessoais_id_seq'::regclass),
    primeiro_nome character varying(50) COLLATE pg_catalog."default" NOT NULL,
    sobrenome character varying(50) COLLATE pg_catalog."default" NOT NULL,
    data_nascimento date NOT NULL,
    cpf character varying(15) COLLATE pg_catalog."default" NOT NULL,
    nome_responsavel character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    whatsapp character varying(15) COLLATE pg_catalog."default" NOT NULL,
    genero character varying(20) COLLATE pg_catalog."default" NOT NULL,
    logradouro character varying(100) COLLATE pg_catalog."default" NOT NULL,
    numero integer NOT NULL,
    bairro character varying(50) COLLATE pg_catalog."default" NOT NULL,
    complemento character varying(50) COLLATE pg_catalog."default",
    cidade character varying(50) COLLATE pg_catalog."default" NOT NULL,
    estado character varying(50) COLLATE pg_catalog."default" NOT NULL,
    cep character varying(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT dados_pessoais_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.dados_pessoais
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.detalhes_curso
(
    id integer NOT NULL DEFAULT nextval('detalhes_curso_id_seq'::regclass),
    id_dados_pessoais integer,
    curso_escolhido character varying(50) COLLATE pg_catalog."default" NOT NULL,
    experiencia_danca text COLLATE pg_catalog."default",
    objetivos text COLLATE pg_catalog."default",
    preferencias_aula character varying(100) COLLATE pg_catalog."default",
    informacoes_medicas text COLLATE pg_catalog."default",
    numero_matricula character varying(6) COLLATE pg_catalog."default",
    CONSTRAINT detalhes_curso_pkey PRIMARY KEY (id),
    CONSTRAINT detalhes_curso_id_dados_pessoais_fkey FOREIGN KEY (id_dados_pessoais)
        REFERENCES public.dados_pessoais (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.detalhes_curso
    OWNER to postgres;