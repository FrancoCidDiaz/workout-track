import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router"; // Asegúrate de usar "react-router-dom"
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const { login, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/app"); // Si el usuario está autenticado, redirige automáticamente
    }
  }, [user, navigate]);

  const onLogin = async () => {
    await login();
    navigate("/app");
  };

  // Si el usuario está autenticado, no renderizamos nada (useEffect maneja la redirección)
  if (user) return null;

  return (
    <div className="flex flex-col items-center justify-center mx-auto my-auto h-screen gap-4">
      <h2 className="text-4xl">Workout tracker</h2>
      <GoogleLoginButton onClick={onLogin} />
      <Link to="/app" className="rojo-oscuro p-3 rounded-sm">
        Quiero continuar sin iniciar sesión y no guardar mis entrenamientos
      </Link>
    </div>
  );
};

export default Login;
