import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import Titulo from '../components/Titulo'
import backend from '../constants';
import sweetalert2 from 'sweetalert2';
import fileDownload from 'js-file-download';

import '../styles/VerCotizacion.css';

import imgPlantillaCotizacion1 from '../assets/plantilla-cotizacion-1.jpg';
import imgPlantillaCotizacion2 from '../assets/plantilla-cotizacion-2.jpg';
import imgPlantillaCotizacion3 from '../assets/plantilla-cotizacion-3.jpg';
import imgPlantillaCotizacion4 from '../assets/plantilla-cotizacion-4.jpg';
import { PhotoProvider, PhotoView } from 'react-image-previewer';
import Label from '../components/Label';

const VerCotizacion = () => {
    const {id, borrable} = useParams();
    
    const [cotizacion, setCotizacion] = useState({});
    const [cliente, setCliente] = useState({});
    const [items, setItems] = useState([]);

    useEffect(()=>{
        const getCotizacion = async()=>{
            const {data} = await axios.get(backend()+'/api/cotizacion/'+id)
            .catch((err)=>{
                console.log(err)
                sweetalert2.fire({
                    icon: 'error',
                    iconColor: 'red',
                    title: 'ERROR: '+err.message,
                    text: 'Ha ocurrido un error al conectar con el servidor. Verifique su conexion a internet',
                    color: 'black',
                    footer: '<p>Si el problema persiste reporte el error al correo: <a href="mailto:cotiapp.dev@gmail.com">cotiapp.dev@gmail.com</a></p>',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#F5305C'
                })
      
                return;
              })
            
              
            
            setCotizacion(data);
            const res = await axios.get(backend()+'/api/cliente/'+data.id_cliente);
            setCliente(res.data);
        }
        
        
        const getItems = async()=>{
            const {data} = await axios.get(backend()+'/api/item/')
            .catch((err)=>{
                console.log(err)
                sweetalert2.fire({
                    icon: 'error',
                    iconColor: 'red',
                    title: 'ERROR: '+err.message,
                    text: 'Ha ocurrido un error al conectar con el servidor. Verifique su conexion a internet',
                    color: 'black',
                    footer: '<p>Si el problema persiste reporte el error al correo: <a href="mailto:cotiapp.dev@gmail.com">cotiapp.dev@gmail.com</a></p>',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#F5305C'
                })
      
                return;
              })
            
            const aux = [];
            data.map(d=>{
                if(d.tipo === 'cotizacion' && d.id_doc === id)
                    aux.push(d);
            })

            setItems(aux);
        }

        if(cotizacion._id === undefined){
            getCotizacion();
            getItems();
        }
    })

    const botonEliminar = ()=>{
        if(borrable === 'true')
            return <button 
                style={{width: '150px'}} 
                className='boton1' 
                id='btnEliminar' 
                onClick={eliminar}
            >Eliminar</button>

    }

    const eliminar = async()=>{
        sweetalert2.fire({
            title: '¿Estas seguro que quieres borrar esta cotización?',
            text: 'Esta acción es permanente',
            color: 'black',
            icon: 'warning',
            iconColor: 'red',
            showCancelButton: true,
            confirmButtonColor: '#F5305C',
            cancelButtonColor: '#04BEC7',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
          }).then(async(result) => {
            if (result.isConfirmed) {
              document.getElementById('btnEliminar').disabled = true;
              document.getElementById('btnEnviar').disabled = true;
              document.getElementById('btnDescargar').disabled = true;

              await axios.delete(backend()+'/api/cotizacion/'+id)
              .then(window.location.href = '/home')

            }
          })
    }

    const descargar = async()=>{
        const Toast = sweetalert2.mixin({
            toast: true,
            position: 'bottom-right',
            iconColor: 'white',
            customClass: {
              popup: 'colored-toast'
            },
            showConfirmButton: false,
            showCloseButton: true,
            timer: 5000,
            timerProgressBar: true
          })
          
          Toast.fire({
            icon: 'info',
            title: 'La descarga comenzará en un momento, por favor espere'
          })
        
        //GENERAR
        const {data} = await axios.post(backend()+'/descargar/cotizacion/'+id);
        if(data.exito){
                let {data} = await axios.get(backend()+'/descargar/cotizacion/'+id, {
                    responseType: 'blob'
                });

                console.log(data)

                await fileDownload(data, id+'.pdf');
                await axios.delete(backend()+'/descargar/cotizacion/'+id);
        }else{
            Toast.fire({
                icon: 'error',
                title: 'Ha ocurrido un error con la descarga, favor de intentarlo nuevamente'
              })
        }
    }

    const enviar = async()=>{
        const {data} = await axios.post(backend()+'/api/enviar/cotizacion/'+id);
        if(data.exito){
            await sweetalert2.fire({
                icon: 'success',
                iconColor: 'green',
                title: 'Cotización enviada al cliente',
                text: 'La cotización se envio correctamente',
                color: 'black',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#F5305C',
                
            }).then((result)=>window.location.href = '/cotizacion/'+id+'/false');
        }else{
            sweetalert2.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'ERROR: '+data.message,
                text: 'Ha ocurrido un error al enviar la cotización',
                color: 'black',
                footer: '<p>Si el problema persiste reporte el error al correo: <a href="mailto:cotiapp.dev@gmail.com">cotiapp.dev@gmail.com</a></p>',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#F5305C'
            })
        }
    }

    const linkVolver = ()=>{
        if(borrable === 'false')
            return <Link 
                    to='/lista/cotizaciones'
                    className='link-volver'
                >
                    Volver
                </Link>
    }

    const imgPlantilla = ()=>{
        switch(cotizacion.plantilla){
            case 1: return imgPlantillaCotizacion1;
            case 2: return imgPlantillaCotizacion2;
            case 3: return imgPlantillaCotizacion3;
            case 4: return imgPlantillaCotizacion4;
            default: break;
        }
    }

    const itemTabla = (i, index)=>{
        if(index%2===1 )
            return(
                <tr>
                    <td style={{backgroundColor: cotizacion.color+'25'}} className='td-item-index table-item-index'>{index+1}</td>
                    <td style={{backgroundColor: cotizacion.color+'25'}} className='table-item-cant'>{i.cantidad}</td>
                    <td style={{backgroundColor: cotizacion.color+'25'}} className='table-item-cant'>{i.unidad}</td>
                    <td style={{backgroundColor: cotizacion.color+'25'}} className='table-item-art'>{i.articulo}</td>
                    <td style={{backgroundColor: cotizacion.color+'25'}} className='table-item-desc'>{i.descripcion}</td>
                    <td style={{backgroundColor: cotizacion.color+'25'}} className='table-item-cant'>${i.precioUnitario}</td>
                    <td style={{backgroundColor: cotizacion.color+'25'}} className='table-item-cant'>${i.importe}</td>

                </tr>
            )
        else
            return(
                <tr>
                    <td className='td-item-index table-item-index'>{index+1}</td>
                    <td className='table-item-cant'>{i.cantidad}</td>
                    <td className='table-item-cant'>{i.unidad}</td>
                    <td className='table-item-art'>{i.articulo}</td>
                    <td className='table-item-desc'>{i.descripcion}</td>
                    <td className='table-item-cant'>${i.precioUnitario}</td>
                    <td className='table-item-cant'>${i.importe}</td>
                </tr>
            )
    }

    if(items.length === 0)
        return <Loading/>
    else
        return (
            <div className='div-ver-cotizacion-main'>
                {linkVolver()}
                <Titulo>Cotización #{id}<br/><small>Folio #{cotizacion.folio}</small></Titulo>

                <table>
                    <tr>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='borde-abajo-none'>Nombre</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='borde-abajo-none'>Empresa</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='borde-abajo-none'>Correo</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='borde-abajo-none'>Telefono</th>
                    </tr>

                    <tr>
                        <th style={{width: '20%'}} className='borde-abajo-none'>{cliente.nombre}</th>
                        <th style={{width: '20%'}} className='borde-abajo-none'>{cliente.empresa}</th>
                        <th style={{width: '40%'}} className='borde-abajo-none'>{cliente.correo}</th>
                        <th style={{width: '20%'}} className='borde-abajo-none'>{cliente.telefono}</th>
                    </tr>
                </table>

                <table className='borde-abajo-none borde-arriba-none'>
                    <tr>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='table-item-index borde-arriba-none'><span style={{opacity: '100%'}}>#</span></th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='table-item-cant borde-arriba-none'>Cantidad</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='table-item-cant borde-arriba-none'>Unidad</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='table-item-art borde-arriba-none'>Articulo</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='table-item-desc borde-arriba-none'>Descripción</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='table-item-cant borde-arriba-none'>Precio Neto</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='table-item-cant borde-arriba-none'>Precio Total</th>

                    </tr>
                    {
                        items.map((i, index)=>{
                            return (itemTabla(i, index))
                        })
                    }
                </table>
                <table className='borde-arriba-none'>
                    <tr>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='borde-arriba-none'>Subtotal</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='borde-arriba-none'>IVA</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='borde-arriba-none'>Descuento</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='borde-arriba-none'>Importe adicional</th>
                        <th style={{backgroundColor: cotizacion.color+'80'}} className='borde-arriba-none'>Total</th>
                    </tr>

                    <tr>
                        <th style={{width: '22%'}}>${cotizacion.subtotal} MXN</th>
                        <th style={{width: '12%'}}>{cotizacion.iva}% (${cotizacion.importeIva})</th>
                        <th style={{width: '22%'}}>${cotizacion.descuento} MXN</th>
                        <th style={{width: '22%'}}>${cotizacion.adicional} MXN</th>
                        <th style={{width: '22%'}}>${cotizacion.total} MXN</th>
                    </tr>
                </table>

                <div className='div-btns-ver-cotizacion'>
                    <button 
                        style={{width: '150px'}} 
                        className='boton1' 
                        id='btnDescargar'
                        onClick={descargar}
                    >Descargar</button>
                    {botonEliminar()}
                    <button 
                        style={{width: '150px'}}  
                        className='boton1' 
                        id='btnEnviar'
                        onClick={enviar}
                    >Enviar al cliente</button>

                </div>

                <br/><br/>
                <Label><big>Plantilla {cotizacion.plantilla}</big></Label>
                <PhotoProvider>
                    <PhotoView src={imgPlantilla()}>
                        <img src={imgPlantilla()} className='img-ver-cotizacion-plantilla' alt=''/>
                    </PhotoView>
                </PhotoProvider>
                <br/>
            </div>
        )
}

export default VerCotizacion