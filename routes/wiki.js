const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

module.exports = router;

router.get('/', function(req, res, next) {
    Page.findAll({})
    .then((pages) => {
        res.render('index', {
            pages: pages
        });
    })
    .catch(next);
});

router.post('/', function(req, res, next) {
    const newPage = Page.build(req.body);

    newPage.save()
    .then((savedPage) => {
         res.redirect(savedPage.route)
    })
    .catch((err) => {
        next(err);
    });
});

router.get('/add', function(req, res) {
    res.render('addpage')
});

router.get('/:urlTitle', function(req, res, next) {
   const urlTitleOfAPage = req.params.urlTitle;
    
    Page.findOne({
        where: {
            urlTitle: urlTitleOfAPage
        }
    })
    .then((page) => {
        if (page === null) {
            return next(new Error('Page not found'));
        }
        res.render('wikipage', {
            page: page
        })
    })
    .catch(next);
});