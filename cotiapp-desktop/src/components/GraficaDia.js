import React, { useEffect, useState } from 'react';
import backend from '../constants';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import sweetalert2 from 'sweetalert2';

const GraficaDia = () => {

    const [coti, setCoti] = useState([]);
    const [tick, setTick] = useState([]);
    const [usuario, setUsuario] = useState({});
    const date = new Date()
    
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
        console.log(auxC);
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
        console.log(auxT);
      }

      if(coti.length === 0) getCoti();
      if(tick.length === 0) getTick();
    })

    

    ChartJS.register(ArcElement, Tooltip, Legend);


    const data = {
        labels: ['Cotizaciones', 'Tickets'],
        datasets: [
          {
            label: 'Hoy',
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

    return <Pie data={data} style={{width: '40%'}} />
    
}

export default GraficaDia