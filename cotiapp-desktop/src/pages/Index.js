import React, { useEffect, useState } from 'react';
import axios from 'axios';
import sweetalert2 from 'sweetalert2';
import backend from '../constants';
import { PhotoProvider, PhotoView } from 'react-image-previewer';
import Loading from '../components/Loading';

import '../styles/Index.css'
import CrearCotizacion from '../components/CrearCotizacion';
import CrearTicket from '../components/CrearTicket';

const Index = () => {

  const [usuario, setUsuario] = useState({});
  const [empresa, setEmpresa] = useState({});
  const [classBtnC, setClassBtnC] = useState('');
  const [classBtnT, setClassBtnT] = useState('btn-inactive');
  const [dispCoti, setDispCoti] = useState('');
  const [dispTicket, setDispTicket] = useState('hidden');

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
        
        if(empresa._id === undefined){
          getEmpresa();
        }
      }
    });

    const cambiarTicket = ()=>{
      setClassBtnT('');
      setClassBtnC('btn-inactive');
      setDispCoti('hidden');
      setDispTicket('');
    }

    const cambiarCoti = ()=>{
      setClassBtnC('');
      setClassBtnT('btn-inactive');
      setDispCoti('');
      setDispTicket('hidden');
    }
    
    if(usuario._id === undefined){
      return <Loading/>
    }else{
      return (
        <div>
            <div className='div-index-header'>

            <div className='div-index-header-item-lados'>
              <PhotoProvider>
                <PhotoView src={empresa.img}>   
                  <img src={empresa.img} alt='' className='img-logo-empresa-index'/>
                </PhotoView>
              </PhotoProvider>
            </div>

              <div className='div-index-header-item-centro'>
                <h1 className='titulo h1-index-titulo'>Hola {usuario.nombre}</h1>
              </div>

              <div className='div-index-header-item-lados'>
                <button className='boton1 btn-index-clientes-margen' onClick={()=>window.location.href = '/lista/clientes'}>Ver mis clientes</button>
              </div>

            </div>


            <div className='div-index-coti-ticket'>
              <div className='div-index-btns'>
                <button className={'btn-index '+classBtnC} onClick={cambiarCoti}>Cotización</button>
                <button className={'btn-index '+classBtnT} onClick={cambiarTicket}>Ticket</button>
              </div>
              <CrearCotizacion display={dispCoti}/>
              <CrearTicket display={dispTicket}/>

            </div>


            <br/>
            <br/>
        </div>

        
      )
    }

    
}

export default Index