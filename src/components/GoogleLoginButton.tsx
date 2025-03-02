import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full max-w-xs px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    >
      <FcGoogle className="w-6 h-6 mr-2" />
      Iniciar sesión con Google
    </button>
  );
};

export default GoogleLoginButton;
