import 'dotenv/config'
import express from 'express';
import mysql from 'mysql2/promise';
import  swaggerUi from 'swagger-ui-express'
import swaggerDocument from './doc/swagger-output.json' with {type: 'json'}
//estamos importando as dependencias 

const app = express();

app.use('/docs' , swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json());

const port = 3000;


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    //AQUI NOS CRIAMOS OUTRA PASTA DO ENV E COLCOAMOS UMA BIBLOTECA
    //  DESSA E NO POOL EU COLOCO ESSA SINTAXE QUE LIGA COM O OUTRO ARQUIVO
    user: process.env.DB_USER,
    password: process.env.DB_PASSOWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    //aqui é basocamente oque liga agente com  api e banco de dados funciona como um tubo de ligaçao
})

app.get('/users', async (req , res) => {
    //async é ua funcao 
    try{
        const rows = await pool.query('SELECT * FROM user;');
        res.status(200).json(rows[0])
    }

    catch(error){
        console.error(error)
        res.status(500).json({msg: 'Erro ao listar usuarios'})
    }

}) 

app.post('/users', async (req , res) => {
    
    try{
        const nome = req.body.nome
        //estamos requirindo todos no body
        const email = req.body.email

        const cpf = req.body.cpf
        const apelido = req.body.apelido ?? null
        //apelido pode ser nulo esta é uma abreviaçao do ternario
        

        const  result = await pool.query(
            'INSERT INTO user (nome, email, cpf, apelido) VALUES (?,?,?,?);',
            //aqui o codigo do mySQL

            [nome , email , cpf , apelido]
            //aqui fica os parametros na mesma ordem de cima 
        );
            
        res.status(200).json({msg: "Usuario criado com sucesso"})

    } catch(error){
            console.error(error)
            res.status(401).json({msg: "Erro ao criar usuario"})
        }    
})

app.delete('/users/:id', async (req , res) => {
    try{
        //acima  é definida a rota
        const id = req.params.id
        //nso vamos pedir para que o usuario envie a resp por parametros de id no requerimento 
        const rows = await pool.query('DELETE FROM user WHERE id = ?;', //interrogaçao é os parametros que sao injetados 
            [id] // aqui é oque recebe todos parametros quem forem passados com interrogaçao
        ); 
        if(rows[0].affectedRows == 0) throw new Error("Erro ao deletar usuario")
        
            
        res.status(200).json({msg: 'Usuario deletado com sucesso'})

    }
    catch(error){

        console.error(error)
        res.status(400).json({msg: 'Erro ao deletar usuario'})
        //aqui é onde passa a resposta a msg é oque vai aparece r em json 
    }
});

app.put('/users/:id', async (req , res) => {
    try{
        const id = req.params.id
        
        //estamos requirindo de id no query la encima

         const {nome, email , cpf , apelido} = req.body
        //estamos pegando os dados e json em body

        const update = await pool.query('UPDATE user SET nome = ?, email = ?, cpf = ?, apelido = ? WHERE id = ?;',
        //ensima estamos colocando o comando em mySQL

        [nome, email , cpf , apelido , id]
    );
         res.status(200).json({msg: 'Usuario atualizado com sucesso'})
    }
    catch(error){

        console.error(error)
        res.status(200).json({msg: 'erro ao atualizar usuario'})
    }
})


app.listen(port, () => {
    console.log(`servidor rodando na porta: ${port}`);
})
