import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import { validationResult } from 'express-validator';

import { registerValidation, loginValidation, postCreateValidation} from "./validations.js";

import UserModel from './models/User.js';
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
 //   .connect('mongodb+srv://admin:wwwwww@cluster0.dg0mb.mongodb.net/blog?retryWrites=true&w=majority')
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

//Создаем хранилище для картинок на основе библиотеки мультер
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

//Авторизация
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login );
//Регистрация
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
//Получение информации о себе
app.get('/auth/me', checkAuth, UserController.getMe);
//Статьи  и теги (CRUD)
app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//Start Server
app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
});
