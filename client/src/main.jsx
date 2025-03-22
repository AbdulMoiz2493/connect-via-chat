import ReactDOM from "react-dom/client";
import App from "./Pages/App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import About from "./Pages/About.jsx";
import Error from "./Components/Error.jsx";
import DefaultLayout from "./Components/DefaultLayout.jsx";
import Profile from "./Pages/Profile.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from "./store/store.js";
import ProtectedRoute from "./Auth_Components/ProtectedRoute.jsx";
import LoginDisabled from "./Components/LoginDisabled.jsx";
import {CssBaseline} from "@mui/material";
import {HelmetProvider} from "react-helmet-async"
import Chat from "./Pages/Chat.jsx";
import { SocketProvider } from "../context/socketContext.jsx";


const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    path: "/",
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        element: <ProtectedRoute />,
        path: "/",
        children: [
          {
            element: <Profile />,
            path: "/profile"
          }, 
          {
            element:<><SocketProvider><Chat /></SocketProvider> </>,
            path: "/chat",
          }
        ]
      },
      {
        element: <LoginDisabled />,
        children: [
          {
            element: <Login />,
            path: "/login",
          }
        ]
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </HelmetProvider>
      </PersistGate>
    </Provider>
);
