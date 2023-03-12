import axios from 'axios';
import React, { useEffect, useState } from 'react'
import sweetalert2 from 'sweetalert2';
import Boton1 from '../components/Boton1';
import Loading from '../components/Loading';
import Titulo from '../components/Titulo';
import backend from '../constants';
import { PhotoProvider, PhotoView } from 'react-image-previewer';


import '../styles/Dashboard.css';

const Dashboard = () => {
    const [txtRango, setTxtRango] = useState('')
    const [usuario, setUsuario] = useState({});
    const [empresa, setEmpresa] = useState({});
    const [usuarios, setUsuarios] = useState([]);

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

        if(usuario.dios){
            setTxtRango('Desarrollador');
        }else if(usuario.admin){
            setTxtRango('Administrador');
        }else if(usuario.moderador){
            setTxtRango('Moderador');
        }
        
        if(empresa._id === undefined){
          getEmpresa();

        }

      }
    });

    useEffect(()=>{
        const getUsuarios = async()=>{
            const {data} = await axios.get(backend()+'/api/usuario')
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
            data.map((d)=>{
                if(d.id_empresa === usuario.id_empresa){
                    aux.push(d);
                }
            })
    
            setUsuarios(aux);
        }

        if(usuarios.length === 0){
            getUsuarios();
        }
    })
    

    const yo = (u)=>{
        if(u._id === usuario._id)
            return <h1 className='h1-dashboard-nombre'>(Yo) {u.nombre} {u.apellido}</h1>
        else
            return <h1 className='h1-dashboard-nombre'>{u.nombre} {u.apellido} </h1>
        
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

    const puedes = (b)=>{
        if(b)
            return 'Si'
        else   
            return 'No'
    }

    const btnsDesarrollador = ()=>{
        if(usuario.dios){
            return <div  className='div-dashboard-btns'>
                <button className='boton1 btn-dashboard-izq' onClick={()=>window.location.href = '/agregar/empresa'}>Agregar Empresa</button>
                <pre className='pre-chikito'></pre>
                <button className='boton1 btn-dashboard-izq' onClick={()=>window.location.href = '/gestionar/empresas'}>Gestionar Empresas</button>
                <pre className='pre-chikito'></pre>
                <button className='boton1 btn-dashboard-izq'onClick={()=>window.location.href = '/agregar/usuario'}>Agregar Usuario</button>
            </div>
        }else if(usuario.admin){
            return <div  className='div-dashboard-btns'>
                <button className='boton1 btn-dashboard-izq'onClick={()=>window.location.href = '/agregar/usuario'}>Agregar Usuario</button>
            </div>
        }else{
            return <div className='div-dashboard-btns'></div>
        }
    }

    if(usuario._id === undefined || empresa._id === undefined || usuarios.length === 0){
        return <Loading/>
    }else{
        return (
            <div className='div-dashboard-main'>
                <div className='div-dashboard-titulo'>
                    <PhotoProvider>
                        <PhotoView src={empresa.img}>   
                            <img src={empresa.img} className='img-dashboard-logo-empresa' alt=''/>
                        </PhotoView>
                    </PhotoProvider>
                    <Titulo>Panel de {txtRango} </Titulo>
                    {
                        btnsDesarrollador()
                    }
                </div>
                
                {
                    usuarios.map((u)=>{
                        return <div className='div-map-usuarios' onClick={()=>{window.location.href = '/editar/usuario/'+u._id}}>
                            {yo(u)}
                            <p className='p-dashboard-usuario'>Correo: <a className='span-dashboard-usuario a-dashboard' href={'mailto:'+u.correo}>{u.correo} </a></p>
                            <p className='p-dashboard-usuario'>Telefono: <a className='span-dashboard-usuario a-dashboard' href={'callto:'+u.telefono}>{u.telefono}</a></p>
                            <p className='p-dashboard-usuario'>Rango: <span className='span-dashboard-usuario'>{rango(u)}</span></p>
                            <p className='p-dashboard-usuario'>¿Puede cotizar? <span className='span-dashboard-usuario'>{puedes(u.cotizaciones)}</span></p>
                            <p className='p-dashboard-usuario'>¿Puede hacer tickets? <span className='span-dashboard-usuario'>{puedes(u.tickets)}</span></p>

                        </div>
                    })
                }

                <br/>

            </div>
        )
    }
}

export default Dashboard