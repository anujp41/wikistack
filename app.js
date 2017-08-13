const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const models = require('./models/index');
const Page = models.Page;
const User = models.User;

const app = express();
const wikiRouter = require('./routes/wiki');

app.use(morgan('dev'));

app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({entended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

app.use('/wiki', wikiRouter);

app.get('/', function(req, res){
    res.render('index');
})

app.use(function(err, req, res, next){
    console.error(err);
    res.status(500).send(err.message);
});

User.sync()
.then(() => {
    return Page.sync()
})
.then(() => {
    app.listen(3000, function() {
    console.log('Server is listening on port 3000!!');
    })
})
.catch(console.error);