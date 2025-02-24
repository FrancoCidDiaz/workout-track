import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const { login, user } = useAuthStore();
  const navigate = useNavigate();

  const onLogin = async () => {
    await login()
    navigate("/app")
    const token = await user.getIdToken();
    console.log(token); // Copia este valor
  }

  return (
    <div className="flex flex-col">
        <button onClick={onLogin}>Iniciar sesión con Google</button>
        <Link to={"/app"}>Quiero continuar sin iniciar sesion y no guardar mis entrenamientos</Link>
        </div>

  )
}

export default Login

