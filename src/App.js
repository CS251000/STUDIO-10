import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import AddItem from "./components/AddItem";
import CardDetails from "./components/CardDetails";


const Layout = () => (
  <>
    <Nav />
    <Outlet />
  </>
);

const router= createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
      {path:"/",
        children:[
          {index:true, element:<Home/>},
          {path:":itemId",element:<CardDetails/>}
        ]
      },
      {path:"/add",element:<AddItem/>},
      
    ]
  }
]);

export default function App() {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}