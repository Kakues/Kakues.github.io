const express    = require ('express')
const exphbs     = require('express-handlebars');
const app        = express ();
const path       = require ('path')
const db         = require ('./db/connection')
const bodyParser = require ('body-parser');
const Job        = require ('./models/Job')
const Sequelize  = require('sequelize');
const Op         = Sequelize.Op;

const PORT = 3000
app.listen(PORT, function() {
    console.log(`O Express está rodando na porta ${PORT}`)
});

//bodyParser

app.use(bodyParser.urlencoded({extended: false}));

//handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.engine({defaultlayout: 'main'}))
app.set('view engine', 'handlebars')

//static folder 
app.use(express.static(path.join(__dirname, 'public')))

//db connection
db
    .authenticate()
    .then(() => {
        console.log('conectou ao banco com sucesso')
    })
    .catch(err =>{
        console.log('opcorreu um erro ao conectar', err)
    });

//routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query  = '%'+search+'%';

    if(!search){
        Job.findAll({oreder: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs
            });
        })
        .catch (err => console.log(err));
    }else{
        Job.findAll({
            where: {title: {[Op.like]: query}},
            oreder: [
                ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs, search
            });
        })
    }

});

//jobs routes
app.use('/jobs', require('./routes/jobs'));