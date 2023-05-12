const PDFGenerator = require('pdfkit');
var colors = require('colors/safe');
const fs = require('fs');
const generador = {};

const Cotizacion = require('../models/tickets.model');
const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');
const Empresa = require('../models/empresas.model');
const Item = require('../models/items.model');
const descargarImagen = require('./descargarImagen');


generador.ticket1 = async(id, callback)=>{

    const data = await getData(id);    
    
    descargarImagen(data.empresa.img, data.empresa._id+'.jpg', function(){
        
        let doc = new PDFGenerator;

        doc.pipe(fs.createWriteStream('src/pdf/'+data.cotizacion._id+'.pdf'));

        var altura = generarHeader(doc, data);
        altura = generarTabla(doc, data, altura);
        generarFooter(doc, data, altura);

        doc.end();
        console.log(colors.green('PDF '+data.cotizacion._id+'.pdf se ha creado :)'));

        try {
            fs.unlinkSync('src/pdf/imgs/'+data.empresa._id+'.jpg');
        } catch(err) {
            console.error('Something wrong happened removing the file', err)
        }

        callback();
    });
}

generador.ticket2 = async(id, callback)=>{

    const data = await getData(id);    
    
    descargarImagen(data.empresa.img, data.empresa._id+'.jpg', function(){
        
        let doc = new PDFGenerator;

        doc.pipe(fs.createWriteStream('src/pdf/'+data.cotizacion._id+'.pdf'));

        var altura = generarHeader2(doc, data);
        altura = generarTabla(doc, data, altura);
        generarFooter2(doc, data, altura);

        doc.end();
        console.log(colors.green('PDF '+data.cotizacion._id+'.pdf se ha creado :)'));

        try {
            fs.unlinkSync('src/pdf/imgs/'+data.empresa._id+'.jpg');
        } catch(err) {
            console.error('Something wrong happened removing the file', err)
        }

        callback();
    });
}

generador.ticket3 = async(id, callback)=>{

    const data = await getData(id);    
    
    descargarImagen(data.empresa.img, data.empresa._id+'.jpg', function(){
        
        let doc = new PDFGenerator;

        doc.pipe(fs.createWriteStream('src/pdf/'+data.cotizacion._id+'.pdf'));

        var altura = generarHeader3(doc, data);
        altura = generarTabla(doc, data, altura);
        generarFooter(doc, data, altura);

        doc.end();
        console.log(colors.green('PDF '+data.cotizacion._id+'.pdf se ha creado :)'));

        try {
            fs.unlinkSync('src/pdf/imgs/'+data.empresa._id+'.jpg');
        } catch(err) {
            console.error('Something wrong happened removing the file', err)
        }

        callback();
    });
}

generador.ticket4 = async(id, callback)=>{

    const data = await getData(id);    
    
    descargarImagen(data.empresa.img, data.empresa._id+'.jpg', function(){
        
        let doc = new PDFGenerator;

        doc.pipe(fs.createWriteStream('src/pdf/'+data.cotizacion._id+'.pdf'));

        var altura = generarHeader4(doc, data);
        altura = generarTabla(doc, data, altura);
        generarFooter2(doc, data, altura);

        doc.end();
        console.log(colors.green('PDF '+data.cotizacion._id+'.pdf se ha creado :)'));

        try {
            fs.unlinkSync('src/pdf/imgs/'+data.empresa._id+'.jpg');
        } catch(err) {
            console.error('Something wrong happened removing the file', err)
        }

        callback();
    });
}

//Plantilla 1
function generarHeader(doc, data) {

    doc.on('pageAdded', () => {altura=75});


    const maxAlto = 150;
    const maxAncho = 250;
    var folio = '';
    const folioDB = (data.cotizacion.folio).split('');

    for(let i = folioDB.length ; i<4; i++){
        folio+='0';
    }
    folio+=data.cotizacion.folio;

    doc
        .image('src/pdf/imgs/'+data.empresa._id+'.jpg', 20, 20, { fit: [maxAncho, maxAlto], align: 'center'})
        .fillColor('black')
        .fontSize(30)
        .font('Helvetica-Bold')
        .text('Ticket', 350, 50, {align: 'center', bold: true})
        .fontSize(20)
        .text('Folio: ', 350, 100, {align: 'left'})
        .text('Emitida: ', 350, 120, {align: 'left'})

        .fillColor(data.cotizacion.color)
        .fontSize(12)
        .text(data.cotizacion._id, 350, 138, {align: 'center'})
        .fillColor('black')
        .fontSize(20)


        .font('Helvetica')
        .fillColor(data.cotizacion.color)
        .text(folio, 360, 100, {align: 'right'})
        .text(data.cotizacion.fecha, 380, 120, {align: 'right'})

        .font('Helvetica-Bold')
        .fontSize(18)
        .text(data.usuario.nombre+' '+data.usuario.apellido, 300, 237, {align: 'right'})
        .fillColor('black')

        .moveDown()
    
    doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor(data.cotizacion.color)
        .text(data.cliente.empresa, 50, 180, {align: 'left', bold: true})

        .fontSize(10)
        .fillColor('black')
        .text('Contacto: ', 50, 195, {align: 'left'})
        .text('Telefono: ', 50, 205, {align: 'left'})
        .text('Correo: ', 50, 215, {align: 'left'})

        
        .font('Helvetica')
        .fontSize(10)
        .text(data.cliente.nombre, 98, 195, {align: 'left'})
        .text(data.cliente.telefono, 96, 205, {align: 'left'})
        .text(data.cliente.correo, 89, 215, {align: 'left'})


    const beginningOfPage = 40
    const endOfPage = 560

    doc
        .fontSize(15)
        .font('Helvetica-Bold')
        .text('Condiciones de venta:', 40, 240, {bold: true})
        .font('Helvetica')


    doc.moveTo(beginningOfPage,253)
        .lineTo(endOfPage,255)
        .stroke()

    var altura = 260;
    
    const cond = (data.cotizacion.condiciones).split('\n');
    cond.map((c)=>{
        doc
            .fillColor('#555')
            .fontSize(10)
            .text(c, 45, altura)
            
        altura+=12;
    });
            

    doc
        .fillColor('black')
        .moveTo(beginningOfPage,altura+5)
        .lineTo(endOfPage,altura+5)
        .stroke()
    
    return altura;
}

function generarTabla(doc, data, alt){
    var altura = alt+20;

    doc.on('pageAdded', () => {
        altura=75;
    });

    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('\CANT', 40, altura+7)
        .text('UNID', 85, altura+7)
        .text('ARTICULO Y DESCRIPCION', 130, altura+7)
        .text('PRECIO\nUNITARIO', 415, altura)
        .text('PRECIO\nTOTAL', 493.5, altura)

        cuadradoNegro(doc, 38, altura-5, 45, 32, data.cotizacion.color);
        cuadradoNegro(doc, 83, altura-5, 45, 32, data.cotizacion.color);
        cuadradoNegro(doc, 128, altura-5, 284, 32, data.cotizacion.color);
        cuadradoNegro(doc, 412, altura-5, 75, 32, data.cotizacion.color);
        cuadradoNegro(doc, 487, altura-5, 75, 32, data.cotizacion.color);

    altura+=35;

    var index = 1;
    data.items.map((i)=>{
        if(altura >= 700){
            doc.addPage()
        }
        index++;
        var desc = (i.descripcion).split('\n');
        var descripcion = '';
        var altCaja = 25;

        desc.map((d)=>{
            descripcion+='    -'+d+'\n';
            altCaja+=10;
        });

        if(desc.length == 1 && doc[0]==""){
            descripcion='';
        }

        altCaja-=10;

        doc        
            .fontSize(9)
            .fillOpacity(1)
            .fillColor('#000')
            .font('Helvetica')
            .text(i.cantidad ,42, altura-4)

            .text(i.unidad , 85, altura-4)
            .fillColor(data.cotizacion.color)
            .text(i.articulo, 130, altura-4)
            .fillColor('black')
            .fontSize(8)
            .text(descripcion, 130, altura+9)
            .fontSize(9)
            .text('$'+i.precioUnitario, 415, altura-4)
            .text('$'+i.importe, 493.5, altura-4)

        cuadradoItem(doc, 38, altura-8, 45, altCaja, index, data.cotizacion.color);
        cuadradoItem(doc, 83, altura-8, 45, altCaja, index, data.cotizacion.color);
        cuadradoItem(doc, 128, altura-8, 284, altCaja, index, data.cotizacion.color);
        cuadradoItem(doc, 412, altura-8, 75, altCaja, index, data.cotizacion.color);
        cuadradoItem(doc, 487, altura-8, 75, altCaja, index, data.cotizacion.color);

        altura+=altCaja;
    });

    altura+=10;

    doc
        .fontSize(15)
        .fillOpacity(1)
        .fillColor('#000')
        .font('Helvetica-Bold')
        .text('Subtotal: ' ,350, altura)
        .text('Forma de Pago: ' , 36, altura)
        .font('Helvetica')
        .text('$'+data.cotizacion.subtotal+' MXN' ,350, altura, {align: 'right'})
        .text(data.cotizacion.pago ,36, altura+15, {align: 'left'})
    altura+=15;

    doc
        .font('Helvetica-Bold')
        .text('IVA ('+data.cotizacion.iva+'%):' ,350, altura)
        .font('Helvetica')
        .text('$'+data.cotizacion.importeIva+' MXN' ,350, altura, {align: 'right'})

    altura+=15;

    if(data.cotizacion.descuento != 0){
        doc
            .font('Helvetica-Bold')
            .text('Descuento: ' ,350, altura)
            .font('Helvetica')
            .text('-$'+data.cotizacion.descuento+' MXN' ,350, altura, {align: 'right'})
        altura+=15;
    }

    if(data.cotizacion.adicional != 0){
        doc
            .font('Helvetica-Bold')
            .text('Adicional: ' ,350, altura)
            .font('Helvetica')
            .text('+$'+data.cotizacion.adicional+' MXN' ,350, altura, {align: 'right'})
        altura+=15;
    }
    altura+=10;

    doc.moveTo(345,altura-3)
        .lineTo(550,altura-3)
        .stroke()

    doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .fillColor(data.cotizacion.color)
        .text('TOTAL: ' ,275, altura)
        .font('Helvetica')
        .text('$'+data.cotizacion.total+' MXN' ,350, altura, {align: 'right'})
        .fillColor('black')


    altura+=15;

    return altura;        
}

function generarFooter(doc, data, alt){
    var altura = alt+50;

    doc.on('pageAdded', () => {altura=50});

    const foot = (data.cotizacion.footer).split('\n');

    doc
        .font('Helvetica')
        .fontSize(8)
        .text(data.cotizacion.footer, 40, altura)

    if(altura==50){
        altura+=50+(10*foot.length);;
    }else{
        altura+=(10*foot.length);
    }

    doc.moveTo(28,altura+5)
    .lineTo(560,altura+5)
    .stroke()
    
    doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor(data.cotizacion.color)
        .text('Le atendió '+data.usuario.nombre+' '+data.usuario.apellido+ ' de ' +data.empresa.nombre, 40, altura+10)
        .fontSize(10)
        .fillColor('black')
        .text(data.empresa.direccion, 40, altura+22)
        .text(data.empresa.telefono, 40, altura+34)
        .text(data.empresa.correo, 40, altura+46)
        .text(data.empresa.pagina, 40, altura+58, {link: data.empresa.pagina, underline: true})

    
}

//Plantilla 2
function generarHeader2(doc, data) {

    doc.on('pageAdded', () => {altura=75});


    const maxAlto = 150;
    const maxAncho = 250;
    var folio = '';
    const folioDB = (data.cotizacion.folio).split('');

    for(let i = folioDB.length ; i<4; i++){
        folio+='0';
    }
    folio+=data.cotizacion.folio;

    doc
        .image('src/pdf/imgs/'+data.empresa._id+'.jpg', 20, 20, { fit: [maxAncho, maxAlto], align: 'center'})
        .fillColor('black')
        .fontSize(30)
        .font('Helvetica-Bold')
        .text('Ticket', 350, 50, {align: 'center', bold: true})
        .fontSize(20)
        .text('Folio: ', 350, 100, {align: 'left'})
        .text('Emitida: ', 350, 120, {align: 'left'})

        .fillColor(data.cotizacion.color)
        .fontSize(12)
        .text(data.cotizacion._id, 350, 138, {align: 'center'})
        .fillColor('black')
        .fontSize(20)


        .font('Helvetica')
        .fillColor(data.cotizacion.color)
        .text(folio, 360, 100, {align: 'right'})
        .text(data.cotizacion.fecha, 380, 120, {align: 'right'})

            
    doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor(data.cotizacion.color)
        .text(data.cliente.empresa, 50, 180, {align: 'left', bold: true})

        .fontSize(10)
        .fillColor('black')
        .text('Contacto: ', 50, 195, {align: 'left'})
        .text('Telefono: ', 50, 205, {align: 'left'})
        .text('Correo: ', 50, 215, {align: 'left'})

        
        .font('Helvetica')
        .fontSize(10)
        .text(data.cliente.nombre, 98, 195, {align: 'left'})
        .text(data.cliente.telefono, 96, 205, {align: 'left'})
        .text(data.cliente.correo, 89, 215, {align: 'left'})


    var altura = 230;
        doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(data.cotizacion.color)
        .text('Le atiende '+data.usuario.nombre+' '+data.usuario.apellido+ ' de ' +data.empresa.nombre, 50, altura+10)
        .fontSize(10)
        .fillColor('black')
        .text(data.empresa.direccion, 50, altura+22)
        .text(data.empresa.telefono, 50, altura+34)
        .text(data.empresa.correo, 50, altura+46)
        .text(data.empresa.pagina, 50, altura+58, {link: data.empresa.pagina, underline: true})

    altura+=80;



    const beginningOfPage = 40
    const endOfPage = 560

    doc
        .fontSize(15)
        .font('Helvetica-Bold')
        .text('Condiciones de venta:', 40, altura, {bold: true})
        .font('Helvetica')


    doc.moveTo(beginningOfPage,altura-10)
        .lineTo(endOfPage,altura-10)
        .stroke()

    altura+=15;

    
    const cond = (data.cotizacion.condiciones).split('\n');
    cond.map((c)=>{
        doc
            .fillColor('#555')
            .fontSize(10)
            .text(c, 45, altura)
            
        altura+=12;
    });
            

    doc
        .fillColor('black')
        .moveTo(beginningOfPage,altura+5)
        .lineTo(endOfPage,altura+5)
        .stroke()
    
    return altura;
}

function generarFooter2(doc, data, alt){
    var altura = alt+50;

    doc.on('pageAdded', () => {altura=50});

    const foot = (data.cotizacion.footer).split('\n');
    var footer = '';
    foot.map((f)=>{
        footer+=f+'\n';
    });

    doc
        .moveTo(28,altura+5)
        .lineTo(560,altura)
        .stroke()
    altura+=10;

    doc
        .font('Helvetica')
        .fontSize(8)
        .text(footer, 40, altura)

    if(altura==50){
        altura+=50+(10*foot.length);;
    }else{
        altura+=(10*foot.length);
    }


    return altura;
}

//Plantilla 3
function generarHeader3(doc, data) {

    doc.on('pageAdded', () => {altura=75});


    const maxAlto = 150;
    const maxAncho = 250;
    var folio = '';
    const folioDB = (data.cotizacion.folio).split('');

    for(let i = folioDB.length ; i<4; i++){
        folio+='0';
    }
    folio+=data.cotizacion.folio;

    doc
        .image('src/pdf/imgs/'+data.empresa._id+'.jpg', 20, 20, { fit: [maxAncho, maxAlto], align: 'center'})
        .fillColor('black')
        .fontSize(30)
        .font('Helvetica-Bold')
        .text('Ticket', 350, 50, {align: 'center', bold: true})
        .fontSize(20)
        .text('Folio: ', 50, 180, {align: 'left'})
        .text('Emitida: ', 50, 200, {align: 'left'})

        .fillColor(data.cotizacion.color)
        .fontSize(12)
        .text(data.cotizacion._id, 50, 218)
        .fillColor('black')
        .fontSize(20)


        .font('Helvetica')
        .fillColor(data.cotizacion.color)
        .text(folio, 110, 180)
        .text(data.cotizacion.fecha, 130, 200)

        .font('Helvetica-Bold')
        .fontSize(18)
        .text(data.usuario.nombre+' '+data.usuario.apellido, 300, 237, {align: 'right'})
        .fillColor('black')

        .moveDown()
    
    doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor(data.cotizacion.color)
        .text(data.cliente.empresa,350, 100, {align: 'left', bold: true})

        .fontSize(10)
        .fillColor('black')
        .text('Contacto: ', 350, 115, {align: 'left'})
        .text('Telefono: ', 350, 125, {align: 'left'})
        .text('Correo: ', 350, 135, {align: 'left'})

        
        .font('Helvetica')
        .fontSize(10)
        .text(data.cliente.nombre, 398, 115, {align: 'left'})
        .text(data.cliente.telefono, 396, 125, {align: 'left'})
        .text(data.cliente.correo, 389, 135, {align: 'left'})


    const beginningOfPage = 40
    const endOfPage = 560

    doc
        .fontSize(15)
        .font('Helvetica-Bold')
        .text('Condiciones de venta:', 40, 240, {bold: true})
        .font('Helvetica')


    doc.moveTo(beginningOfPage,253)
        .lineTo(endOfPage,255)
        .stroke()

    var altura = 260;
    
    const cond = (data.cotizacion.condiciones).split('\n');
    cond.map((c)=>{
        doc
            .fillColor('#555')
            .fontSize(10)
            .text(c, 45, altura)
            
        altura+=12;
    });
            

    doc
        .fillColor('black')
        .moveTo(beginningOfPage,altura+5)
        .lineTo(endOfPage,altura+5)
        .stroke()
    
    return altura;
}

//Plantilla4
function generarHeader4(doc, data) {


    doc.on('pageAdded', () => {altura=75});


    const maxAlto = 150;
    const maxAncho = 250;
    var folio = '';
    const folioDB = (data.cotizacion.folio).split('');

    for(let i = folioDB.length ; i<4; i++){
        folio+='0';
    }
    folio+=data.cotizacion.folio;

    doc
        .image('src/pdf/imgs/'+data.empresa._id+'.jpg', 20, 20, { fit: [maxAncho, maxAlto], align: 'center'})
        .fillColor('black')
        .fontSize(30)
        .font('Helvetica-Bold')
        .text('Ticket', 350, 50, {align: 'center', bold: true})
        .fontSize(20)
        .text('Folio: ', 50, 180, {align: 'left'})
        .text('Emitida: ', 50, 200, {align: 'left'})

        .fillColor(data.cotizacion.color)
        .fontSize(12)
        .text(data.cotizacion._id, 50, 218)
        .fillColor('black')
        .fontSize(20)


        .font('Helvetica')
        .fillColor(data.cotizacion.color)
        .text(folio, 110, 180)
        .text(data.cotizacion.fecha, 130, 200)
        .fillColor('black')

        .moveDown()
    
    doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor(data.cotizacion.color)
        .text(data.cliente.empresa,350, 100, {align: 'left', bold: true})

        .fontSize(10)
        .fillColor('black')
        .text('Contacto: ', 350, 115, {align: 'left'})
        .text('Telefono: ', 350, 125, {align: 'left'})
        .text('Correo: ', 350, 135, {align: 'left'})

        
        .font('Helvetica')
        .fontSize(10)
        .text(data.cliente.nombre, 398, 115, {align: 'left'})
        .text(data.cliente.telefono, 396, 125, {align: 'left'})
        .text(data.cliente.correo, 389, 135, {align: 'left'})


    var altura = 230;
        doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(data.cotizacion.color)
        .text('Le atiende '+data.usuario.nombre+' '+data.usuario.apellido+ ' de ' +data.empresa.nombre, 50, altura+10)
        .fontSize(10)
        .fillColor('black')
        .text(data.empresa.direccion, 50, altura+22)
        .text(data.empresa.telefono, 50, altura+34)
        .text(data.empresa.correo, 50, altura+46)
        .text(data.empresa.pagina, 50, altura+58, {link: data.empresa.pagina, underline: true})

    altura+=80;



    const beginningOfPage = 40
    const endOfPage = 560

    doc
        .fontSize(15)
        .font('Helvetica-Bold')
        .text('Condiciones de venta:', 40, altura, {bold: true})
        .font('Helvetica')


    doc.moveTo(beginningOfPage,altura-10)
        .lineTo(endOfPage,altura-10)
        .stroke()

    altura+=15;

    
    const cond = (data.cotizacion.condiciones).split('\n');
    cond.map((c)=>{
        doc
            .fillColor('#555')
            .fontSize(10)
            .text(c, 45, altura)
            
        altura+=12;
    });
            

    doc
        .fillColor('black')
        .moveTo(beginningOfPage,altura+5)
        .lineTo(endOfPage,altura+5)
        .stroke()
    
    return altura;
}

//Generales
const getData = async(id)=>{

    const cotizacion = await Cotizacion.findById(id)
        .catch(err=>{
            console.log(err);
            return('Ha habido un error: '+err);
        });
    
    const usuario = await Usuario.findById(cotizacion.id_usuario)
        .catch(err=>{
            console.log(err);
            return('Ha habido un error: '+err);
        });
    
    const empresa = await Empresa.findById(usuario.id_empresa)
        .catch(err=>{
            console.log(err);
            return('Ha habido un error: '+err);
        });

    const cliente = await Cliente.findById(cotizacion.id_cliente)
        .catch(err=>{
            console.log(err);
            return('Ha habido un error: '+err);
        });
    
    
    const aux = await Item.find()
        .catch(err=>{
            console.log(err);
            return('Ha habido un error: '+err);
        });
    
    const items = [];
        aux.map((a)=>{
            if((a.id_doc == id) && (a.tipo == 'ticket')){
                items.push(a);
            }
        });    

    const data = {
        cotizacion: cotizacion,
        usuario: usuario,
        empresa: empresa,
        cliente: cliente,
        items: items
    }

    return data;
}

function cuadradoNegro(doc, x, y, w, h, c){
    doc
        .lineJoin('bevel')
        .rect(x, y, w, h)
        .fillOpacity(0.5)
        .fillAndStroke(c, "black")
}

function cuadradoItem(doc, x, y, w, h, index, c){
    if(index%2 == 0){
        var color='white';
    }else{
        var color=c;

    }

    doc
        .lineJoin('bevel')
        .rect(x, y, w, h)
        .fillOpacity(.10)
        .fillAndStroke(color, "black")
}

module.exports = generador;