const express = require('express');
const { check, body } = require('express-validator')

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post(
    '/login', 
    [body('email')
    .isEmail()
    .withMessage('Veuillez entrez une adresse email valide !'),
    body('password', 
         'le mot de passe doit etre valide !')
    ], 
    authController.postLogin);

router.post(
    '/signup',
    [ check('email')
    .isEmail()
    .withMessage('Veullez entrez un mot de passe valide !')
    .custom((value, {req}) => {
        return User
        .findOne({email: value})
        .then(userDoc => {
            if(userDoc) {
                return Promise.reject("Cet email existe déja, veuillez entrez un nouveau !")
            }
        });
    }),

    body('password',
         "Veuillez entrez des lettres et des chiffres d'au moins 5 charactères"
        )
    .isLength({min: 5 })
    .isAlphanumeric(),
    body('confirmPassword')
    .custom((value, { req }) => {
        if(value == req.body.password) {
            throw new Error('les mots de passe doivent concordées');
        }
        return true;
    })],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword),

module.exports = router;