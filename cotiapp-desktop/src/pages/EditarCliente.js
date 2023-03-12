import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import sweetalert2 from 'sweetalert2';
import Boton1 from '../components/Boton1'
import Label from '../components/Label'
import Loading from '../components/Loading'
import Titulo from '../components/Titulo'
import backend from '../constants'

const EditarCliente = () => {

    const {id} = useParams();

    const [cliente, setCliente] = useState({});

    useEffect(()=>{
        const getCliente = async()=>{
            const {data} = await axios.get(backend()+'/api/cliente/'+id);
            setCliente(data);
        }
        
        if(cliente._id === undefined)
            getCliente();
    });

    const submit = async(e)=>{
        e.preventDefault();

        const {data} = await axios.put(backend()+'/api/cliente/'+id, cliente)
            .catch(err=>{
                console.log(err);
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
        
        if(data._id !== undefined){
            const Toast = sweetalert2.mixin({
                toast: true,
                position: 'bottom-right',
                iconColor: 'white',
                customClass: {
                  popup: 'colored-toast'
                },
                showConfirmButton: false,
                showCloseButton: true,
                timer: 4000,
                timerProgressBar: true
              })

              Toast.fire({
                icon: 'success',
                title: 'Información actualizada!'
              })
        }else{    
            sweetalert2.fire({
              icon: 'error',
              iconColor: 'red',
              title: 'Ha ocurrido un error al actualizar el registro',
              text: 'Por favor, intentalo nuevamente',
              color: 'black',
              footer: '<p>Si el problema persiste reporte el error al correo: <a href="mailto:cotiapp.dev@gmail.com">cotiapp.dev@gmail.com</a></p>',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#F5305C'
            })
          }
    }

    const cambiarValor = (e)=>{
        const {name, value} = e.target;
        setCliente({...cliente, [name]: value});
    }

    const eliminar = async()=>{        
        sweetalert2.fire({
            title: '¿Estas seguro que quieres borrar el cliente?',
            color: 'black',
            icon: 'warning',
            iconColor: '#F5305C',
            showCancelButton: true,
            confirmButtonColor: '#F5305C',
            cancelButtonColor: '#04BEC7',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
          }).then(async(result) => {
            if (result.isConfirmed) {
                await axios.delete(backend()+'/api/cliente/'+id);
                window.location.href = '/lista/clientes'
            }
          })
    }

    if(cliente._id === undefined)
        return <Loading/>
    else
        return (
            <div className='div-editar-empresa-main'>
          <Titulo>Editar información de tu empresa</Titulo>
          
          <form onSubmit={submit} className='form-editar-empresa'>
          <br/><br/>
            

          <div className='div-input-editar-empresa'>
              <Label>Nombre:</Label>
              <input
                className='input-editar-empresa-completo'
                type='text'
                value={cliente.nombre}
                name='nombre'
                placeholder='Nombre'
                required

                onChange={cambiarValor}
              />
            </div>
            
            <div className='div-input-editar-empresa'>
              <Label>Empresa:</Label>
              <input
                className='input-editar-empresa-completo'
                type='text'
                value={cliente.empresa}
                name='empresa'
                placeholder='Empresa'
                required

                onChange={cambiarValor}
              />
            </div>
            
            <div className='div-input-editar-empresa'>
              <Label>Correo:</Label>
              <input
                className='input-editar-empresa-completo'
                type='email'
                value={cliente.correo}
                name='correo'
                placeholder='Correo'
                required

                onChange={cambiarValor}
              />
            </div>
            
            <div className='div-input-editar-empresa'>
              <Label>Telefono:</Label>
              <input
                className='input-editar-empresa-completo'
                type='number'
                value={cliente.telefono}
                name='telefono'
                placeholder='telefono'
                required

                onChange={cambiarValor}
              />
            </div>

            <div className='div-btns-editar-empresa'>
              <input
                className='boton1 btn-editar-empresa-cancelar'
                type='reset'
                value='Volver'

                onClick={()=>{window.location.href = '/lista/clientes'}}
              />
              <input
                className='boton1 btn-editar-empresa-cancelar'
                type='reset'
                value='Eliminar Cliente'

                onClick={eliminar}
              />
              <button className='boton1' id='btn1'>Guardar Cambios</button>
            </div>

            


            <br/>
          </form>
          <br/>
          <br/>
          <br/>

        </div>
        )
}

export default EditarCliente