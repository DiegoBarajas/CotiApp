import React, { useEffect, useState } from 'react';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import Swal from 'sweetalert2'
import { PhotoProvider, PhotoView } from 'react-image-previewer';
import Switch from '@mui/material/Switch';

import imgFiltro from '../assets/filtro.png';

import Titulo from '../components/Titulo';
import backend from '../constants';

import '../styles/GestionarEmpresas.css'
import Loading from '../components/Loading';

const GestionarEmpresas = () => {

    const [empresas, setEmpresas] = useState([]);
    const [filtro, setFiltro] = useState('none');
    const [valorInicial, setValorInicial] = useState([]);
    const [cbNombreChecked, setCbNombreChecked] = useState('true')

    useEffect(()=>{
        const getEmpresas = async()=>{
            const {data} = await axios.get(backend()+'/api/empresa');
            setEmpresas(data);
            setValorInicial(data)
        }

        if(valorInicial.length === 0){
            getEmpresas();
        }
    });

    const estaActivo = (b)=>{
        if(b){
            return 'Si'
        }else{
            return 'No'
        }
    }

    const copiarPortapapeles = (e)=>{
        const txt = e.target.innerHTML;

        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-right',
            iconColor: 'white',
            customClass: {
              popup: 'colored-toast'
            },
            showConfirmButton: false,
            timer: 1200,
            timerProgressBar: true
          })

        copy(txt)

        Toast.fire({
            icon: 'info',
            title: txt+' copiado al portapapeles'
          })

    }

    const colorEmpresa = (e)=>{      
        if(e.activo)
          return '#63ccd1'
        else
          return '#4a9a9e'
      }

      const buscar = ()=>{
        const b = document.getElementById('busqueda').value.toLowerCase();
        const cbNombre = document.getElementById('cb-nombre').checked;
        const cbPagina = document.getElementById('cb-pagina').checked;
        const cbCorreo = document.getElementById('cb-correo').checked;
        const cbTelefono = document.getElementById('cb-telefono').checked;
        const ordenar = document.getElementById('switch-asc-desc').checked;
  
        document.getElementById('status').selectedIndex = 0;

        var aux = [];
  
        if(b === ''){
            setEmpresas(valorInicial);
        }else{
          valorInicial.map((v)=>{

            if((cbNombre) && (v.nombre.toLowerCase().search(b) >= 0)){
              aux.push(v);
            }else if((cbPagina) && (v.pagina.toLowerCase().search(b) >= 0)){
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
            setEmpresas(aux.reverse())
          else
            setEmpresas(aux)
        }
      }
    

      const nombre = (e)=>{
        const cbPagina = document.getElementById('cb-pagina').checked;
        const cbCorreo = document.getElementById('cb-correo').checked;
        const cbTelefono = document.getElementById('cb-telefono').checked;
  
        if(cbPagina || cbCorreo || cbTelefono){
          if(e.target.id === 'cb-nombre'){
            setCbNombreChecked(!cbNombreChecked)
          }
        }else {
          setCbNombreChecked(true)
        }
  
        buscar()
      }

      const filtarEmpresa = (e)=>{
        const {value} = e.target;

        if(value === ''){
            setEmpresas(valorInicial);
        }else{
            if(value === 'a'){
                var aux = [];

                valorInicial.map((e)=>{
                    if(e.activo){
                        aux.push(e)
                    }
                })

                if(aux.length === 0){
                    aux = [1]
                  }

                setEmpresas(aux);
            }else if(value === 'i'){
                var aux = [];

                valorInicial.map((e)=>{
                    if(!e.activo){
                        aux.push(e)
                    }
                })

                if(aux.length === 0){
                    aux = [1]
                  }

                setEmpresas(aux);
            }
        }
      }


    if(valorInicial.length === 0){
        return <Loading/>
    }else if(empresas[0]===1)
        return (
            <div className='div-gestionar-empresas-main'>
                <Titulo>Gestionar Empresas</Titulo>


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

                            <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                            <label>Web</label>
                            <input
                                type='checkbox'
                                className='input-filtro-cb'
                                id='cb-pagina'
                                onChange={nombre}
                            />
                            </div>

                            <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                                <label>Status</label>
                                <select id='status' onChange={filtarEmpresa} style={{marginLeft: '5px', marginTop: '2px'}}>
                                    <option value=''>Todos</option>
                                    <option value='a'>Activos</option>
                                    <option value='i'>Inactivos</option>

                                </select>
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


                    <p style={{textAlign: 'center'}}>
                    No se encontró ninguna coincidencia</p>


                
                <br/><br/>
            </div>
        )
    else 
        return (
            <div className='div-gestionar-empresas-main'>
                <Titulo>Gestionar Empresas</Titulo>


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

                            <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                            <label>Web</label>
                            <input
                                type='checkbox'
                                className='input-filtro-cb'
                                id='cb-pagina'
                                onChange={nombre}
                            />
                            </div>

                            <div style={{display: 'flex', justifyContent: 'space-between', width: '10%'}}>
                                <label>Status</label>
                                <select id='status' onChange={filtarEmpresa} style={{marginLeft: '5px', marginTop: '2px'}}>
                                    <option value=''>Todos</option>
                                    <option value='a'>Activos</option>
                                    <option value='i'>Inactivos</option>

                                </select>
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


                {
                    empresas.map((e)=>{
                        return <div 
                                    className='div-contenedor-empresa'
                                    style={{backgroundColor: colorEmpresa(e)}}>
                                <div className='div-contenedor-empresa-txt'>
                                    <p className='p-gestionar-empresa p-margin-arriba'><big><b>ID {e._id}</b></big></p>
                                    <p className='p-gestionar-empresa'><b>Nombre:</b> {e.nombre} </p>
                                    <p className='p-gestionar-empresa'><b>Correo:</b> {e.correo}</p>
                                    <p className='p-gestionar-empresa'><b>Telefono:</b> {e.telefono}</p>
                                    <p className='p-gestionar-empresa'><b>Pagina:</b> {e.pagina}</p>
                                    <p className='p-gestionar-empresa'><b>Color:</b>
                                        <div 
                                            style={{width: '100px', 
                                                    height: '25px', 
                                                    backgroundColor: e.color, 
                                                    border: '1.5px solid black', 
                                                    display: 'flex', 
                                                    justifyContent: 'center', 
                                                    alignItems: 'center', 
                                            }}
                                        >
                                            <p 
                                                onClick={(e)=>{
                                                    copiarPortapapeles(e)
                                                }}
                                                style={{color: e.color, 
                                                    filter: 'invert(100%)', 
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    height: '100%',
                                                    textAlign: 'center',
                                            }}>{e.color}</p>
                                        </div>
                                    </p>
                                    <p className='p-gestionar-empresa p-margin-abajo'><b>Activo:</b> {estaActivo(e.activo)} </p>
                                </div>
                                <div className='div-contenedor-empresa-img'>
                                    <PhotoProvider>
                                        <PhotoView src={e.img}>
                                            <img src={e.img} alt='' className='img-gestionar-empresa'/>
                                        </PhotoView>
                                    </PhotoProvider>
                                </div>
                                <button 
                                    className='boton1 btm-mar'
                                    onClick={()=>{window.location.href = '/empresa/'+e._id}}
                                >Ver</button>
                            </div>
                    })
                }
                <br/><br/>
            </div>
        )
}

export default GestionarEmpresas