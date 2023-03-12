import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-image-previewer';
import { Link, useParams } from 'react-router-dom';
import Titulo from '../components/Titulo';
import backend from '../constants';
import Loading from '../components/Loading';
import copy from 'copy-to-clipboard';
import Swal from 'sweetalert2'

const EditarOtraEmpresa = () => {

    const [empresa, setEmpresa] = useState({});
    const {id} = useParams();

    useEffect(()=>{
        const getEmpresa = async()=>{
            const {data} = await axios.get(backend()+'/api/empresa/'+id);
            setEmpresa(data)
        }

        getEmpresa();
    })

    const activarEmpresa = async(b)=>{
        const {data} = await axios.delete(backend()+'/api/empresa/'+id+','+b);

        console.log(data);
        window.location.reload();
    }

    const btnDesActivar = ()=>{
        if(empresa.activo)
            return <button  className='boton1' onClick={()=>activarEmpresa(false)}>Desactivar Empresa</button>
        else
            return <button  className='boton1' onClick={()=>activarEmpresa(true)}>Activar Empresa</button>
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

    if(empresa._id === undefined)
        return <Loading/>
    else
        return (
            <div className='div-gestionar-empresas-main'>
                <Link 
                        to='/gestionar/empresas'
                        className='link-volver'
                >
                        Volver
                </Link>
                <Titulo>Gestionar {empresa.nombre} </Titulo>
                <div 
                    className='div-gestionar-empresa'
                    style={{backgroundColor: colorEmpresa(empresa)}}>
                    <h1 className=' margen-left'>{empresa.nombre}</h1>
                    <p className='p-gestionar-empresa2 margen-left'><b>Folio de Cotización</b> {empresa.folio_coti} </p>
                    <p className='p-gestionar-empresa2 margen-left'><b>Folio de Ticket</b> {empresa.folio_ticket} </p>
                    <br/>
                    <a className='p-gestionar-empresa2 margen-left' href={'mailto:'+empresa.correo}><b>Correo</b> {empresa.correo} </a><br/>
                    <a className='p-gestionar-empresa2 margen-left' href={'callto:'+empresa.telefono}><b>Telefono</b> {empresa.telefono} </a><br/>
                    <a className='p-gestionar-empresa2 margen-left' href={empresa.pagina} rel="noreferrer noopener" target='_blank'><b>Página web</b> {empresa.pagina} </a>
                    <p className='p-gestionar-empresa2 margen-left'><b>Dirección</b> {empresa.direccion} </p>
                    <br/>
                    <p className='p-gestionar-empresa2 margen-left'><b>Color:</b>
                                    <div 
                                        style={{width: '100px', 
                                                height: '25px', 
                                                backgroundColor: empresa.color, 
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
                                            style={{color: empresa.color, 
                                                   filter: 'invert(100%)', 
                                                   cursor: 'pointer',
                                                   width: '100%',
                                                   height: '100%',
                                                   textAlign: 'center',
                                        }}>{empresa.color}</p>
                                    </div>
                                </p>
                    <p className='p-gestionar-empresa2 margen-left'><b>Condiciones de servicio</b> {empresa.condiciones} </p>
                    <p className='p-gestionar-empresa2 margen-left'><b>Footer del documento</b> {empresa.footer} </p>
                    <br/>
                    <PhotoProvider>
                        <PhotoView src={empresa.img}>
                            <img src={empresa.img} alt='' className='img-gestionar-empresa-2'/>
                        </PhotoView>
                    </PhotoProvider>
                    <br/>
                    <div className='centrar-el-boton-este'>
                        {btnDesActivar()}
                    </div>
                    <br/><br/>
                </div>
                <br/><br/>
            </div>
        )
}

export default EditarOtraEmpresa