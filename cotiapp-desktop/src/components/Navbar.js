import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import backend from '../constants';
import AgregarCliente from '../pages/AgregarCliente';

import '../styles/Navbar.css';

import imgAgregarCliente from '../assets/agregar-cliente.png';
import imgLogo from '../assets/cotiapp-logo-w.png'
import imgRefresh from '../assets/refresh.png';
import imgTuerquita from '../assets/icono-dashboard.png';
import imgUsuarioNormal from '../assets/usuario-normal.png';
import imgUsuarioModerador from '../assets/usuario-moderador.png';
import imgUsuarioAdmin from '../assets/usuario-admin.png';
import imgUsuarioDios from '../assets/usuario-dios.png';


const Navbar = () => {

    const [textoInfo, setTextoInfo] = useState('');
    const [textoHome, setTextoHome] = useState('');
    const [imgUsuario, setImgUsuario] = useState(imgUsuarioNormal);
    const [txtPanel, setTxtPanel] = useState('')

    const [usuario, setUsuario] = useState({});
    useEffect(()=>{
      const getUsuario = async()=>{
        const {data} = await axios.get(backend()+'/api/usuario/'+localStorage.getItem('id'));
        setUsuario(data);
      }

      if(localStorage.getItem('id') !== null){
        if(usuario._id === undefined){
            getUsuario();
          }else{
            if(usuario.dios){
                setImgUsuario(imgUsuarioDios);
                setTxtPanel('Desarrollador');
            }else if(usuario.admin){
                setImgUsuario(imgUsuarioAdmin);
                setTxtPanel('Administrador');
            }else if(usuario.moderador){
                setImgUsuario(imgUsuarioModerador);
                setTxtPanel('Moderador');
            }
          }
      }
    });

    const agregarCliente = ()=>{
        document.getElementById('agregar-cliente').style.display = 'flex'
    }

    const refresh = ()=>{
        window.location.reload();
    }
    
    const botones = ()=>{
        if(localStorage.getItem('id') !== null){
            if(usuario.admin || usuario.dios || usuario.moderador){
                return <div className='div-navbar-btns'>

                    <Link className='link-navbar' onClick={refresh}
                    onMouseEnter={()=>{
                        setTextoInfo('Recargar pestaña')
                    }}
                    
                    onMouseLeave={()=>{
                        setTextoInfo('')
                    }}>
                        <img src={imgRefresh} className='btn-img-navbar' alt=''/>
                    </Link>

                    <Link to='/dashboard' className='link-navbar' 
                    onMouseEnter={()=>{
                        setTextoInfo('Panel de '+txtPanel)
                    }}
                    
                    onMouseLeave={()=>{
                        setTextoInfo('')
                    }}
                    >
                        <img src={imgTuerquita} className='btn-img-navbar' alt=''/>
                    </Link>

                    <Link className='link-navbar' onClick={agregarCliente}
                    onMouseEnter={()=>{
                        setTextoInfo('Agregar Cliente')
                    }}
                    
                    onMouseLeave={()=>{
                        setTextoInfo('')
                    }}>
                        <img src={imgAgregarCliente} className='btn-img-navbar' alt=''/>
                    </Link>

                    <Link to='/usuario' className='link-navbar'
                    onMouseEnter={()=>{
                        setTextoInfo('Información personal')
                    }}
                    
                    onMouseLeave={()=>{
                        setTextoInfo('')
                    }}>
                        <img src={imgUsuario} className='btn-img-navbar' alt=''/>
                    </Link>
                </div>
            }else{
                return <div className='div-navbar-btns-small'>

                <Link className='link-navbar' onClick={refresh}
                onMouseEnter={()=>{
                    setTextoInfo('Recargar pestaña')
                }}
                
                onMouseLeave={()=>{
                    setTextoInfo('')
                }}>
                    <img src={imgRefresh} className='btn-img-navbar' alt=''/>
                </Link>

                <Link className='link-navbar' onClick={agregarCliente}
                    onMouseEnter={()=>{
                        setTextoInfo('Agregar Cliente')
                    }}
                    
                    onMouseLeave={()=>{
                        setTextoInfo('')
                    }}>
                    <img src={imgAgregarCliente} className='btn-img-navbar' alt=''/>
                </Link>

                <Link to='/usuario' className='link-navbar'
                    onMouseEnter={()=>{
                        setTextoInfo('Información personal')
                    }}
                    
                    onMouseLeave={()=>{
                        setTextoInfo('')
                    }}>
                    <img src={imgUsuario} className='btn-img-navbar' alt=''/>
                </Link>
            </div>
            }
        }
    }


    return (
        <nav className='navbar'>
            <AgregarCliente id='agregar-cliente'/>
            <Link to='/home'  className='link-navbar' 
            onMouseEnter={()=>{
                setTextoHome('Página Principal')
            }}
            
            onMouseLeave={()=>{
                setTextoHome('')
            }}
            >
                <img src={imgLogo} className='logo-navbar' alt=''/>
            </Link>
            {
                botones()
            }
            <p className='p-info-navbar-icon'>{textoInfo}</p>
            <p className='p-home-navbar-icon'>{textoHome}</p>
        </nav>
    )
}

export default Navbar