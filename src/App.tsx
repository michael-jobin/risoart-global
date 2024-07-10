import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './Layout'
import ErrorPage from './ErrorPage'
import Home from './pages/Home'
import About from './pages/About'
import ArtList from './pages/ArtList'
import Art from './pages/Art'
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'about',
          element: <About />,
        },
        {
          path: 'art-list',
          element: <ArtList />,
        },
        {
          path: 'art-list/:slug',
          element: <Art />,
        },
      ],
    },
  ],
  {
    basename: '/global/',
  }
)
const App = () => {
  useEffect(() => {
    const setVh = () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setVh()
    window.addEventListener('resize', setVh)
    return () => window.removeEventListener('resize', setVh)
  }, [])

  return <RouterProvider router={router} />
}

export default App
