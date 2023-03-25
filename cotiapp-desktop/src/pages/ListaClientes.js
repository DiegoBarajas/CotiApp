import React, { useEffect, useState } from 'react';
import axios from 'axios';
import sweetalert2 from 'sweetalert2';
import backend from '../constants';
import Loading from '../components/Loading';
import Titulo from '../components/Titulo';
import Switch from '@mui/material/Switch';

import imgAgregarCliente from '../assets/agregar-cliente.png';
import imgFiltro from '../assets/filtro.png';

import '../styles/ListaClientes.css'

const Listaclientess = () => {
    const [filtro, setFiltro] = useState('none');
    const [usuario, setUsuario] = useState({});
    const [clientes, setClientes] = useState([]);
    const [valorInicial, setValorInicial] = useState([]);
    const [cbNombreChecked, setCbNombreChecked] = useState('true')

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
            if(d.id_usuario === usuario._id && d.activo){
                aux.push(d);
            }
        })

        setValorInicial(aux)
        if(clientes.length === 0)
          setClientes(aux);
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
        if(clientes.length === 0){
          getclientes();
        }
      }
    });

    const noClientes = ()=>{
      if(clientes.length === 0)
        return<p style={{textAlign: 'center'}}>
                No tienes ningun cliente registrado
                <br/>
                Para registrar un cliente haz click en el boton "Agregar cliente"
                <img 
                  src={imgAgregarCliente} 
                  alt='' 
                  style={{
                    filter: 'invert(100%)', 
                    width: '20px', 
                    marginLeft: '5px', 
                    cursor: 'pointer'
                  }} 
                  onClick={()=>{ 
                    document.getElementById('agregar-cliente').style.display = 'flex' 
                  }} />
              </p>
    }

    const nombre = (e)=>{
      const cbEmpresa = document.getElementById('cb-empresa').checked;
      const cbCorreo = document.getElementById('cb-correo').checked;
      const cbTelefono = document.getElementById('cb-telefono').checked;

      if(cbEmpresa || cbCorreo || cbTelefono){
        if(e.target.id === 'cb-nombre'){
          setCbNombreChecked(!cbNombreChecked)
        }
      }else {
        setCbNombreChecked(true)
      }

      buscar()
    }

    const buscar = ()=>{
      const b = document.getElementById('busqueda').value.toLowerCase();
      const cbNombre = document.getElementById('cb-nombre').checked;
      const cbEmpresa = document.getElementById('cb-empresa').checked;
      const cbCorreo = document.getElementById('cb-correo').checked;
      const cbTelefono = document.getElementById('cb-telefono').checked;
      const ordenar = document.getElementById('switch-asc-desc').checked;

      var aux = [];

      if(b === ''){
        setClientes(valorInicial);
      }else{
        valorInicial.map((v)=>{
          if((cbNombre) && (v.nombre.toLowerCase().search(b) >= 0)){
            aux.push(v);
          }else if((cbEmpresa) && (v.empresa.toLowerCase().search(b) >= 0)){
            aux.push(v);
          }else if((cbCorreo) && (v.correo.toLowerCase().search(b) >= 0)){
            aux.push(v);
          }else if((cbTelefono) && (v.telefono.search(b) >= 0)){
            aux.push(v);
          }
        })

        if(aux.length === 0){
          aux = [1]
        }

        if(ordenar)
          setClientes(aux.reverse())
        else
          setClientes(aux)
      }
    }

    if(usuario._id === undefined){
        return <Loading/>
    }else if(clientes[0]===1)
      return <div className='div-lista-cliente-main'>
                <Titulo>Mis clientes</Titulo>
                <div className='div-busqueda'>
                  <h2 className='h3-busqueda'>Buscar</h2>
                  
                  <div className='div-input-busqueda'>
                    <input
                      className='input-busqueda'
                      placeholder='Ingrese los valores seleccionados del cliente a buscar'
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
                          <label>Nombre</label>
                          <input
                            type='checkbox'
                            className='input-filtro-cb'
                            id='cb-nombre'
                            onChange={nombre}
                            checked={cbNombreChecked}
                          />
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                          <label>Empresa</label>
                          <input
                            type='checkbox'
                            className='input-filtro-cb'
                            id='cb-empresa'
                            onChange={nombre}
                          />
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                          <label>Correo</label>
                          <input
                            type='checkbox'
                            className='input-filtro-cb'
                            id='cb-correo'
                            onChange={nombre}
                          />
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                          <label>Telefono</label>
                          <input
                            type='checkbox'
                            className='input-filtro-cb'                            
                            id='cb-telefono'
                            onChange={nombre}

                          />
                        </div>
                      </div>

                      <div className='div-opciones-filtro-der'>
                        <p className='p-filtro'>Ordenar:</p>

                          
                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            <p className='p-filtro' style={{marginTop: '3px', position: 'absolute'}}>Por fecha de creación de creación:</p>
                            
                            <div style={{display: 'flex', marginTop: '15px'}}>
                              <label style={{marginTop: '7.5px'}}>Descendente</label>
                              <Switch
                                id='switch-asc-desc'
                                onChange={buscar}
                              />
                              <label style={{marginTop: '7.5px'}}>Ascendente</label>
                            </div>

                          </div>

                      </div>
                    </div>


                  </div>
                  
                </div>
                <p style={{textAlign: 'center'}}>
                No se encontró ninguna coincidencia</p>
            </div>
    else{
        return (
            <div className='div-lista-cliente-main'>
                <Titulo>Mis clientes</Titulo>



                <div className='div-busqueda'>
                  <h2 className='h3-busqueda'>Buscar</h2>
                  
                  <div className='div-input-busqueda'>
                    <input
                      className='input-busqueda'
                      placeholder='Ingrese los valores seleccionados del cliente a buscar'
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
                          <label>Nombre</label>
                          <input
                            type='checkbox'
                            className='input-filtro-cb'
                            id='cb-nombre'
                            onChange={nombre}
                            checked={cbNombreChecked}
                          />
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                          <label>Empresa</label>
                          <input
                            type='checkbox'
                            className='input-filtro-cb'
                            id='cb-empresa'
                            onChange={nombre}
                          />
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                          <label>Correo</label>
                          <input
                            type='checkbox'
                            className='input-filtro-cb'
                            id='cb-correo'
                            onChange={nombre}
                          />
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                          <label>Telefono</label>
                          <input
                            type='checkbox'
                            className='input-filtro-cb'                            
                            id='cb-telefono'
                            onChange={nombre}

                          />
                        </div>
                      </div>

                      <div className='div-opciones-filtro-der'>
                        <p className='p-filtro'>Ordenar:</p>

                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            <p className='p-filtro' style={{marginTop: '3px', position: 'absolute'}}>Por fecha de creación:</p>
                            
                            <div style={{display: 'flex', marginTop: '15px'}}>
                              <label style={{marginTop: '7.5px'}}>Descendente</label>
                              <Switch
                                id='switch-asc-desc'
                                onChange={buscar}
                              />
                              <label style={{marginTop: '7.5px'}}>Ascendente</label>
                            </div>

                          </div>

                      </div>
                    </div>


                  </div>
                  
                </div>

                
                { noClientes() }
                {
                    clientes.map((c)=>{
                        return <div className='div-lista-clientes-cliente' onClick={()=>{window.location.href = '/editar/cliente/'+c._id}}>
                            <h3 className='h3-lista-clientes'>{c.nombre} </h3>
                            <p className='p-lista-clientes'>{c.empresa} </p>
                            <a className='a-lista-clientes' href={'mailto:'+c.correo}>{c.correo} </a>
                            <br/>
                            <a className='a-lista-clientes' href={'callto:'+c.telefono}>{c.telefono} </a>
                        </div>
                    })
                }
            </div>
        )
    }
}

export default Listaclientess