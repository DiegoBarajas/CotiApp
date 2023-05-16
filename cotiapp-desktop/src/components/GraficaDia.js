import React, { useEffect, useState } from 'react';
import backend from '../constants';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import sweetalert2 from 'sweetalert2';

var date = new Date();
const dateHoy = new Date();

const GraficaDia = () => {
  
    const [coti, setCoti] = useState([]);
    const [tick, setTick] = useState([]);
    const [usuario, setUsuario] = useState({});
    const semanas = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const [fecha, setFecha] = useState(`Hoy (${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()})`);
    
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

      if(usuario._id === undefined)getUsuario();
    });

    useEffect(()=>{
      const getCoti = async()=>{
        const {data} = await axios.get(backend()+'/api/cotizacion');

        const auxC = [];

        const diaHoy = date.getDate();         
        const mesHoy = date.getMonth()+1;         
        const yearHoy = date.getFullYear();   
        
        const fechaHoy = `${diaHoy}/${mesHoy}/${yearHoy}`;

        data.map((d)=>{
          if((d.fecha === fechaHoy) && (d.id_empresa == usuario.id_empresa)){
            auxC.push(d);
          }
        });
        setCoti(auxC);
      }

      const getTick = async()=>{
        const {data} = await axios.get(backend()+'/api/ticket');

        const auxT = [];

        const diaHoy = date.getDate();         
        const mesHoy = date.getMonth()+1;         
        const yearHoy = date.getFullYear();   
        
        const fechaHoy = `${diaHoy}/${mesHoy}/${yearHoy}`;

        data.map((d)=>{
          if((d.fecha === fechaHoy) && (d.id_empresa == usuario.id_empresa)){
            auxT.push(d);
          }
        });
        setTick(auxT);
      }

      if(coti.length === 0) getCoti();
      if(tick.length === 0) getTick();
    })

    ChartJS.register(ArcElement, Tooltip, Legend);

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: fecha,
        },
      },
    };

    useEffect(()=>{
      const getAlgoAlchNoseWe = ()=>{
        getFecha();
      }

      getAlgoAlchNoseWe();
    })

    const data = {
        labels: ['Cotizaciones', 'Tickets'],
        datasets: [
          {
            label: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`,
            data: [coti.length, tick.length],
            backgroundColor: [
                '#30D7DF',
                '#3C529F'
            ],
            borderColor: [
              '#30D7DF',
              '#3C529F'
            ],
            borderWidth: 1,
          },
        ],
      };

      const getFecha = ()=>{

        if((date.getDate() === dateHoy.getDate()) && (date.getMonth() === dateHoy.getMonth()) && (date.getFullYear() === dateHoy.getFullYear())){
          setFecha(`Hoy (${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()})`)
        }else if((date.getDate() === dateHoy.getDate()-1) && (date.getMonth() === dateHoy.getMonth()) && (date.getFullYear() === dateHoy.getFullYear())){
          setFecha(`Ayer (${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()})`)
        }else if((date.getDate() === dateHoy.getDate()-2) && (date.getMonth() === dateHoy.getMonth()) && (date.getFullYear() === dateHoy.getFullYear())){
          setFecha(`Anteayer (${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()})`)
        }else if((date.getDate() === dateHoy.getDate()-3) && (date.getMonth() === dateHoy.getMonth()) && (date.getFullYear() === dateHoy.getFullYear())){
          setFecha(`${semanas[date.getDay()]} (${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()})`)
        }else if((date.getDate() === dateHoy.getDate()-4) && (date.getMonth() === dateHoy.getMonth()) && (date.getFullYear() === dateHoy.getFullYear())){
          setFecha(`${semanas[date.getDay()]} (${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()})`)
        }else if((date.getDate() === dateHoy.getDate()-5) && (date.getMonth() === dateHoy.getMonth()) && (date.getFullYear() === dateHoy.getFullYear())){
          setFecha(`${semanas[date.getDay()]} (${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()})`)
        }else if((date.getDate() === dateHoy.getDate()-6) && (date.getMonth() === dateHoy.getMonth()) && (date.getFullYear() === dateHoy.getFullYear())){
          setFecha(`${semanas[date.getDay()]} (${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()})`)
        }else{
          setFecha(`${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()}`)
        }
      }

      const cambiarFecha = (e)=>{
        const fecha = e.target.value.split('-');
        const newDate = new Date();

        getFecha();
  
        newDate.setDate(fecha[2]);
        newDate.setMonth(fecha[1]-1);
        newDate.setFullYear(fecha[0]);
  
        date = newDate;

        setCoti([]);
        setTick([]);
      }

      const setValueDate = ()=>{
        const d = date.getDate().toString();
        const m = (date.getMonth()+1).toString();
        const year = date.getFullYear().toString();

        const dia = d.length === 1 ?
                    '0'+d :
                    d;

        const mes = m.length === 1 ?
                    '0'+m :
                    m;

        return(year+'-'+mes+'-'+dia);
      }

      const mostrarGrafica = ()=>{
        if(coti.length === 0 && tick.length === 0) return <p style={{fontSize: 12,fontWeight:'bold', paddingTop: '50px', paddingBottom: '50px', textAlign: 'center'}}>No hay registros el día <br/>{`${date.getDate()} de ${meses[date.getMonth()]} del ${date.getFullYear()}`}</p>
        else return <Pie data={data} options={options} style={{marginBottom: '10px'}}/>

      }

      return(
        <div style={{flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {mostrarGrafica()}
          <input
            type='date'
            value={setValueDate()}
            style={{width: '80%', minHeight: '30px'}}
            onChange={cambiarFecha}
          />
        </div>
      )
    
}

export default GraficaDia