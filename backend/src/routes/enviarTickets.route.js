const { Router } = require('express');
const generador = require('../services/GenerarTicketPDF');
const sendMail = require('../services/sendMail');
const Cotizacion = require('../models/tickets.model');
const Cliente = require('../models/clientes.model');
const fs = require('fs');
const Usuario = require('../models/usuarios.model');
const Empresa = require('../models/empresas.model');

const router = Router();

const enviar = async(req, res)=>{

    const id = req.params.id;

    var cotizacion;
    var cliente;
    var usuario;
    var empresa;

    try{
        cotizacion = await Cotizacion.findById(id)
        cliente = await Cliente.findById(cotizacion.id_cliente)
        usuario = await Usuario.findById(cotizacion.id_usuario)
        empresa = await Empresa.findById(usuario.id_empresa)
    }catch(err){
        res.json({exito: false})
        return;
    }

    var folio = '';
    const folioDB = (cotizacion.folio).split('');

    for(let i = folioDB.length ; i<4; i++){
        folio+='0';
    }
    folio+=cotizacion.folio;

    const subject = 'Ticket de '+empresa.nombre;
    const html = '<h1>Ticket folio #'+folio+'</h1>'+
    '<h3>Hecha por: '+usuario.nombre +' '+usuario.apellido+'</h3>'+
    '<h3>El '+cotizacion.fecha+'</h3>'+
    '<br><br>'+
    '<h3>Para '+cliente.nombre+' de '+cliente.empresa+'</h3>'+
    '<p>Acontinuación se adjunta el Ticket :)</p>'+
    '<br><br><br><br>'+
    '<p><b>HECHO POR COTIAPP</b></p>';

    switch(cotizacion.plantilla){
        case 1: cotizar1(id, cotizacion, cliente, res, subject, html);
            break;
        
        case 2: cotizar2(id, cotizacion, cliente, res, subject, html);
            break;

        case 3: cotizar3(id, cotizacion, cliente, res, subject, html);
            break;

        case 4: cotizar4(id, cotizacion, cliente, res, subject, html);
            break;

    }
    
}

router.route('/:id')
    .post(enviar)

async function cotizar1(id, cotizacion, cliente, res, subject, html){

    var exito = true;

    await generador.ticket1(id, async()=>{
        await sendMail(cliente.correo, subject, html, id+'.pdf', (ans)=>{
            exito = ans;
            try {
                fs.unlinkSync('src/pdf/'+id+'.pdf');
                res.json({exito: exito});
            } catch(err) {
                console.error('Something wrong happened removing the file', err);
                res.json({exito: false})
            }
        }).catch(err => console.log("ERROR 3: "+err))
    })
    .catch(err => res.json({
        exito: false,
        error: err
    }));
}

async function cotizar2(id, cotizacion, cliente, res, subject, html){

    var exito = true;
    
    await generador.ticket2(id, async()=>{
        await sendMail(cliente.correo, subject, html, id+'.pdf', (ans)=>{
            exito = ans;
            try {
                fs.unlinkSync('src/pdf/'+id+'.pdf');
                res.json({exito: exito});
            } catch(err) {
                console.error('Something wrong happened removing the file', err);
                res.json({exito: false})
            }
        }).catch(err => console.log("ERROR 3: "+err))
    })
    .catch(err => res.json({
        exito: false,
        error: err
    }));
}

async function cotizar3(id, cotizacion, cliente, res, subject, html){
    
    var exito = true;
    
    await generador.ticket3(id, async()=>{
        await sendMail(cliente.correo, subject, html, id+'.pdf', (ans)=>{
            exito = ans;
            try {
                fs.unlinkSync('src/pdf/'+id+'.pdf');
                res.json({exito: exito});
            } catch(err) {
                console.error('Something wrong happened removing the file', err);
                res.json({exito: false})
            }
        }).catch(err => console.log("ERROR 3: "+err))
    })
    .catch(err => res.json({
        exito: false,
        error: err
    }));
}

async function cotizar4(id, cotizacion, cliente, res, subject, html){

    var exito = true;
    
    await generador.ticket4(id, async()=>{
        await sendMail(cliente.correo, subject, html, id+'.pdf', (ans)=>{
            exito = ans;
            try {
                fs.unlinkSync('src/pdf/'+id+'.pdf');
                res.json({exito: exito});
            } catch(err) {
                console.error('Something wrong happened removing the file', err);
                res.json({exito: false})
            }
        }).catch(err => console.log("ERROR 3: "+err))
    })
    .catch(err => res.json({
        exito: false,
        error: err
    }));
}


module.exports = router;