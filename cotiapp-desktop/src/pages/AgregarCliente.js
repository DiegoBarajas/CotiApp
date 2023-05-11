import axios from 'axios';
import React, { useState } from 'react'
import backend from '../constants';
import Label from '../components/Label';
import sweetalert2 from 'sweetalert2';

import '../styles/AgregarCliente.css'

import imgAgregarCliente from '../assets/agregar-cliente.png';

const AgregarCliente = ({id}) => {
    
    const valorInicial = {
        nombre: '',
        empresa: '',
        correo: '',
        telefono: ''
    };

    const [cliente, setCliente] = useState(valorInicial);

    const capturarDato = (e)=>{
        const {name, value} = e.target;
        setCliente({...cliente, [name]: value})
    }

    const submit = async(e)=>{
        e.preventDefault();

        document.getElementById('botoncitoUno').disabled = true;
        document.getElementById('botoncitoDos').disabled = true;

        const nombre = document.getElementById('nombreCliente').value;
        const empresa = document.getElementById('empresaCliente').value;
        const correo = document.getElementById('correoCliente').value;
        const telefono = document.getElementById('telefonoCliente').value;

        const formData = new FormData();
        formData.append('id_usuario', localStorage.getItem('id'));
        formData.append('nombre', nombre);
        formData.append('empresa', empresa);
        formData.append('correo', correo);
        formData.append('telefono', telefono);

        const {data} = await axios.post(backend()+'/api/cliente', formData)
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

                document.getElementById('botoncitoUno').disabled = false;
                document.getElementById('botoncitoDos').disabled = false;
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
                timer: 5000,
                timerProgressBar: true
              })
              
              Toast.fire({
                icon: 'success',
                title: 'El cliente se registro exitosamente'
              })

              document.getElementById('botoncitoUno').disabled = false;
              document.getElementById('botoncitoDos').disabled = false;
                          
              document.getElementById('agregar-cliente').style.display = 'none';
              setCliente({...valorInicial});
        }else{
            sweetalert2.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'Ha ocurrido un error al subir el registro',
                text: 'Por favor, intentalo nuevamente',
                color: 'black',
                footer: '<p>Si el problema persiste reporte el error al correo: <a href="mailto:cotiapp.dev@gmail.com">cotiapp.dev@gmail.com</a></p>',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#F5305C'
              })
              document.getElementById('botoncitoUno').disabled = false;
              document.getElementById('botoncitoDos').disabled = false;
        }
    }

    const cancelarYCerrar = ()=>{
        document.getElementById('agregar-cliente').style.display = 'none';
    }

    const dispose = (e)=>{
        if(e.target.id === 'agregar-cliente'){
            document.getElementById('agregar-cliente').style.display = 'none';
        }
    }

    return (
        <div className='agregar-cliente' id='agregar-cliente' onClick={dispose}>
            <form onSubmit={submit} className='form-agregar-cliente'>
                <br/>
                <div className='div-titulo-agregar-cliente'>
                    <img src={imgAgregarCliente} alt='' className='img-agregar-cliente img-invert-100'/>
                    <h2 className='h2-agregar-cliente'>Agregar Cliente</h2>
                    <img src={imgAgregarCliente} alt='' className='img-agregar-cliente'/>
                </div>
                <div className='div-input-agregar-cliente'>
                    <Label htmlFor='nombreCliente'>Nombre del Cliente:</Label>
                    <input 
                        className='input-agregar-cliente'
                        placeholder='Nombre del cliente'
                        id='nombreCliente'
                        name='nombre'
                        type='text'
                        required
                        onChange={capturarDato}

                        value={cliente.nombre}
                    />
                </div>
                
                <div className='div-input-agregar-cliente'>
                    <Label htmlFor='empresaCliente'>Empresa del Cliente:</Label>
                    <input 
                        className='input-agregar-cliente'
                        id='empresaCliente'
                        placeholder='Nombre de la empresa'
                        name='empresa'
                        type='text'
                        required
                        onChange={capturarDato}

                        value={cliente.empresa}
                    />
                </div>

                <div className='div-input-agregar-cliente'>
                    <Label htmlFor='correoCliente'>Correo del Cliente:</Label>
                    <input 
                        className='input-agregar-cliente'
                        id='correoCliente'                        
                        placeholder='Correo del cliente'
                        name='correo'
                        type='email'
                        required
                        onChange={capturarDato}

                        value={cliente.correo}
                    />
                </div>

                <div className='div-input-agregar-cliente'>
                    <Label htmlFor='telefonoCliente'>Telefono del Cliente:</Label>
                    <input 
                        className='input-agregar-cliente'
                        id='telefonoCliente'
                        name='telefono'                        
                        placeholder='Número de telefono del cliente'
                        type='number'
                        minLength='10'
                        required
                        onChange={capturarDato}

                        value={cliente.telefono}
                    />
                </div>
                <br/>

                <button className='boton1' id='botoncitoUno'>Agregar Cliente</button>
                <input
                    type='reset'
                    value='Cancelar'
                    onClick={cancelarYCerrar}
                    className='boton1 cerrar'
                    id='botoncitoDos'
                />
                <br/>
            </form>
        </div>
    )
}

export default AgregarCliente