import axios from 'axios';
import React, { useState } from 'react'
import backend from '../constants';
import sweetalert2 from 'sweetalert2';
import { PhotoProvider, PhotoView } from 'react-image-previewer';
import Label from '../components/Label';
import Titulo from '../components/Titulo';

const AgregarEmpresa = () => {
  

    const [newEmpresa, setNewEmpresa] = useState({});
    const [imgName, setimgName] = useState('No se eligió ninguna imagen');
    const [imagen, setImagen] = useState('');
    const [imgInicio, setImgInicio] = useState('');
  
  
  
    const cambiarValor = (e)=>{
    const {name, value} = e.target;
        setNewEmpresa({...newEmpresa, [name]: value});
    }
  
    const submit = async(e)=>{
        e.preventDefault();

        const img = document.getElementById('input-img');

        if(img.value === ''){
            sweetalert2.fire({
                icon: 'warning',
                iconColor: 'red',
                title: '¡Atencion!',
                text: 'Debes agregar una imagen',
                color: 'black',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#F5305C'
              })

              return;
        }  

        document.getElementById('btn1').disabled = true;
  
        const formData = new FormData();
        formData.append('nombre', newEmpresa.nombre);
        formData.append('correo', newEmpresa.correo);
        formData.append('telefono', newEmpresa.telefono);
        formData.append('pagina', newEmpresa.pagina);
        formData.append('direccion', newEmpresa.direccion);
        formData.append('folio_coti', newEmpresa.folio_coti);
        formData.append('folio_ticket', newEmpresa.folio_ticket);
        formData.append('condiciones', newEmpresa.condiciones);
        formData.append('footer', newEmpresa.footer);
        formData.append("img", img.files[0]);        
        
  
        const {data} = await axios.post(backend()+'/api/empresa/', formData)
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
            document.getElementById('btn1').disabled = false;
  
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
  
          document.getElementById('btn1').disabled = false;
  
  
          Toast.fire({
            icon: 'success',
            title: '¡Empresa agregada exitosamente! :D'
          });

          setNewEmpresa({})
          
        }else{
          document.getElementById('btn1').disabled = false;
  
          sweetalert2.fire({
            icon: 'error',
            iconColor: 'red',
            title: 'Ha ocurrido un error al agregar el registro',
            text: 'Por favor, intentalo nuevamente',
            color: 'black',
            footer: '<p>Si el problema persiste reporte el error al correo: <a href="mailto:cotiapp.dev@gmail.com">cotiapp.dev@gmail.com</a></p>',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#F5305C'
          })
        }
  
      }
  
      const cancelar = ()=>{
        window.location.href = '/dashboard';
      }
  
      const cambiarImg = ()=>{
        var form_img = document.getElementById("input-img");
        var img = document.getElementById("img");
        
        if(form_img.files[0] !== undefined){
          var url = URL.createObjectURL(form_img.files[0]);
          img.src = url;
          setimgName(form_img.files[0].name)
          setImagen(url);
        }else{
          img.src = imgInicio;
          setImagen(imgInicio);
          setimgName('No se eligió ninguna imagen')
        }
      }

        return (
          <div className='div-editar-empresa-main'>
            <Titulo>Agregar Empresa</Titulo>
            
            <form onSubmit={submit} className='form-editar-empresa'>
            <br/><br/>
              
  
              <div className='div-input-editar-empresa'>
                <Label>Nombre de la empresa:</Label>
                <input
                  className='input-editar-empresa-completo'
                  type='text'
                  value={newEmpresa.nombre}
                  name='nombre'
                  placeholder='Nombre de la empresa'
                  required
  
                  onChange={cambiarValor}
                />
              </div>
  
              <div className='div-input-editar-empresa-doble'>
  
                <div className='div-input-editar-empresa-item'>
                  <Label>Correo de la empresa:</Label>
                  <input
                    className='input-editar-empresa-completo'
                    type='email'
                    value={newEmpresa.correo}
                    name='correo'
                    placeholder='Correo de la empresa'
                    required
  
                    onChange={cambiarValor}
                  />
                </div>
  
                <div className='div-input-editar-empresa-item'>
                  <Label>Telefono de la empresa:</Label>
                  <input
                    className='input-editar-empresa-completo'
                    type='number'
                    value={newEmpresa.telefono}
                    name='telefono'
                    minLength='10'
                    placeholder='Telefono de la empresa'
                    required
  
                    onChange={cambiarValor}
                  />
                </div>
  
              </div>
  
              <div className='div-input-editar-empresa'>
                  <Label>Página web de la empresa:</Label>
                  <input
                    className='input-editar-empresa-completo'
                    type='url'
                    value={newEmpresa.pagina}
                    name='pagina'
                    placeholder='Página web de la empresa (https://cotiapp.com)'
                    required
  
                    onChange={cambiarValor}
                  />
                </div>
                

              <div className='div-input-editar-empresa'>
              <Label>Dirección de la empresa:</Label>
              <textarea
                className='text-area-editar-empresa'
                value={newEmpresa.direccion}
                name='direccion'
                placeholder='Dirección de la empresa'
                required

                onChange={cambiarValor}
              />
            </div>


            <div className='div-input-editar-empresa-doble'>
  
            <div className='div-input-editar-empresa-item'>
                <Label>Folio de Cotización inicial:</Label>
                <input
                className='input-editar-empresa-completo'
                type='text'
                value={newEmpresa.folio_coti}
                name='folio_coti'
                placeholder='Folio de Cotización inicial'
                required

                onChange={cambiarValor}
                />
            </div>

            <div className='div-input-editar-empresa-item'>
                <Label>Folio de Ticket inicial:</Label>
                <input
                className='input-editar-empresa-completo'
                type='text'
                value={newEmpresa.folio_ticket}
                name='folio_ticket'
                placeholder='Folio de Ticket inicial'
                required

                onChange={cambiarValor}
                />
            </div>

            </div>

  
              <div className='div-input-editar-empresa'>
                <Label>Condiciones de Servicio:</Label>
                <textarea
                  className='text-area-editar-empresa'
                  value={newEmpresa.condiciones}
                  name='condiciones'
                  placeholder='Condiciones de Servicio'
                  required
  
                  onChange={cambiarValor}
                />
              </div>
  
              <div className='div-input-editar-empresa'>
                <Label>Footer del ticket/cotización:</Label>
                <textarea
                  className='text-area-editar-empresa'
                  value={newEmpresa.footer}
                  name='footer'
                  placeholder='Footer del ticket/cotización'
                  required
  
                  onChange={cambiarValor}
                />
              </div>
  
              <div className='div-input-editar-empresa'>
                <Label htmlFor='input-img'>Seleccione una imagen (De preferencia con fondo blanco o transparente):</Label>
                <div className='div-editar-empresa-label-p'>
                  <label htmlFor='input-img' className='boton1'>Seleccionar Imagen </label>
                  <p className='label-p-editar-empresa'>{imgName}</p>
                </div>
                <input
                className='hide'
                id='input-img'
                type='file'
                accept='image/*'
                onChange={cambiarImg}
                  
            />
  
            <PhotoProvider>
              <PhotoView src={imagen}>
                <img src={imgInicio} alt='' id='img' className='img-editar-empresa'/>
              </PhotoView>
            </PhotoProvider>
                  
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

export default AgregarEmpresa