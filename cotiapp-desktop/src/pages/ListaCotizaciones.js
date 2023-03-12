import React, { useEffect, useState } from 'react';
import axios from 'axios';
import sweetalert2 from 'sweetalert2';
import backend from '../constants';
import Loading from '../components/Loading';
import Titulo from '../components/Titulo';

import '../styles/ListaClientes.css'

import imgPlantillaCotizacion1 from '../assets/plantilla-cotizacion-1.jpg';
import imgPlantillaCotizacion2 from '../assets/plantilla-cotizacion-2.jpg';
import imgPlantillaCotizacion3 from '../assets/plantilla-cotizacion-3.jpg';
import imgPlantillaCotizacion4 from '../assets/plantilla-cotizacion-4.jpg';
import ImgCrearCotizacion from '../assets/ImgCrearCotizacion.jpg';
import { PhotoProvider, PhotoView } from 'react-image-previewer';

const ListaCotizaciones = () => {
    const [usuario, setUsuario] = useState({});
    const [cotizaciones, setCotizaciones] = useState([]);
    const [clientes, setClientes] = useState([]);


    const getclientes = async()=>{
        const {data} = await axios.get(backend()+'/api/cliente/')
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
          });
  
          const aux = [];
          data.map((d)=>{
              if(d.id_usuario === usuario._id){
                  aux.push(d);
              }
          })
  
          setClientes(aux);
      }

    const getCotizaciones = async()=>{
      const {data} = await axios.get(backend()+'/api/cotizacion/')
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
        });

        const aux = [];
        data.map((d)=>{
            if(d.id_usuario === usuario._id){
                aux.push(d);
            }
        })


        setCotizaciones(aux);
        getclientes();
    }
    
    useEffect(()=>{
      const getUsuario = async()=>{
        const {data} = await axios.get(backend()+'/api/usuario/'+localStorage.getItem('id'))
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
        setUsuario(data);
      }

      if(usuario._id === undefined){
        getUsuario();
      }else{        
        if(cotizaciones.length === 0){
          getCotizaciones();
        }
      }
    });

    const itemCotizacion = (c)=>{
        var cliente = {};
        clientes.map((cli)=>{
            if(c.id_cliente === cli._id){
                cliente = cli;
            }
        })

        return <div>
            <p className='p-lista-clientes2'><span className='negritas'>Cliente:</span> {cliente.nombre} </p>
            <p className='p-lista-clientes2'><span className='negritas'>Empresa:</span> {cliente.empresa} </p>
        </div>
    }

    const noCoti = ()=>{
      if(cotizaciones.length === 0)
        return <p 
                style={{textAlign: 'center'}}
              >
                No tienes ninguna cotización registrado
                <br/>
                Para hacer una cotizacion ve a la pantalla principal, llena el formulario en la pestaña "Cotización"
                <img 
                  alt='' 
                  src={ImgCrearCotizacion} 
                  style={{
                    width: '80%', 
                    cursor: 'pointer', 
                    display: 'block', 
                    margin: 'auto', 
                    marginTop: '20px'}} 
                  onClick={()=>{
                    window.location.href = '/home'
                  }}
                />
              </p>
    }

    const seleccionarFoto = (c)=>{
      switch (c.plantilla){
        case 1: return imgPlantillaCotizacion1;
        case 2: return imgPlantillaCotizacion2;
        case 3: return imgPlantillaCotizacion3;
        case 4: return imgPlantillaCotizacion4;
        default: break;
      }
    }

    if(usuario._id === undefined){
        return <Loading/>
    }else{
        return (
            <div className='div-lista-cliente-main'>
                <Titulo>Mis Cotizaciones</Titulo>
                {noCoti()}
                {
                    cotizaciones.map((c)=>{
                        return <div className='div-lista-clientes-cliente-2'>
                          <div className='div-lista-clientes-cliente-txt'>
                            <h3 className='h3-lista-clientes2'><span className='negritas'>ID:</span> {c._id} </h3>
                            <p className='p-lista-clientes2'><span className='negritas'>Folio:</span> {c.folio} </p>
                            {
                                itemCotizacion(c)
                            }
                            <br/>
                            <p className='p-lista-clientes2'><span className='negritas'>Fecha:</span> {c.fecha} </p>
                            <button className='boton1 margin-arritop' onClick={()=>{window.location.href = '/cotizacion/'+c._id+'/false'}}>Mostrar</button>
                          </div>

                          <div className='div-lista-clientes-cliente-img'>
                            <PhotoProvider>
                              <PhotoView src={seleccionarFoto(c)}>
                                <img src={seleccionarFoto(c)} alt='' className='lista-clientes-cliente-img'/>
                              </PhotoView>
                            </PhotoProvider>
                          </div>
                        </div>
                      
                    })
                }
            </div>
        )
    }
}

export default ListaCotizaciones