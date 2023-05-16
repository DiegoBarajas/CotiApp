import axios from 'axios';
import React, { useEffect, useState } from 'react'
import backend from '../constants';
import sweetalert2 from 'sweetalert2';
import Loading from '../components/Loading';

const GestionarUsurios = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [empresas, setEmpresas] = useState([]);

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
        }
      });
  

    useEffect(()=>{
        const getUsuarios = async()=>{
            const {data} = await axios.get(backend()+'/api/usuario');
            setUsuarios(data);
        }

        if(usuarios.length === 0)
            getUsuarios();
    });

    useEffect(()=>{
        const getEmpresas = async()=>{
            const {data} = await axios.get(backend()+'/api/empresa');
            setEmpresas(data);
        }

        if(empresas.length === 0)
            getEmpresas();
    });

    const yo = (u)=>{
        if(u._id === usuario._id)
            return <h1 className='h1-dashboard-nombre'>(Yo) {u.nombre} {u.apellido}</h1>
        else
            return <h1 className='h1-dashboard-nombre'>{u.nombre} {u.apellido} </h1>
    }

    const colorTarjeta = (u)=>{
        if (u.activo) return '#63CCD1'
        else return '#4A9A9E'
    }

    const puedes = (b)=>{
        if(b)
            return 'Si'
        else   
            return 'No'
    }

    const rango = (u)=>{
        if(u.dios)
            return 'Desarrollador'
        else if(u.admin)
            return 'Administrador'
        else if(u.moderador)
            return 'Moderador'
        else
            return 'Usuario Normal'
    }

    const queEmpresaPertenece = (u)=>{
        var empresa = '';
        empresas.map((e)=>{
            if(e._id === u.id_empresa)
                empresa = e.nombre;
        })

        return empresa;
    }

    const redireccionar = (u)=>{
        if(u._id === usuario._id)
            window.location.href = '/editar/usuario'
        else
            window.location.href = '/editar/usuario/global/'+u._id

    }

    if(usuario._id === undefined || usuarios.length === 0 || empresas.length === 0)
        return <Loading/>
    else
        return (
            <div className='div-dashboard-main'>
                <h1>Gestionar Usuarios</h1>
                {
                        usuarios.map((u)=>{
                            return <div className='div-map-usuarios' style={{backgroundColor: colorTarjeta(u)}} onClick={()=>redireccionar(u)}>
                                {yo(u)}
                                <p className='p-dashboard-usuario'>Empresa: <a className='span-dashboard-usuario'>{queEmpresaPertenece(u)} </a></p>
                                <p className='p-dashboard-usuario'>Correo: <a className='span-dashboard-usuario a-dashboard' href={'mailto:'+u.correo}>{u.correo} </a></p>
                                <p className='p-dashboard-usuario'>Telefono: <a className='span-dashboard-usuario a-dashboard' href={'callto:'+u.telefono}>{u.telefono}</a></p>
                                <p className='p-dashboard-usuario'>Rango: <span className='span-dashboard-usuario'>{rango(u)}</span></p>
                                <p className='p-dashboard-usuario'>¿Puede cotizar? <span className='span-dashboard-usuario'>{puedes(u.cotizaciones)}</span></p>
                                <p className='p-dashboard-usuario'>¿Puede hacer tickets? <span className='span-dashboard-usuario'>{puedes(u.tickets)}</span></p>
                                <p className='p-dashboard-usuario'>Activo <span className='span-dashboard-usuario'>{puedes(u.activo)}</span></p>
                                
                            </div>
                        })
                    }
            </div>
        )
}

export default GestionarUsurios