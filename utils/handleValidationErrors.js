import {validationResult} from "express-validator";

export default (req, res, next) => {
    //Validation. Если есть ошибки то возвращаем код ошибки. Если нет возвращаем Success true
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    next();

}