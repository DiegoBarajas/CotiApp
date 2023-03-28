const { Router } = require('express');
const generadorC = require('../services/GenerarCotizacionPDF');
const generadorT = require('../services/GenerarTicketPDF');
const Cotizacion = require('../models/cotizaciones.model');
const Ticket = require ('../models/tickets.model');
const fs = require('fs');
const router = Router();

const generar = async(req, res)=>{
    const {id, doc} = req.params;

    if(doc === 'cotizacion'){
        const cotizacion = await Cotizacion.findById(id);

        switch(cotizacion.plantilla){
            case 1: generadorC.cotizacion1(id, ()=>{
                        console.log('Documento: '+id+'.pdf creado');
                        res.json({exito: true})
                    });
                break;
            case 2: generadorC.cotizacion2(id, ()=>{
                        console.log('Documento: '+id+'.pdf creado');
                        res.json({exito: true})
                    });
                break;
            case 3: generadorC.cotizacion3(id, ()=>{
                        console.log('Documento: '+id+'.pdf creado');
                        res.json({exito: true})
                    });
                break;
            case 4: generadorC.cotizacion4(id, ()=>{
                        console.log('Documento: '+id+'.pdf creado');
                        res.json({exito: true})
                    });
                break;
        }
    }else if(doc === 'ticket'){
        const ticket = await Ticket.findById(id);

        switch(ticket.plantilla){
            case 1: generadorT.ticket1(id, ()=>{
                        console.log('Documento: '+id+'.pdf creado');
                        res.json({exito: true})
                    });
                break;
            case 2: generadorT.ticket2(id, ()=>{
                        console.log('Documento: '+id+'.pdf creado');
                        res.json({exito: true})
                    });
                break;
            case 3: generadorT.ticket3(id, ()=>{
                        console.log('Documento: '+id+'.pdf creado');
                        res.json({exito: true})
                    });
                break;
            case 4: generadorT.ticket4(id, ()=>{
                        console.log('Documento: '+id+'.pdf creado');
                        res.json({exito: true})
                    });
                break;
        }
    }

}

const descargar = async(req, res)=>{

    const {id, doc} = req.params;

        setTimeout(()=>{
            res.sendFile(id+'.pdf', {root: 'src/pdf'})
        }, 1000);


}

const borrar = async(req, res)=>{
    const {id} = req.params;

    try {
        fs.unlinkSync('src/pdf/'+id+'.pdf');
        res.json({exito: true});
    } catch(err) {
        console.error('Something wrong happened removing the file', err);
        res.json({exito: false})
    }
}

router.route('/:doc/:id')
    .post(generar)
    .get(descargar)
    .delete(borrar)

module.exports = router;