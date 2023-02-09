const ctrl = {};
const Item = require('../models/items.model');

/* --- --- --- --- --- --- ---  C R U D  --- --- --- --- --- --- --- */
//Crear Item
ctrl.crear = async(req, res)=>{
    const { 
        id_doc,
        cantidad,
        unidad,
        articulo,
        descripcion,
        precioUnitario,
        importe,
        tipo
    } = req.body;

    const newItem = new Item({
        id_doc,
        cantidad,
        unidad,
        articulo,
        descripcion,
        precioUnitario,
        importe,
        tipo
    });

    var error = false;
    await newItem.save()
        .catch(err => {
            res.json(err);
            console.log("ERROR: "+err); 
            error = true;
        });

    if(!error){
        res.json(newItem);        
    }
}

//Obtener todos los Items
ctrl.obtenerTodo = async(req, res)=>{
    const items = await Item.find();

    res.json(items);
}

//Obtener un Item
ctrl.obtenerUno = async(req, res)=>{
    const id = req.params.id;

    var item = await Item.findById(id)
        .catch(err => {
            res.json(err);
            console.log("ERROR: "+err); 
        });
    
        if(item === null){
            res.json({message: 'No se encontro el registro'});
        }else{
            res.json(item);
        }
}

//Actualizar Item
ctrl.actualizar = async(req, res)=>{
    const id = req.params.id;
    const { 
            id_doc,
            cantidad,
            unidad,
            articulo,
            descripcion,
            precioUnitario,
            importe,
            tipo
        } = req.body;

    const item = await Item.findByIdAndUpdate(id, {
        id_doc,
        cantidad,
        unidad,
        articulo,
        descripcion,
        precioUnitario,
        importe,
        tipo
    }).catch(err=>{
        res.json(err);
        console.log("ERROR: "+err); 
    });

    if(item === null){
        res.json({message: 'No se encontro el registro'});
    }else{
        res.json(item);
    }
}

//Eliminar Item
ctrl.eliminar = async(req, res)=>{
    const id = req.params.id;

    const item = await Item.findByIdAndDelete(id)
        .catch(err=>{
            res.json(err);
            console.log("ERROR: "+err); 
        });

    if(item === null){
        res.json({message: 'No se encontro el registro'});
    }else{
        res.json(item);
    }
}

module.exports = ctrl;