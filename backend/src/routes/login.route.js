const { Router } = require('express');
const Usuario = require('../models/usuarios.model');
const bcrypt = require("bcryptjs");
const router = Router();

const login = async(req, res)=>{
    const {correo, password} = req.body;
    var login = false;

    const usuarios = await Usuario.find();
    usuarios.map((u)=>{
        if(u.correo == correo){
            bcrypt.compare(password, u.password, (err, coinciden) => {
                if(coinciden){
                    if(u.activo){
                        res.json({
                            exito: true,
                            id: u._id
                        });
                    }else{
                        res.json({
                            exito: false,
                            error: 'Cuenta no activa',
                            id: u._id
                        });
                    }
                }else{
                    res.json({
                        exito: false
                    });
                }
            });
            login = true;
        }
    });

    if(!login){
        res.json({
            exito: false
        });
    }
}

const comprobarPass = async(req, res)=>{
    const {id} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findById(id)
        .catch(err => {
            res.json(err);
            console.log("ERROR: "+err); 
        });

    if(usuario == null){
        res.json({exito: false});
    }else{
        bcrypt.compare(password, usuario.password, (err, coinciden) => {
            if(coinciden){
                res.json({
                    password: true
                });
            }else{
                res.json({
                    password: false
                });
            }
        });
    }

}

router.route('/')
    .post(login)
    
router.route('/:id')
    .post(comprobarPass)

module.exports = router;