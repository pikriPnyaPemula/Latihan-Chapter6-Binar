const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = process.env;

module.exports = {
    register: async (req, res, next) =>{
        try{
            let {email, password} = req.body;

            let userExist = await prisma.user.findUnique({where: {email}});
            if(userExist){
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    error: 'user has already exist',
                    data: null
                });
            }

            let encryptedPassword = await bcrypt.hash(password, 10);
            let user = await prisma.user.create({
                data: {
                    email,
                    password: encryptedPassword
                }
            });

            return res.status(201).json({
                status: true,
                message: 'Created!',
                error: null,
                data: {user}
            })
        } catch(err){
            next(err);
        }
    },

    login: async(req, res, next) => {
        try{
            let {email, password} = req.body;

            let user = await prisma.user.findUnique({where: {email}});
            if(!user){
                return res.statu(400).json({
                    status: false,
                    message: 'Bad Request',
                    error: 'invalid email or password!',
                    data: null
                });
            }

            let isPasswordCorrect = await bcrypt.compare(password, user.password);
            if(!isPasswordCorrect){
                return res.statu(400).json({
                    status: false,
                    message: 'Bad Request',
                    error: 'invalid email or password!',
                    data: null
                });
            }

            let token = jwt.sign({id: user.id}, JWT_SECRET_KEY);

            return res.status(200).json({
                status: true,
                message: 'OK',
                error: null,
                data: {user, token}
            })
        } catch(err){
            next(err);
        }
    },

    whoami: (req, res, next) =>{
        return res.status(200).json({
            status: true,
            message: 'OK',
            err: null,
            data: {user: req.user}
        });
    },

    updateProfile: async(req, res, next)=>{
        try{
            let {id} = req.params;
            let {first_name, last_name, birth_date, profile_picture} = req.body;

            const userExist = await prisma.userProfile.findUnique({where: {user_id: Number(id)}});
            if(!userExist){
                res.status(400).json({
                    status: true,
                    message: 'Bad Request',
                    error: 'User ID is not exist',
                    data: null
                })
            }

            let updateOperation = await prisma.userProfile.update({
                where: {id: Number(id)},
                data: {first_name, last_name, birth_date, profile_picture}
            });

            res.status(200).json({
                status: true,
                message: 'OK',
                error: null,
                data: updateOperation
            })
        } catch(err){
            next(err);
        }
    }
}