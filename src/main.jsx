import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Login from './Pages/Login.jsx'
import SignUp from './Pages/SignUp.jsx'
import ErrorPage from './Pages/Error/ErrorPage.jsx'
import GameSetup from './Pages/GameSetup.jsx'
import DartBoard from './Pages/DartsBord.jsx'
import PlayerDetails from './Pages/PlayerDetails.jsx'
import Info from './Pages/Info.jsx'
import RootLayout from './Navigation/RootLayout.jsx'
import './App.css'


const browserRouter = createBrowserRouter([
  {
    path:"/",
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/Login',
        element: <Login />,
      },
      {
        path: '/Register',
        element: <SignUp />,
      },
      {
        path: '/Info',
        element: <Info />,
      },
      {
        path: '/game',
        element: <GameSetup />,
      },
      {
        path: '/playerdetails/:userId',
        element: <PlayerDetails />,
      }
    ],
    errorElement: <ErrorPage/>,
  },
  {
    path: '/board',
    element: <DartBoard />,
  },

]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode >
      <RouterProvider  router={browserRouter}>
        <App />
      </RouterProvider>
  </React.StrictMode>,
)
