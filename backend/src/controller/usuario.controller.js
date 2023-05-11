const ctrl = {};
const bcrypt = require("bcryptjs");
const Usuario = require('../models/usuarios.model');
const sendMail = require("../services/sendMail");
const sendTextMail = require("../services/sendTextMail");

/* --- --- --- --- --- --- ---  C R U D  --- --- --- --- --- --- --- */
//Crear Usuario
ctrl.crear = async(req, res)=>{
    const { 
            nombre,
            apellido, 
            id_empresa, 
            correo, 
            telefono, 
            password, 
            dios, 
            admin, 
            moderador, 
            cotizaciones, 
            tickets 
        } = req.body;

    const usuarios = await Usuario.find();
    var band = true;
    usuarios.map((u)=>{
        if(u.correo == correo){
            band = false;
            res.json({exito: false});
        }
    });

    if(band){

        const pass = generarPass(8);

        bcrypt.hash(pass, 10, async(err, palabraSecretaEncriptada)=>{
            if (err) {
                console.log("Error hasheando:", err);
                res.json({error: true})
            } else {
                const newUsuario = new Usuario({
                    nombre, 
                    apellido, 
                    id_empresa, 
                    correo, 
                    telefono, 
                    password: palabraSecretaEncriptada, 
                    dios,
                    admin, 
                    moderador, 
                    cotizaciones, 
                    tickets
                });

                const html = "<h1>Contraseña</h1><p>Tu contraseña es: "+pass+"</p>"

                sendTextMail(correo, 'Contraseña', html, ()=>{
                    console.log('Correo con contraseña enviado: '+pass);
                })
            
                var error = false;
                await newUsuario.save()
                    .catch(err => {
                        res.json(err);
                        console.log("ERROR: "+err); 
                        error = true;
                    });
            
                if(!error){
                    res.json(newUsuario);        
                }        
            }
        });
    }

}

//Obtener todos los Usuarios
ctrl.obtenerTodo = async(req, res)=>{
    const Usuarios = await Usuario.find();

    res.json(Usuarios);
}

//Obtener un usuario
ctrl.obtenerUno = async(req, res)=>{
    const id = req.params.id;

    var usuario = await Usuario.findById(id)
        .catch(err => {
            res.json(err);
            console.log("ERROR: "+err); 
        });
    
        if(usuario === null){
            res.json({message: 'No se encontro el registro'});
        }else{
            res.json(usuario);
        }
}

//Actualizar usuario
ctrl.actualizar = async(req, res)=>{
    const id = req.params.id;
    const { 
            nombre, 
            apellido, 
            id_empresa, 
            telefono, 
            password, 
            dios, 
            admin, 
            moderador, 
            cotizaciones, 
            tickets 
        } = req.body;
        
    var pass;
    
    if(password !== undefined){
        pass = await bcrypt.hash(password, 10);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, {
        nombre, 
        apellido, 
        id_empresa, 
        telefono, 
        password: pass, 
        dios, 
        admin, 
        moderador, 
        cotizaciones, 
        tickets
    }).catch(err=>{
        res.json(err);
        console.log("ERROR: "+err); 
    });

    if(usuario === null){
        res.json({message: 'No se encontro el registro'});
    }else{
        res.json(usuario);
    }
}

//Eliminar usuario
ctrl.eliminar = async(req, res)=>{
    const id = req.params.id;

    const usuario = await Usuario.findById(id);

    await Usuario.findByIdAndUpdate(id, {
        activo: !usuario.activo
    })
        .catch(err=>{
            res.json(err);
            console.log("ERROR: "+err); 
        });

    if(usuario === null){
        res.json({message: 'No se encontro el registro'});
    }else{
        res.json(usuario);
    }
}

//Reiniciar contraseña
ctrl.reiniciarPassword = async(req, res)=>{
    const id = req.params.id;
    pass = generarPass(8)
    passwrd = await bcrypt.hash(pass, 10);
    const usuario = await Usuario.findByIdAndUpdate(id, { 
        password: passwrd
    }).catch(err=>{
        res.json(err);
        console.log("ERROR: "+err); 
    });

    if(usuario === null){
        res.json({message: 'No se encontro el registro'});
    }else{
        const html = "<h1>Nueva Contraseña</h1><p>Se ha restaurado tu contraseña<br/>Ahora es: "+pass+"</p>"

        sendTextMail(usuario.correo, 'Restauración de Contraseña', html, ()=>{
        console.log('Correo con contraseña enviado: '+pass);
    })

        res.json(usuario);
        console.log('Contraseña restaurada al usuario: '+id);
    }
}

//Generar Contraseña
function generarPass(longitud) {
    let pass = "";
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < longitud; i++) {
      pass += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return pass;
  }

module.exports = ctrl;