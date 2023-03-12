import React, { useEffect, useState } from 'react';
import axios from 'axios';
import sweetalert2 from 'sweetalert2';
import backend from '../constants';
import Titulo from '../components/Titulo';
import Label from '../components/Label';

import ojoAbierto from '../assets/ojo.png';
import ojoCerrado from '../assets/no-ojo.png';

import '../styles/Login.css'

const Login = () => {

    const [visible, setVisible] = useState(false);

    useEffect(()=>{
        const isLogged = ()=>{
            if(localStorage.getItem('id') !== null){
                window.location.href = '/';
            }
        }

        isLogged();
    });

    const forgotPassword = ()=>{
        sweetalert2.fire({
            title: ':(',
            text: 'Contacta con el administrador en tu empresa para que reestablezca tu contraseña',
            color: 'black',
            footer: '<p>Si eres el administrador, contacta a soporte en este correo: <a href="mailto:cotiapp.dev@gmail.com">cotiapp.dev@gmail.com</a></p>',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#F5305C'
        })
    }

    const btnOjo = ()=>{
        if(visible){
            return <img src={ojoCerrado} className='img-login-ojo' alt='' onClick={passVisible}/>
        }else{
            return <img src={ojoAbierto} className='img-login-ojo' alt='' onClick={passVisible}/>
        }
    }

    const passVisible = ()=>{
        
        const password = document.getElementById('password');
        
        if(visible){
            setVisible(false);
            password.setAttribute('type', 'password');
        }else{
            setVisible(true);
            password.setAttribute('type', 'text');
        }
    }

    const login = async(e)=>{
        e.preventDefault();

        const toast = sweetalert2.mixin({
            toast: true,
            position: 'center',
            iconColor: 'white',
            customClass: {
              popup: 'colored-toast'
            },
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          })

          toast.fire({
            icon: 'info',
            title: 'Iniciando sesión, espere un momento'
          })

        document.getElementById('btn1').disabled = true;
        

        const correo = document.getElementById('correo').value;
        const password = document.getElementById('password').value;

        const formData = new FormData();
        formData.append('correo', correo);
        formData.append('password', password);

        const {data} = await axios.post(backend()+'/api/login', formData)
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

                document.getElementById('btn1').disabled = false;
                return;
            })
        if(data.exito){
            localStorage.setItem('id', data.id);

            const res = await axios.get(backend()+'/api/usuario/'+data.id)
                
            if(res.data.telefono === password){
                sweetalert2.fire({
                    icon: 'warning',
                    iconColor: 'red',
                    title: '¡¡¡Atención!!!',
                    text: 'Tienes la contraseña por defecto. Te sugerimos cambiarla lo antes posible para evitar que usen tu cuenta indebidamente',
                    color: 'black',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#F5305C',
                }).then((res)=>{
                    window.location.href = '/home'

                })
            }else{
                window.location.href = '/home';
            }

        }else if(data.error !== undefined){
            document.getElementById('btn1').disabled = false;

            sweetalert2.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'Error al iniciar sesión',
                text: data.error,
                color: 'black',
                footer: 'Si has olvidado tu contraseña contacta con el administrador en tu empresa',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#F5305C'
            })
        }else{
            document.getElementById('btn1').disabled = false;

            sweetalert2.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'Error al iniciar sesión',
                text: 'Correo y/o contraseña incorrectos',
                color: 'black',
                footer: 'Si has olvidado tu contraseña contacta con el administrador en tu empresa',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#F5305C'
            })
            
        }
    }

    return (
        <div className='div-login-main'>
            <form onSubmit={login} className='form-login'>

                <Titulo>Iniciar Sesión</Titulo>

                <div className='div-input-login'>
                <Label htmlFor='correo'>Correo:</Label>
                    <input                        
                        className='input-login'
                        id='correo'
                        type='email'
                        placeholder='Correo Electronico'
                        required
                    />
                </div>
                    
                <div className='div-input-login'>
                    <Label htmlFor='password'>Contraseña:</Label>
                    <div className='div-input-login-ojito'>
                        <input
                            className='input-login'
                            id='password'
                            type='password'
                            placeholder='Contraseña'
                            minLength='6'
                            required
                        />
                        {btnOjo()}
                    </div>
                </div>


                <br/>
                <button className='boton1' id='btn1'>Iniciar Sesión</button>
                <p
                    className='p-forgot'
                    onClick={forgotPassword}
                >Olvidé mi contraseña</p>
                <br/>
            </form>
        </div>
    )
}

export default Login