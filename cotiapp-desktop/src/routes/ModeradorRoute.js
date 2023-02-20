import axios from 'axios';
import React, { useEffect } from 'react';
import backend from '../constants';

export default function LoggedRoute({ children }) {
    
    useEffect(()=>{
      const getUsuario = async()=>{
        const {data} = await axios.get(backend()+'/api/usuario/'+localStorage.getItem('id'))

        if(!data.admin && !data.dios && !data.moderador){
            window.location.href = '/home'
        }

      }

        getUsuario();
    });

    return  children 
}