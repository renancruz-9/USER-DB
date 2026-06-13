import express from 'express';
import mysql from 'mysql2/promise';
//estamos importando as dependencias 

const app = express();
app.use(express.json());

const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'user_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    //aqui é basocamente oque liga agente com  api e banco de dados funciona como um tubo de ligaçao
})


app.get('/users', async (req , res) => {
    //async é ua funcao 
    const rows = await pool.query('SELECT * FROM user;');
    res.status(200).json(rows[0])
}) 

app.post('/users', async (req , res) => {
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
    )

    res.status(201).json({msg: 'usuario criado com sucesso'})
})

app.delete('/users/:id', async (req , res) => {
    //acima  é definida a rota
    const id = req.params.id
    //nso vamos pedir para que o usuario envie a resp por parametros de id no requerimento 
    const rows = await pool.query('DELETE FROM user WHERE id = ?;', //interrogaçao é os parametros que sao injetados 
         [id] // aqui é oque recebe todos parametros quem forem passados com interrogaçao
    )

    
    res.status(200).json({msg: 'usuario deletado'})
    //aqui é onde passa a resposta a msg é oque vai aparece r em json 
})

app.put('/users/:id', async (req , res) => {
    
    const id = req.params.id
    //estamos requirindo de id no query la encima 
   const {nome, email , cpf , apelido} = req.body
   //estamos pegando os dados e json em body

   const update = await pool.query('UPDATE user SET nome = ?, email = ?, cpf = ?, apelido = ? WHERE id = ?;',
    //ensima estamos colocando o comando em mySQL
        [nome, email , cpf , apelido , id]
   )
   res.status(200).json({msg: 'Usuario atualizado com sucesso!!'})
   
})


app.listen(port, () => {
    console.log(`servidor rodando na porta: ${port}`);
})
