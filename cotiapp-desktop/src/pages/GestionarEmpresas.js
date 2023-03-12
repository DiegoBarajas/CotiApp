import React, { useEffect, useState } from 'react';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import Swal from 'sweetalert2'
import { PhotoProvider, PhotoView } from 'react-image-previewer';

import Titulo from '../components/Titulo';
import backend from '../constants';

import '../styles/GestionarEmpresas.css'

const GestionarEmpresas = () => {

    const [empresas, setEmpresas] = useState([]);

    useEffect(()=>{
        const getEmpresas = async()=>{
            const {data} = await axios.get(backend()+'/api/empresa');
            setEmpresas(data);
        }

        if(empresas.length === 0){
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

    return (
        <div className='div-gestionar-empresas-main'>
            <Titulo>Gestionar Empresas</Titulo>
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