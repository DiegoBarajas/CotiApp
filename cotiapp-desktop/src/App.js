import {Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import NavbarHidden from './components/NavbarHidden';
import Index from './pages/Index';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Usuario from './pages/Usuario';
import EditarEmpresa from './pages/EditarEmpresa';
import LoggedRoute from './routes/LoggedRoute';
import DiosRoute from './routes/DiosRoute';
import AdminRoute from './routes/AdminRoute';
import ModeradorRoute from './routes/ModeradorRoute';
import EditarUsuario from './pages/EditarUsuario';
import SplashScreen from './pages/SplashScreen';
import EditarCliente from './pages/EditarCliente';
import Dashboard from './pages/Dashboard';
import EditarOtroUsuario from './pages/EditarOtroUsuario';
import AgregarEmpresa from './pages/AgregarEmpresa';
import AgregarUsuario from './routes/AgregarUsuario';
import ListaClientes from './pages/ListaClientes';
import VerCotizacion from './pages/VerCotizacion';
import ListaCotizaciones from './pages/ListaCotizaciones';
import GestionarEmpresas from './pages/GestionarEmpresas';
import EditarOtraEmpresa from './pages/EditarOtraEmpresa';
import VerTicket from './pages/VerTicket';
import ListaTickets from './pages/ListaTickets';

function App() {
  return (
    <div>
      <Navbar/>
      <NavbarHidden/>
      <div>
        <Routes>
          <Route path='/' element={<SplashScreen/>}/>
          <Route path='/home' element={<LoggedRoute><Index/></LoggedRoute>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/logout' element={<Logout/>}/>
          <Route path='/usuario' element={<LoggedRoute><Usuario/></LoggedRoute>}/>
          <Route path='/editar/empresa' element={<AdminRoute><EditarEmpresa/></AdminRoute>}/>
          <Route path='/editar/usuario' element={<EditarUsuario/>}/>
          <Route path='/editar/usuario/:id' element={<ModeradorRoute><EditarOtroUsuario/></ModeradorRoute>}/>
          <Route path='/editar/cliente/:id' element={<LoggedRoute><EditarCliente/></LoggedRoute>}/>
          <Route path='/dashboard' element={<ModeradorRoute><Dashboard/></ModeradorRoute>}/>
          <Route path='/gestionar/empresas' element={<DiosRoute><GestionarEmpresas/></DiosRoute>}/>
          <Route path='/agregar/empresa' element={<DiosRoute><AgregarEmpresa/></DiosRoute>}/>
          <Route path='/agregar/usuario' element={<AdminRoute><AgregarUsuario/></AdminRoute>}/>
          <Route path='/lista/clientes' element={<LoggedRoute><ListaClientes/></LoggedRoute>} />
          <Route path='/lista/cotizaciones' element={<LoggedRoute><ListaCotizaciones/></LoggedRoute>} />
          <Route path='/lista/tickets' element={<LoggedRoute><ListaTickets/></LoggedRoute>} />
          <Route path='/empresa/:id' element={<DiosRoute><EditarOtraEmpresa/></DiosRoute>}/>

          <Route path='/cotizacion/:id/:borrable' element={<LoggedRoute><VerCotizacion/></LoggedRoute>}/>
          <Route path='/ticket/:id/:borrable' element={<LoggedRoute><VerTicket/></LoggedRoute>}/>


        </Routes>
      </div>
    </div>
  );
}

export default App;
