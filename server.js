import express from 'express'; // Importar a biblioteca Express
import { PrismaClient } from '@prisma/client' // Importar a biblioteca Prisma
import cors from 'cors'; // Importar a biblioteca
const prisma = new PrismaClient() // Instanciar a biblioteca Prisma

const app = express() // Variável app recebe o Express
app.use(express.json()); // Para trabalhar com JSON
app.use(cors({
    origin: 'http://localhost:5173/'
})); // Para habilitar CORS (Qualquer página pode acessar o backend)

// Rota de Teste
app.get('/', async (req, res) => {
    let users = [];
    users = await prisma.user.findMany();
    res.send('API funcionando corretamente!')
})

// Rota POST (Criar)
app.post('/usuarios', async (req, res) => {
    // Criar usuário e inserir na base de dados
    await prisma.user.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
        }
    })

    res.status(201).json(req.body)
})

// Rota GET (Ler)
app.get('/usuarios', async (req, res) => {
    let users = []

    // Verificar se algum dos parâmetros foi passado
    if (req.query.name || req.query.email || req.query.age) {
        users = await prisma.user.findMany({
            where: {
                name: req.query.name || undefined,  // Somente filtra se name for passado
                email: req.query.email || undefined, // Somente filtra se email for passado
                age: req.query.age || undefined      // Filtra a idade como string
            }
        })
    } else {
        // Se não houver parâmetros, buscar todos os usuários
        users = await prisma.user.findMany()
    }

    // Enviar a resposta com a lista de usuários
    res.status(200).json(users)
})


// Rota PUT (Editar)
app.put('/usuarios/:id', async (req, res) => {
    console.log(req)
    
    // Atualizar o usuario
    await prisma.user.update({
        // Buscar pelo usuário
        where: {
            id: req.params.id,
        },
        data: {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
        }
    })

    res.status(201).json(req.body)
})

// Rota DELETE (Deletar)
app.delete('/usuarios/:id', async(req, res) => {
    // Deletar o usuario
    await prisma.user.delete({
        // Buscar pelo usuário
        where: {
            id: req.params.id,
        }
    })

    res.status(204).send('Usuário deletado com sucesso!') // Resposta | O status(204) indica que a requesição deu certo, é opcional.
})

// Iniciar o server
app.listen(4000)