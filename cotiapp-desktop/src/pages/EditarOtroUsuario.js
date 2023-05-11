import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import backend from '../constants';
import Label from '../components/Label';
import Loading from '../components/Loading';
import sweetalert2 from 'sweetalert2';

const EditarOtroUsuario = () => {

    const {id} = useParams();

    const [usuario, setUsuario] = useState({});
    const [newUsuario, setNewUsuario] = useState({});
    const [admin, setAdmin] = useState(false);
    const [moderador, setModerador] = useState(false);
    const [cotizaciones, setCotizaciones] = useState(false);
    const [tickets, setTickets] = useState(false);

    useEffect(()=>{
      const getUsuario = async()=>{
        const {data} = await axios.get(backend()+'/api/usuario/'+id);
        setUsuario(data);
        setNewUsuario(data);

        setAdmin(data.admin);
        setModerador(data.moderador);
        setCotizaciones(data.cotizaciones);
        setTickets(data.tickets);

        console.log(data);
      }
      

      if(usuario._id === undefined)
        getUsuario();
    })

    const submit = async(e)=>{
      e.preventDefault();

      newUsuario.admin = admin;
      newUsuario.moderador = moderador;
      newUsuario.tickets = tickets;
      newUsuario.cotizaciones = cotizaciones;

      await axios.put(backend()+'/api/usuario/'+id, newUsuario);
      window.location.reload();
    }

    const cambiarValor = (e)=>{
      const {name, value} = e.target;
      setNewUsuario({...newUsuario, [name]: value});
    }

    const changeCheckBox = (e)=>{
      const {id, checked} = e.target;
      
      switch (id){
        case 'admin': setAdmin(checked);
          break;
        case 'moderador': setModerador(checked);
          break;
        case 'tickets': setTickets(checked);
          break;
        case 'cotizaciones': setCotizaciones(checked);
          break;
      }
    }

    const cancelar = ()=>{
      window.history.go(-1);
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

    const activoOInactivo = ()=>{
      if(usuario.activo) return "Desactivar usuario"
      else return 'Activar Usuario'
    }

    const activoONose = ()=>{
      if(!usuario.activo) return " - Usuario Inactivo"
    }

    const desactivarUsuario = async()=>{
      await axios.delete(backend()+'/api/usuario/'+id);
      window.location.reload();
    }
    
    if(usuario._id === undefined) return <Loading/>
    else
      return (
        <div className='div-editar-empresa-main'>
          <h1 style={{cursor: 'default', width: "100%", textAlign: 'center'}}>Editar usuario ( <u>{usuario.nombre} {usuario.apellido}</u> ){activoONose()}</h1>

          <form onSubmit={submit} className='form-editar-empresa'>
              <br/><br/>
                
    
              <div className='div-input-editar-empresa-doble'>
    
                  <div className='div-input-editar-empresa-item'>
                              <Label>Nombre:</Label>
                              <input
                              className='input-editar-empresa-completo'
                              type='text'
                              value={newUsuario.nombre}
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
                              value={newUsuario.apellido}
                              name='apellido'
                              placeholder='Apellido'
                              required

                              onChange={cambiarValor}
                              />
                          </div>

                      </div>
    
                <div className='div-input-editar-empresa-doble'>
    
    
                  <div className='div-input-editar-empresa-item'>
                    <Label>Telefono:</Label>
                    <input
                      className='input-editar-empresa-completo'
                      type='number'
                      value={newUsuario.telefono}
                      name='telefono'
                      minLength='10'
                      placeholder='Telefono'
                      required
    
                      onChange={cambiarValor}
                    />
                  </div>
    
                  <div className='div-input-editar-empresa-item'>
                    <input
                      className='input-editar-empresa-completo btn-reiniciar-pass'
                      type='button'
                      value='Reiniciar Contraseña'

                      onClick={resetPassword}
                    />
                  </div>
              </div>

              <br/>

              <div className='div-checkbox-agregar-usuario'>
                  <div className='div-checkbox-item'>
                      <Label>Administrador</Label>
                      <input
                          className='cb'
                          type='checkbox'
                          id='admin'

                          checked={admin}                          
                          onChange={changeCheckBox}

                      />
                  </div>

                  <div className='div-checkbox-item'>
                      <Label>Moderador</Label>
                      <input
                          className='cb'
                          type='checkbox'
                          id='moderador'

                          checked={moderador}
                          onChange={changeCheckBox}

                      />
                  </div>

                  <div className='div-checkbox-item'>
                      <Label>Cotizaciones</Label>
                      <input
                          className='cb'
                          type='checkbox'
                          id='cotizaciones'

                          checked={cotizaciones}
                          onChange={changeCheckBox}

                      />
                  </div>

                  <div className='div-checkbox-item'>
                      <Label>Tickets</Label>
                      <input
                          className='cb'
                          type='checkbox'
                          id='tickets'

                          checked={tickets}
                          onChange={changeCheckBox}
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
                  
                  <input
                      className='boton1 btn-editar-empresa-cancelar'
                      type='reset'
                      value={activoOInactivo()}
      
                      onClick={desactivarUsuario}
                  />
      
      
              <br/>
              </form>
              <br/>
              <br/>
              <br/>

        </div>
      )
}

export default EditarOtroUsuario