const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do banco de dados
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // Porta padrão do PostgreSQL é 5432
    ssl: {
        rejectUnauthorized: false // Isso pode ser necessário dependendo da configuração do seu provedor de banco de dados
    }
});

client.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err.stack);
    } else {
        console.log('Conexão com o banco de dados estabelecida');
    }
});

// Configuração para servir arquivos estáticos na pasta 'public' de MainPage
app.use(express.static(path.join(__dirname, 'public')));

const routes = {
    '/': 'index.html',
    '/index.html': 'index.html',
    '/about.html': 'about.html',
    '/courses.html': 'courses.html',
    '/trainers.html': 'trainers.html',
    '/events.html': 'events.html',
    '/contact.html': 'contact.html',
    '/login.html': 'login.html',
    '/course-details-baby.html': 'course-details-baby.html',
    '/course-details-infatil.html': 'course-details-infatil.html',
    '/course-details-infantoJuvenil.html': 'course-details-infantoJuvenil.html',
    '/course-details-juvenil.html': 'course-details-juvenil.html',
    '/course-details-adulto.html': 'course-details-adulto.html',
    '/course-details-salao.html': 'course-details-salao.html',
    '/matricula.html': 'matricula.html'
};

// Criar rotas dinamicamente com base no mapeamento
Object.keys(routes).forEach(route => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', routes[route]));
    });
});

// Funções auxiliares
function gerarNumeroMatricula() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function verificarNumeroMatriculaUnico(client, numeroMatricula) {
    const resultado = await client.query('SELECT COUNT(*) FROM detalhes_curso WHERE numero_matricula = $1', [numeroMatricula]);
    return resultado.rows[0].count === '0';
}

async function verificarCPFEmailUnicos(client, cpf, email) {
    const resultadoCPF = await client.query('SELECT COUNT(*) FROM dados_pessoais WHERE cpf = $1', [cpf]);
    const resultadoEmail = await client.query('SELECT COUNT(*) FROM dados_pessoais WHERE email = $1', [email]);
    return resultadoCPF.rows[0].count === '0' && resultadoEmail.rows[0].count === '0';
}

// Rota para processar o formulário de matrícula
app.post('/processar-matricula', async (req, res) => {
    const {
        primeiro_nome,
        sobrenome,
        data_nascimento,
        cpf,
        nome_responsavel,
        email,
        whatsapp,
        genero,
        logradouro,
        numero,
        bairro,
        complemento,
        cidade,
        estado,
        cep,
        curso_escolhido,
        experiencia_danca,
        objetivos,
        preferencias_aula,
        informacoes_medicas
    } = req.body;

    try {
        // Verificar se CPF e email já estão cadastrados
        const cpfEmailUnicos = await verificarCPFEmailUnicos(client, cpf, email);
        if (!cpfEmailUnicos) {
            throw new Error('CPF ou email já cadastrado.');
        }

        // Inserir dados pessoais
        const queryDadosPessoais = `
            INSERT INTO dados_pessoais 
            (primeiro_nome, sobrenome, data_nascimento, cpf, nome_responsavel, email, whatsapp, genero, logradouro, numero, bairro, complemento, cidade, estado, cep)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING id;`;
        
        const valuesDadosPessoais = [
            primeiro_nome,
            sobrenome,
            data_nascimento,
            cpf,
            nome_responsavel,
            email,
            whatsapp,
            genero,
            logradouro,
            numero,
            bairro,
            complemento,
            cidade,
            estado,
            cep
        ];

        const resultDadosPessoais = await client.query(queryDadosPessoais, valuesDadosPessoais);
        const idDadosPessoais = resultDadosPessoais.rows[0].id;

        // Gerar número de matrícula único
        let numeroMatricula;
        let unico = false;
        while (!unico) {
            numeroMatricula = gerarNumeroMatricula();
            unico = await verificarNumeroMatriculaUnico(client, numeroMatricula);
        }

        // Inserir detalhes do curso com número de matrícula
        const queryDetalhesCurso = `
            INSERT INTO detalhes_curso 
            (id_dados_pessoais, curso_escolhido, experiencia_danca, objetivos, preferencias_aula, informacoes_medicas, numero_matricula)
            VALUES ($1, $2, $3, $4, $5, $6, $7);`;

        const valuesDetalhesCurso = [
            idDadosPessoais,
            curso_escolhido,
            experiencia_danca,
            objetivos,
            preferencias_aula,
            informacoes_medicas,
            numeroMatricula
        ];

        await client.query(queryDetalhesCurso, valuesDetalhesCurso);

        // Matrícula processada com sucesso
        res.redirect('/matricula.html?cadastro=sucesso');
    } catch (error) {
        console.error(error);
        // Erro ao processar matrícula
        let erroMsg = encodeURIComponent('Erro desconhecido ao processar matrícula.');
        if (error.message === 'CPF ou email já cadastrado.') {
            erroMsg = encodeURIComponent('CPF ou email já cadastrado.');
        }
        res.redirect(`/matricula.html?cadastro=erro&erroMsg=${erroMsg}`);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});