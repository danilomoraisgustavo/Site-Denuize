-- CreateTable
CREATE TABLE "DadosPessoais" (
    "id" SERIAL NOT NULL,
    "primeiro_nome" VARCHAR(50) NOT NULL,
    "sobrenome" VARCHAR(50) NOT NULL,
    "data_nascimento" DATE NOT NULL,
    "cpf" VARCHAR(15) NOT NULL,
    "nome_responsavel" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "whatsapp" VARCHAR(15) NOT NULL,
    "genero" VARCHAR(20) NOT NULL,
    "logradouro" VARCHAR(100) NOT NULL,
    "numero" INTEGER NOT NULL,
    "bairro" VARCHAR(50) NOT NULL,
    "complemento" VARCHAR(50),
    "cidade" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "cep" VARCHAR(10) NOT NULL,

    CONSTRAINT "DadosPessoais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalhesCurso" (
    "id" SERIAL NOT NULL,
    "id_dados_pessoais" INTEGER NOT NULL,
    "curso_escolhido" VARCHAR(50) NOT NULL,
    "experiencia_danca" TEXT,
    "objetivos" TEXT,
    "preferencias_aula" VARCHAR(100) NOT NULL,
    "informacoes_medicas" TEXT,
    "numero_matricula" VARCHAR(6) NOT NULL,

    CONSTRAINT "DetalhesCurso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DetalhesCurso" ADD CONSTRAINT "DetalhesCurso_id_dados_pessoais_fkey" FOREIGN KEY ("id_dados_pessoais") REFERENCES "DadosPessoais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
