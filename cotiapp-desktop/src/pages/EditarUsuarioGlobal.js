import axios from 'axios';
import React, { useEffect, useState } from 'react'
import backend from '../constants';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Titulo from '../components/Titulo';
import Label from '../components/Label';
import sweetalert2 from 'sweetalert2';

const EditarUsuarioGlobal = () => {
    const {id} = useParams();
    const [usuario, setUsuario] = useState({});
    const [empresas, setEmpresas] = useState([]);
    const [valorEmpresa, setValorEmpresa] = useState('');

    useEffect(()=>{
        const getEmpresas = async()=>{
            const {data} = await axios.get(backend()+'/api/empresa')
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
            setEmpresas(data)
            setValorEmpresa(data[0]._id)
        }

        if(empresas.length === 0){
            getEmpresas();
        }
    })

    useEffect(()=>{
        const getUsuario = async()=>{
            const {data} = await axios.get(backend()+'/api/usuario/'+id);
            setUsuario(data);

            empresas.map((e, index)=>{
                if(e._id === data.id_empresa)
                    document.getElementById('select').selectedIndex = index;
            })
        }

        if(empresas.length > 0)
            if(usuario._id === undefined) getUsuario();
    })

    const cambiarEmpresa = (e)=>{
        const index = e.target.selectedIndex;

        setValorEmpresa(empresas[index]._id);
        setUsuario({...usuario, ['id_empresa']: empresas[index]._id});
    }

    const cambiarValor = (e)=>{
        const {name, value} = e.target;
        setUsuario({...usuario, [name]: value});
    }

    const activoOInactivo = ()=>{
        if(usuario.activo) return "Desactivar usuario"
        else return 'Activar Usuario'
    }

    const cancelar = ()=>{
        window.history.back();
    }

    const desactivarUsuario = async()=>{
        await axios.delete(backend()+'/api/usuario/'+id);
        window.location.reload();
      }

    const resetPassword = async()=>{
        await axios.put(backend()+'/api/usuario/reiniciar/'+id);
        const Toast = sweetalert2.mixin({
          toast: true,
          position: 'top-right',
          iconColor: 'white',
          customClass: {
            popup: 'colored-toast'
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true
        })
        
        Toast.fire({
          icon: 'success',
          title: 'Se ha restaurado la contraseña'
        })
      }

    const changeCB = (e)=>{
        const {id} = e.target;

        setUsuario({...usuario, [id]: !usuario[id]});

    }

    const isChecked = (e)=>{
        return usuario[e];
    }

    const submit = async(e)=>{
        e.preventDefault();

        await axios.put(backend()+'/api/usuario/'+id, usuario)
            .then(()=>window.location.reload())
            .catch((err)=>{
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
            })
    }

    if(usuario._id === undefined){
        return <Loading/>
      }else{
        return (
          <div className='div-editar-empresa-main'>
            <Titulo>Editar Usuario</Titulo>
            
            <form onSubmit={submit} className='form-editar-empresa'>
            <br/><br/>
              
  
            <div className='div-input-editar-empresa-doble'>
  
                <div className='div-input-editar-empresa-item'>
                            <Label>Nombre:</Label>
                            <input
                            className='input-editar-empresa-completo'
                            type='text'
                            value={usuario.nombre}
                            name='nombre'
                            placeholder='Nombre'
                            required

                            onChange={cambiarValor}
                            />
                        </div>

                        <div className='div-input-editar-empresa-item'>
                            <Label>Apellido:</Label>
                            <input
                            className='input-editar-empresa-completo'
                            type='text'
                            value={usuario.apellido}
                            name='apellido'
                            placeholder='Apellido'
                            required

                            onChange={cambiarValor}
                            />
                        </div>

                    </div>
                
                <div className='div-input-editar-empresa'>
                    <Label>Selecciona la empresa:</Label>
                    <select className='select-agregar-usuario' id='select' onChange={cambiarEmpresa}>
                        {
                            empresas.map((e)=>{
                                return <option className='option-agregar-usuario'>{e.nombre}</option>
                            })
                        }
                    </select>
                </div>

              <div className='div-input-editar-empresa-doble'>
  
                <div className='div-input-editar-empresa-item'>
                  <Label>Correo:</Label>
                  <input
                    className='input-editar-empresa-completo'
                    type='email'
                    value={usuario.correo}
                    name='correo'
                    placeholder='Correo'
                    disabled
                    required
  
                    onChange={cambiarValor}
                  />
                </div>
  
                <div className='div-input-editar-empresa-item'>
                  <Label>Telefono:</Label>
                  <input
                    className='input-editar-empresa-completo'
                    type='number'
                    value={usuario.telefono}
                    name='telefono'
                    minLength='10'
                    placeholder='Telefono'
                    required
  
                    onChange={cambiarValor}
                  />
                </div>
  
            </div>

            <div className='div-input-editar-empresa-doble'>

                <div className='div-input-editar-empresa-item'>
                    <input
                    className='input-editar-empresa-completo btn-reiniciar-pass'
                    type='button'
                    value='Reiniciar Contraseña'
                        disabled={!usuario.activo}

                    onClick={resetPassword}
                    />
                </div>

                <div className='div-input-editar-empresa-item'>
                    <input
                    className='input-editar-empresa-completo btn-reiniciar-pass'
                    type='button'
                    value={activoOInactivo()}

                    onClick={desactivarUsuario}
                    />
                </div>
            </div>
            <br/>

            <div className='div-checkbox-agregar-usuario'>

                <div className='div-checkbox-item'>
                    <Label>Desarrollador</Label>
                    <input
                        className='cb'
                        type='checkbox'
                        id='dios'
                        checked={isChecked('dios')}

                        onChange={changeCB}
                    />
                </div>

                <div className='div-checkbox-item'>
                    <Label>Administrador</Label>
                    <input
                        className='cb'
                        type='checkbox'
                        id='admin'
                        checked={isChecked('admin')}

                        onChange={changeCB}
                    />
                </div>

                <div className='div-checkbox-item'>
                    <Label>Moderador</Label>
                    <input
                        className='cb'
                        type='checkbox'
                        id='moderador'
                        checked={isChecked('moderador')}
                        
                        onChange={changeCB}
                    />
                </div>

                <div className='div-checkbox-item'>
                    <Label>Cotizaciones</Label>
                    <input
                        className='cb'
                        type='checkbox'
                        id='cotizaciones'
                        checked={isChecked('cotizaciones')}
                        
                        onChange={changeCB}
                    />
                </div>

                <div className='div-checkbox-item'>
                    <Label>Tickets</Label>
                    <input
                        className='cb'
                        type='checkbox'
                        id='tickets'
                        checked={isChecked('tickets')}
                        
                        onChange={changeCB}
                    />
                </div>
            </div>

            <div className='div-btns-editar-empresa'>
                <input
                    className='boton1 btn-editar-empresa-cancelar'
                    type='reset'
                    value='Volver'
    
                    onClick={cancelar}
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
}

export default EditarUsuarioGlobal