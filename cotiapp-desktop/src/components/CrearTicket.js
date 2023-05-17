import React, { useEffect, useState } from 'react';
import axios from 'axios';
import sweetalert2 from 'sweetalert2';
import backend from '../constants';
import Label from '../components/Label'
import { PhotoProvider, PhotoView } from 'react-image-previewer';
import BarLoader from "react-spinners/PacmanLoader";

import '../styles/CrearCotizacion.css'

import imgPlantillaCotizacion1 from '../assets/plantilla-ticket-1.jpg';
import imgPlantillaCotizacion2 from '../assets/plantilla-ticket-2.jpg';
import imgPlantillaCotizacion3 from '../assets/plantilla-ticket-3.jpg';
import imgPlantillaCotizacion4 from '../assets/plantilla-ticket-4.jpg';

const items = [{}];

const CrearTicket = ({display}) => {

    const [usuario, setUsuario] = useState({});
    const [clientes, setClientes] = useState([]);
    const [idCliente, setIdCliente] = useState('');
    const [empresa, setEmpresa] = useState({});
    const [cotizacion, setCotizacion] = useState({});
    const [seletedCliente, setSelectedCliente] = useState(0);
    const [seletedPlantilla, setSelectedPlantilla] = useState(1);

    const getEmpresa = async()=>{
        const {data} = await axios.get(backend()+'/api/empresa/'+usuario.id_empresa)
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
        setEmpresa(data);

        setCotizacion({
            condiciones: data.condiciones,
            footer: data.footer,
            color: data.color,
            iva: 16,
            descuento: 0,
            adicional: 0,
            pago: 'Efectivo'
        })
      }

    useEffect(()=>{
        const setValues = ()=>{
            const select = document.getElementById('cliente');
            const plantilla1 = document.getElementById('plantilla1');
            const plantilla2 = document.getElementById('plantilla2');
            const plantilla3 = document.getElementById('plantilla3');
            const plantilla4 = document.getElementById('plantilla4');

            if(select !== null){
                select.selectedIndex = seletedCliente;
            }

            if((plantilla1 !== null) && (plantilla2 !== null) && (plantilla3 !== null) && (plantilla4 !== null))

            switch(seletedPlantilla){
                case 1: plantilla1.checked = true;
                    break;
                case 2: plantilla2.checked = true;
                    break;
                case 3: plantilla3.checked = true;
                    break;
                case 4: plantilla4.checked = true;
                    break;
                default: break;
            }
        }

        if(display !== 'hidden')
            setValues();
    })

    useEffect(()=>{
      const getUsuario = async()=>{
        const {data} = await axios.get(backend()+'/api/usuario/'+localStorage.getItem('id'));
        setUsuario(data);
      }


      const getClientes = async()=>{
        const {data} = await axios.get(backend()+'/api/cliente');
        var aux = [];
        data.map((d)=>{
            if(d.id_usuario === usuario._id && d.activo){
                aux.push(d);
            }
        })
        setClientes(aux);
        if(idCliente === '')
            setIdCliente(aux[0]._id);
      }

        if(usuario._id === undefined){
            getUsuario();
        }else{
            if(usuario._id !== undefined && empresa._id === undefined){
                getEmpresa();    
            }
            getClientes();
        }            
      
    });


    const submit = async(e)=>{
        e.preventDefault();

        if(clientes.length === 0){
            sweetalert2.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'ERROR: Cliente no seleccionado',
                text: 'Ha ocurrido un error al crear el ticket: No tienes ningun cliente agregado, crea uno para continuar',
                color: 'black',
                footer: '<p>Si el problema persiste reporte el error al correo: <a href="mailto:cotiapp.dev@gmail.com">cotiapp.dev@gmail.com</a></p>',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#F5305C'
            })
        }else{
            document.getElementById('btn1').disabled = true;

            var subtotal = 0;
            items.map((i, index)=>{
                let importe = parseFloat(i.precioUnitario)*parseFloat(i.cantidad)
                items[index].importe = importe;

                subtotal += importe;
            })

            var importeIva = subtotal*cotizacion.iva/100;
            const total = (subtotal + importeIva - parseFloat(cotizacion.descuento) + parseFloat(cotizacion.adicional)).toFixed(2);

            const date = new Date();
            const fecha = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
            const folio = '000';

            const formData = {
                id_usuario: usuario._id,
                id_cliente: idCliente,
                color: cotizacion.color,
                folio: folio,
                fecha: fecha,
                condiciones: cotizacion.condiciones,
                subtotal: subtotal,
                iva: cotizacion.iva,
                importeIva: importeIva,
                descuento: cotizacion.descuento,
                adicional: cotizacion.adicional,
                total: total,
                footer: cotizacion.footer,
                plantilla: seletedPlantilla,
                pago: cotizacion.pago
            }

            console.log(formData);
            console.log(items)

            var {data} = await axios.post(backend()+'/api/ticket', formData)

            if(data._id === undefined){
                console.log(data)
                sweetalert2.fire({
                    icon: 'error',
                    iconColor: 'red',
                    title: 'ERROR: '+data.name,
                    text: 'Ha ocurrido un error al crear el ticket: '+data.message,
                    color: 'black',
                    footer: '<p>Si el problema persiste reporte el error al correo: <a href="mailto:cotiapp.dev@gmail.com">cotiapp.dev@gmail.com</a></p>',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#F5305C'
                })
            }else{
                const id_doc = data._id;
                const tipo = 'ticket';

                const cantidad = [];
                const unidad = [];
                const articulo = [];
                const descripcion = [];
                const precioUnitario = [];
                const importe = [];
                const doc = [];
                const tip = [];
        
                items.map((i)=>{
                    cantidad.push(i.cantidad);
                    unidad.push(i.unidad);
                    articulo.push(i.articulo);
                    descripcion.push(i.descripcion);
                    precioUnitario.push(i.precioUnitario);
                    importe.push(i.importe);
                    doc.push(id_doc);
                    tip.push(tipo);
                })

                
                await axios.post(backend()+'/api/item', {
                    cantidad: cantidad,
                    unidad: unidad,
                    articulo: articulo,
                    descripcion: descripcion,
                    id_doc: doc,
                    tipo: tip,
                    precioUnitario: precioUnitario,
                    importe: importe
                }).then((data)=>{
                    window.location.href = '/ticket/'+id_doc+'/true';
                })
            }        
            document.getElementById('btn1').disabled = false;
        }
    }

    const seleccionarCliente = (e)=>{
        const index = e.target.selectedIndex;
        setSelectedCliente(index);
        setIdCliente(clientes[index]._id);
    }

    const cambiarValor = (e)=>{
        const {name, value} = e.target;
        setCotizacion({...cotizacion, [name]: value});
    }

    const cambiarValorItem = (e, index)=>{
        const {name, value} = e.target;
        items[index][name] = value;
    }

    const agregarItem = ()=>{
        items.push({

        });
    }

    const eliminarItem = (index)=>{
        if(items.length === 1){
            const Toast = sweetalert2.mixin({
                toast: true,
                position: 'bottom-right',
                iconColor: 'white',
                customClass: {
                  popup: 'colored-toast'
                },
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            })

            Toast.fire({
                icon: 'warning',
                title: `No puedes borrar el unico articulo`
            })
        }else{
            const Toast = sweetalert2.mixin({
                toast: true,
                position: 'bottom-right',
                iconColor: 'white',
                customClass: {
                  popup: 'colored-toast'
                },
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            })
    
            items.splice(index, 1);
        
            Toast.fire({
                icon: 'success',
                title: `Articulo #${index+1} eliminado`
            })
    
        }
    }

    if(empresa._id === undefined)
        return <div className={'div-loading-cotizacion-main '+display}>
            <BarLoader
            color="#ffffff"
            height={7}
            loading
            width={200}
            className='bar-loader'
            />        
        </div>

    else if(display === 'hidden')
        return <div></div>
    else
        return (
            <div className={'div-crear-cotizacion-main '+display}>
                <h1>Crear Ticket</h1>
                <form onSubmit={submit} className='form-cotizacion'>
                

                    <div className='div-cotizacion-grande'>
                        <Label htmlFor='cliente'>Seleccione un cliente:</Label>
                        <select
                            className='select-cotizacion'
                            id='cliente'
                            onChange={seleccionarCliente}
                            >
                            {
                                clientes.map((c)=>{
                                    return <option>{c.nombre} de {c.empresa}</option>
                                })
                            }
                        </select>
                    </div>



                    <br/><br/>
                    <Label><big>Articulos:</big></Label>

                    {
                        items.map((i, index)=>{
                            return <div className='div-item-container'>
                                <Label>Articulo {index+1}: </Label>

                                <div className='div-items-line-1'>
                                    <div className='div-item-cant'>
                                        <Label>Cant.</Label>
                                        <input
                                            type='number'
                                            className='input-item'
                                            name='cantidad'
                                            placeholder='Cantidad'
                                            value={i.cantidad}
                                            onChange={(e)=>cambiarValorItem(e, index)}

                                            required
                                        />
                                    </div>

                                    <div className='div-item-cant'>
                                        <Label>Unidad</Label>
                                        <input
                                            type='text'
                                            className='input-item'
                                            name='unidad'
                                            placeholder='Unidad'
                                            maxLength='5'
                                            value={i.unidad}
                                            onChange={(e)=>cambiarValorItem(e, index)}


                                            required
                                        />
                                    </div>

                                    <div className='div-item-art'>
                                        <Label>Articulo</Label>
                                        <input
                                            type='text'
                                            className='input-item'
                                            name='articulo'
                                            placeholder='Articulo'
                                            value={i.articulo}
                                            onChange={(e)=>cambiarValorItem(e, index)}


                                            required
                                        />
                                    </div>

                                    <div className='div-item-pre'>
                                        <Label>P. Unitario</Label>
                                        <input
                                            type='number'
                                            className='input-item'
                                            name='precioUnitario'
                                            placeholder='Precio Unitario'
                                            value={i.precioUnitario}
                                            onChange={(e)=>cambiarValorItem(e, index)}


                                            required
                                        />
                                    </div>
                                </div>
                                <div className='div-items-line-2'>
                                    <textarea
                                        className='text-area-coti'
                                        placeholder='Descripción del articulo'
                                        name='descripcion'
                                        value={i.descripcion}
                                        onChange={(e)=>cambiarValorItem(e, index)}

                                    >
                                    </textarea>
                                </div>

                                {
                                    <input className='boton1 right' onClick={(e)=>eliminarItem(index)} type='reset' value='Eliminar'/>
                                }
                            </div>
                        })
                    }
                    <input
                        type='reset'
                        className='boton1'
                        value='Agregar Articulo'
                        onClick={agregarItem}
                    />

                    
                    <br/>



                    <div className='div-input-editar-empresa-doble'>


                        <div className='div-input-editar-empresa-item'>
                            <Label>IVA (%):</Label>
                            <input
                                type='number'
                                className='input-editar-empresa-completo'
                                value={cotizacion.iva}
                                placeholder='IVA (%)'
                                name='iva'
                                required

                                onChange={cambiarValor}
                            />

                        </div>

                        <div className='div-input-editar-empresa-item'>
                            <Label>Forma de pago:</Label>
                            <input
                                className='input-editar-empresa-completo'
                                type='text'
                                value={cotizacion.pago}
                                name='pago'
                                placeholder='Forma de pago'
                                required

                                onChange={cambiarValor}
                            />
                        </div>

                    </div>

                <div className='div-input-editar-empresa-doble'>
                    <div className='div-input-editar-empresa-item'>
                        <Label>Importe adicional ($):</Label>
                        <input
                            className='input-editar-empresa-completo'
                            type='number'
                            value={cotizacion.adicional}
                            name='adicional'
                            placeholder='Importe adicional ($)'
                            required

                            onChange={cambiarValor}
                        />
                    </div>

                    <div className='div-input-editar-empresa-item'>
                        <Label>Descuento ($):</Label>
                        <input
                            className='input-editar-empresa-completo'
                            type='number'
                            value={cotizacion.descuento}
                            name='descuento'
                            placeholder='Descuento ($)'
                            required

                            onChange={cambiarValor}
                        />
                        </div>
                </div>




                    <div className='div-input-cotizacion'>
                        <Label>Condiciones de Servicio:</Label>
                        <textarea
                            className='text-area-cotizacion'
                            value={cotizacion.condiciones}
                            name='condiciones'
                            placeholder='Condiciones de Servicio'
                            required

                            onChange={cambiarValor}
                        />
                    </div>

                    <div className='div-input-cotizacion'>
                        <Label>Footer del ticket (Parte de hasta abajo del documento):</Label>
                        <textarea
                            className='text-area-cotizacion'
                            value={cotizacion.footer}
                            name='footer'
                            placeholder='Footer del ticket/cotización'
                            required

                            onChange={cambiarValor}
                        />
                    </div>

                    <div className='div-input-color'>
                    <Label>Color Principal: </Label>
                    <input
                        className='input-color'
                        type='color'
                        name='color'
                        value={cotizacion.color}
                        required

                        onChange={cambiarValor}
                        />
                    </div>

                    <br/>
                    <Label>Seleccione la plantilla del ticket:</Label>

                    <div className='div-radio-cotizacion'>

                        <div className='div-radio-item'>
                            <input
                                className='cb'
                                type='radio'
                                id='plantilla1'
                                name='plantilla'
                                value='1'
                                onChange={()=>setSelectedPlantilla(1)}

                                required

                            />
                            <label htmlFor='plantilla1'>
                                <img src={imgPlantillaCotizacion1} className='img-cotizacion-plantilla' alt='Cargando...'/>
                            </label>
                            <PhotoProvider>
                                <PhotoView src={imgPlantillaCotizacion1}>
                                    <p className='p-cotizacion'>Ver</p>
                                </PhotoView>
                            </PhotoProvider>
                        </div>

                        <div className='div-radio-item'>
                            <input
                                className='cb'
                                type='radio'
                                id='plantilla2'
                                name='plantilla'
                                value='2'
                                onChange={()=>setSelectedPlantilla(2)}

                                required
                            />
                            <label htmlFor='plantilla2'>
                                <img src={imgPlantillaCotizacion2} className='img-cotizacion-plantilla' alt='Cargando...'/>
                            </label>
                            <PhotoProvider>
                                <PhotoView src={imgPlantillaCotizacion2}>
                                    <p className='p-cotizacion'>Ver</p>
                                </PhotoView>
                            </PhotoProvider>
                        </div>

                        <div className='div-radio-item'>
                            <input
                                className='cb'
                                type='radio'
                                id='plantilla3'
                                name='plantilla'
                                value='3'
                                onChange={()=>setSelectedPlantilla(3)}

                                required
                            />
                            <label htmlFor='plantilla3'>
                                <img src={imgPlantillaCotizacion3} className='img-cotizacion-plantilla' alt='Cargando...'/>
                            </label>
                            <PhotoProvider>
                                <PhotoView src={imgPlantillaCotizacion3}>
                                    <p className='p-cotizacion'>Ver</p>
                                </PhotoView>
                            </PhotoProvider>
                        </div>

                        <div className='div-radio-item'>
                            <input
                                className='cb'
                                type='radio'
                                id='plantilla4'
                                name='plantilla'
                                value='4'
                                onChange={()=>setSelectedPlantilla(4)}

                                required
                            />
                            <label htmlFor='plantilla4'>
                                <img src={imgPlantillaCotizacion4} className='img-cotizacion-plantilla' alt='Cargando...'/>
                            </label>
                            <PhotoProvider>
                                <PhotoView src={imgPlantillaCotizacion4}>
                                    <p className='p-cotizacion'>Ver</p>
                                </PhotoView>
                            </PhotoProvider>
                        </div>


                    </div>

                    
                    <br/>
                    <br/>
                    <button className='boton1' id='btn1'>Crear Ticket</button>

                    <br/>                
                    <br/>


                </form>
            </div>
        )
}

export default CrearTicket