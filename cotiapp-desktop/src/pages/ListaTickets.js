import React, { useEffect, useState } from 'react';
import axios from 'axios';
import sweetalert2 from 'sweetalert2';
import backend from '../constants';
import Loading from '../components/Loading';
import Titulo from '../components/Titulo';
import { PhotoProvider, PhotoView } from 'react-image-previewer';
import Switch from '@mui/material/Switch';


import '../styles/ListaClientes.css'

import imgPlantillaCotizacion1 from '../assets/plantilla-cotizacion-1.jpg';
import imgPlantillaCotizacion2 from '../assets/plantilla-cotizacion-2.jpg';
import imgPlantillaCotizacion3 from '../assets/plantilla-cotizacion-3.jpg';
import imgPlantillaCotizacion4 from '../assets/plantilla-cotizacion-4.jpg';
import ImgCrearCotizacion from '../assets/ImgCrearCotizacion.jpg';
import imgFiltro from '../assets/filtro.png';

const ListaTickets = () => {
    const [filtro, setFiltro] = useState('none');
    const [usuario, setUsuario] = useState({});
    const [cotizaciones, setCotizaciones] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [valorInicial, setValorInicial] = useState([]);
    const [cbIdChecked, setCbIdChecked] = useState('true')


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
          const aux2 = [];
          data.map((d)=>{
              if(d.id_usuario === usuario._id){
                  aux.push(d);
              }

              if((d.id_usuario === usuario._id) && (d.activo)){
                aux2.push(d);
              }
          })
  
          setClientes(aux);
          setClientesFiltrados(aux2);
      }

    const getCotizaciones = async()=>{
      const {data} = await axios.get(backend()+'/api/ticket/')
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
        setValorInicial(aux);
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



    const id = (e)=>{
      const cbFolio = document.getElementById('cb-folio').checked;

      if(cbFolio){
        if(e.target.id === 'cb-id'){
          setCbIdChecked(!cbIdChecked)
        }
      }else {
        setCbIdChecked(true)
      }

      buscar()
    }

    const buscar = ()=>{
      const b = document.getElementById('busqueda').value;
      const cbId = document.getElementById('cb-id').checked;
      const cbFolio = document.getElementById('cb-folio').checked;
      const ordenar = document.getElementById('switch-asc-desc').checked;
      document.getElementById('cliente').selectedIndex = 0;

      var aux = [];

      if(b === ''){
        setCotizaciones(valorInicial);
      }else{
        valorInicial.map((v)=>{
          if((cbId) && (v._id.toLowerCase().search(b.toLowerCase()) >= 0)){
            aux.push(v);
          }else if((cbFolio) && (v.folio.search(b) >= 0)){
            aux.push(v);
          }
        })

        if(aux.length === 0){
          aux = [1]
        }

        if(ordenar)
          setCotizaciones(aux.reverse())
        else
          setCotizaciones(aux)
      }
    }

    const buscarCliente = (e)=>{
      const {value} = e.target;
      const ordenar = document.getElementById('switch-asc-desc').checked;

      var aux = [];
      if(value === ''){
        setCotizaciones(valorInicial);
        buscar();
      }else{
        valorInicial.map(v=>{

          if(v.id_cliente === value){
            aux.push(v);
          }
        })

        if(aux.length === 0){
          aux = [1]
        }

        if(ordenar)
          setCotizaciones(aux.reverse())
        else
          setCotizaciones(aux)
      }
    }

    const cambiarSwitch = ()=>{
      const cliente = document.getElementById('cliente').value;

      if(cliente === ''){
        buscar()
      }else{
        buscarCliente()
      }
    }


    if(usuario._id === undefined){
        return <Loading/>
    }else if(cotizaciones[0]===1){
      return (
        <div className='div-lista-cliente-main'>
            <Titulo>Mis Tickets</Titulo>


            <div className='div-busqueda'>
              <h2 className='h3-busqueda'>Buscar</h2>
              
              <div className='div-input-busqueda'>
                <input
                  className='input-busqueda'
                  placeholder='Ingrese los valores seleccionados del ticket a buscar'
                  type='search'
                  onChange={buscar}
                  id='busqueda'
                />
                <button className='btn-fitro-busqueda' onClick={()=>{
                  filtro === 'none' ? setFiltro('flex') : setFiltro('none')
                }}>
                  <img className='img-btn-filtro' src={imgFiltro} alt='Filtrar' />
                  <p className='p-filtar'>Filtrar</p>
                </button>
              </div>
            
            
              <div style={{display: filtro}} className='div-opciones-filtro'>
                <div className='div-opciones-items'>
                  <div className='div-opciones-filtro-izq'>
                    <p className='p-filtro'>Filtrar por:</p>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                      <label>ID</label>
                      <input
                        type='checkbox'
                        className='input-filtro-cb'
                        id='cb-id'
                        onChange={id}
                        checked={cbIdChecked}
                      />
                    </div>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                      <label>Folio</label>
                      <input
                        type='checkbox'
                        className='input-filtro-cb'
                        id='cb-folio'
                        onChange={id}
                      />
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                      <label>Cliente</label>
                      <select id='cliente' onChange={buscarCliente} style={{marginLeft: '5px', marginTop: '2px'}}>
                        <option value=''>Todos</option>
                        {
                          clientesFiltrados.map((c)=>{
                            return <option value={c._id}>{c.nombre} de {c.empresa}</option>
                          })
                        }
                      </select>
                    </div>
                    



                    
                  </div>

                  <div className='div-opciones-filtro-der'>
                    <p className='p-filtro'>Ordenar:</p>

                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        <p className='p-filtro' style={{marginTop: '3px', position: 'absolute'}}>Por fecha:</p>
                        
                        <div style={{display: 'flex', marginTop: '15px'}}>
                          <label style={{marginTop: '7.5px'}}>Descendente</label>
                          <Switch
                            id='switch-asc-desc'
                            onChange={cambiarSwitch}
                          />
                          <label style={{marginTop: '7.5px'}}>Ascendente</label>
                        </div>

                      </div>

                  </div>
                </div>


              </div>
              
            </div>

            {noCoti()}
            <p style={{textAlign: 'center'}}>
                No se encontró ninguna coincidencia</p>
        </div>
    )
    }else{
        return (
            <div className='div-lista-cliente-main'>
                <Titulo>Mis Tickets</Titulo>


                <div className='div-busqueda'>
                  <h2 className='h3-busqueda'>Buscar</h2>
                  
                  <div className='div-input-busqueda'>
                    <input
                      className='input-busqueda'
                      placeholder='Ingrese los valores seleccionados del ticket a buscar'
                      type='search'
                      onChange={buscar}
                      id='busqueda'
                    />
                    <button className='btn-fitro-busqueda' onClick={()=>{
                      filtro === 'none' ? setFiltro('flex') : setFiltro('none')
                    }}>
                      <img className='img-btn-filtro' src={imgFiltro} alt='Filtrar' />
                      <p className='p-filtar'>Filtrar</p>
                    </button>
                  </div>
                
                
                  <div style={{display: filtro}} className='div-opciones-filtro'>
                    <div className='div-opciones-items'>
                      <div className='div-opciones-filtro-izq'>
                        <p className='p-filtro'>Filtrar por:</p>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                          <label>ID</label>
                          <input
                            type='checkbox'
                            className='input-filtro-cb'
                            id='cb-id'
                            onChange={id}
                            checked={cbIdChecked}
                          />
                        </div>
                        
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                          <label>Folio</label>
                          <input
                            type='checkbox'
                            className='input-filtro-cb'
                            id='cb-folio'
                            onChange={id}
                          />
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                          <label>Cliente</label>
                          <select id='cliente' onChange={buscarCliente} style={{marginLeft: '5px', marginTop: '2px'}}>
                            <option value=''>Todos</option>
                            {
                              clientesFiltrados.map((c)=>{
                                return <option value={c._id}>{c.nombre} de {c.empresa}</option>
                              })
                            }
                          </select>
                        </div>
                        



                        
                      </div>

                      <div className='div-opciones-filtro-der'>
                        <p className='p-filtro'>Ordenar:</p>

                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            <p className='p-filtro' style={{marginTop: '3px', position: 'absolute'}}>Por fecha:</p>
                            
                            <div style={{display: 'flex', marginTop: '15px'}}>
                              <label style={{marginTop: '7.5px'}}>Descendente</label>
                              <Switch
                                id='switch-asc-desc'
                                onChange={cambiarSwitch}
                              />
                              <label style={{marginTop: '7.5px'}}>Ascendente</label>
                            </div>

                          </div>

                      </div>
                    </div>


                  </div>
                  
                </div>

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
                            <button className='boton1 margin-arritop' onClick={()=>{window.location.href = '/ticket/'+c._id+'/false'}}>Mostrar</button>
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

export default ListaTickets