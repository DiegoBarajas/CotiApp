import React, { useEffect, useState } from 'react';
import axios from 'axios';
import sweetalert2 from 'sweetalert2';
import backend from '../constants';
import Loading from '../components/Loading';
import Titulo from '../components/Titulo';

import imgAgregarCliente from '../assets/agregar-cliente.png';

import '../styles/ListaClientes.css'

const Listaclientess = () => {

    const [usuario, setUsuario] = useState({});
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
            if(d.id_usuario === usuario._id && d.activo){
                aux.push(d);
            }
        })

        console.log(aux)
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

    if(usuario._id === undefined){
        return <Loading/>
    }else{
        return (
            <div className='div-lista-cliente-main'>
                <Titulo>Mis clientes</Titulo>
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