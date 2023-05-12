const ctrl = {};
const Cotizacion = require('../models/cotizaciones.model');
const Usuario = require('../models/usuarios.model');

/* --- --- --- --- --- --- ---  C R U D  --- --- --- --- --- --- --- */
//Crear Cotizacion
ctrl.crear = async(req, res)=>{
    const { 
        id_usuario,
        id_cliente,
        color,
        folio,
        fecha,
        condiciones,
        subtotal,
        iva,
        importeIva,
        descuento,
        adicional,
        total,
        footer,
        plantilla
    } = req.body;

    var impIva = importeIva.toFixed(2);

    const usuario = await Usuario.findById(id_usuario);

    const newCotizacion = new Cotizacion({
        id_usuario,
        id_cliente,
        id_empresa: usuario.id_empresa,
        color,
        folio,
        fecha,
        condiciones,
        subtotal,
        iva,
        importeIva: impIva,
        descuento,
        adicional,
        total,
        footer,
        plantilla
    });

    var error = false;
    await newCotizacion.save()
        .catch(err => {
            res.json(err);
            console.log("ERROR: "+err); 
            error = true;
        });

    if(!error){
        res.json(newCotizacion);        
    }
}

//Obtener todos los Cotizacions
ctrl.obtenerTodo = async(req, res)=>{
    const cotizacion = await Cotizacion.find();

    res.json(cotizacion);
}

//Obtener un Cotizacion
ctrl.obtenerUno = async(req, res)=>{
    const id = req.params.id;

    var cotizacion = await Cotizacion.findById(id)
        .catch(err => {
            res.json(err);
            console.log("ERROR: "+err); 
        });
    
        if(cotizacion === null){
            res.json({message: 'No se encontro el registro'});
        }else{
            res.json(cotizacion);
        }
}

//Actualizar Cotizacion
ctrl.actualizar = async(req, res)=>{
    const id = req.params.id;
    const { 
            id_usuario,
            id_cliente,
            color,
            folio,
            condiciones,
            subtotal,
            iva,
            importeIva,
            descuento,
            adicional,
            total,
            footer,
            plantilla
        } = req.body;

    const cotizacion = await Cotizacion.findByIdAndUpdate(id, {
        id_usuario,
        id_cliente,
        color,
        folio,
        fecha,
        condiciones,
        subtotal,
        iva,
        importeIva,
        descuento,
        adicional,
        total,
        footer,
        plantilla
    }).catch(err=>{
        res.json(err);
        console.log("ERROR: "+err); 
    });

    if(cotizacion === null){
        res.json({message: 'No se encontro el registro'});
    }else{
        res.json(cotizacion);
    }
}

//Eliminar Cotizacion
ctrl.eliminar = async(req, res)=>{
    const id = req.params.id;

    const cotizacion = await Cotizacion.findByIdAndDelete(id)
        .catch(err=>{
            res.json(err);
            console.log("ERROR: "+err); 
        });

    if(cotizacion === null){
        res.json({message: 'No se encontro el registro'});
    }else{
        res.json(cotizacion);
    }
}

module.exports = ctrl;