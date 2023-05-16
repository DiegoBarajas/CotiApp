import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import backend from '../constants';
import sweetalert2 from 'sweetalert2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  var fechaInicio = new Date();
  var fechaFin = new Date();

  const GraficaCotizacionesTickets = () => {

    const options = {
        responsive: true,
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Productos',
          },
        },
      };
      
    const [items, setItems] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [cotizaciones, setCotizaciones] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [labels, setLabels] = useState([]);
    const [txtError, settxtError] = useState('');

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
      }
    });

    useEffect(()=>{
      const getCotizaciones = async()=>{
        const {data} = await axios.get(backend()+'/api/cotizacion');
        const aux = [];

        data.map((d)=>{
          if(d.id_empresa === usuario.id_empresa)
            aux.push(d);
        });

        setCotizaciones(aux);
      }

      const getTickets = async()=>{
        const {data} = await axios.get(backend()+'/api/ticket');
        const aux = [];

        data.map((d)=>{
          if(d.id_empresa === usuario.id_empresa)
            aux.push(d);
        });

        setTickets(aux);
      }

      if((usuario._id !== undefined) && (cotizaciones.length === 0)) getCotizaciones();
      if((usuario._id !== undefined) && (tickets.length === 0)) getTickets();
    });

    useEffect(()=>{
      const getItems = async()=>{
        const {data} = await axios.get(backend()+'/api/item');
        const aux = [];

        data.map((d)=>{
          if(cotizaciones.find(obj => obj._id == d.id_doc) !== undefined)
            aux.push(d);

          if(tickets.find(obj => obj._id == d.id_doc) !== undefined)
            aux.push(d);
        })
        
        setItems(aux);
      }

        if(((tickets.length > 0) && (cotizaciones.length > 0)) && (items.length === 0)) getItems();
    });

    const [cotis, setCotis] = useState([0,0,0,0,0,0,0]);
    const [tick, setTick] = useState([0,0,0,0,0,0,0]);

    useEffect(()=>{
      const getLabels = ()=>{
        const aux = [];
        const c = []; const t = [];

        items.map((i)=>{
          const dateItem = new Date(i.createdAt);

          if(isDateInRange(dateItem, fechaInicio, fechaFin)){
            if(aux.indexOf(i.articulo) === -1)
              aux.push(i.articulo);
          }
        });

        items.map((i)=>{
          const dateItem = new Date(i.createdAt);
          const index = aux.indexOf(i.articulo);
          
          if(isDateInRange(dateItem, fechaInicio, fechaFin)){
            if(i.tipo == 'cotizacion'){
              if(c[index] === undefined) c[index] = 1;
              else c[index] = c[index]+1;
            }else if(i.tipo == 'ticket'){
              if(t[index] === undefined) t[index] = 1;
              else t[index] = t[index]+1;
            }
          }

        });

        setCotis(c);
        setTick(t);
        setLabels(aux);
      }

      if((items.length > 0) && (labels.length===0)) getLabels();
    })

    const data = {
        labels,
        datasets: [
          {
            label: 'Cotizaciones',
            data: cotis,
            borderColor: '#63CCD1',
            backgroundColor: '#63CCD1',
          },
          {
            label: 'Tickets',
            data: tick,
            borderColor: '#DC1F49',
            backgroundColor: '#DC1F49',
          },
        ],
      };

      const cambiarFecha = (e)=>{
        const fecha = e.target.value.split('-');
        const {name} = e.target;
        const newDate = new Date();
  
        newDate.setDate(fecha[2]);
        newDate.setMonth(fecha[1]-1);
        newDate.setFullYear(fecha[0]);
  
        if(name === 'fechaInicio')
          fechaInicio = newDate;
        else if(name === 'fechaFin')
          fechaFin = newDate;

        if(fechaInicio > fechaFin)
          settxtError('La primer fecha debe ser antes de la segunda fecha');
        else 
          settxtError('');

        setLabels([]);
      }

      const setValueDate = (date)=>{
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

    return <div style={{width: '100%', height: '250px',flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
        <Bar options={options} data={data} />
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginLeft: 20, marginRight: 20}}>
              <p style={{marginBottom: 0}}>Del:</p>
              <input
                type='date'
                style={{width: '100%', minHeight: '30px'}}
                name='fechaInicio'
                onChange={cambiarFecha}
                value={setValueDate(fechaInicio)}
            />
            </div>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginLeft: 20, marginRight: 20}}>
              <p style={{marginBottom: 0}}>Al:</p>
              <input
                type='date'
                style={{width: '100%', minHeight: '30px'}}
                name='fechaFin'
                onChange={cambiarFecha}
                value={setValueDate(fechaFin)}

            />
            </div>
          </div>
          <p style={{color: 'red', fontWeight: 'bold', margin: 0, padding: 0, marginTop: 5}}>{txtError}</p>
        </div>
}

export default GraficaCotizacionesTickets

function isDateInRange(date, startDate, endDate){
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);


  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59);
  endDate.setMilliseconds(999);
  return date >= startDate && date <= endDate;
};