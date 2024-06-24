import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
    const { loginWithRedirect,isAuthenticated} = useAuth0();
    const navigate = useNavigate();
    const handleAuthentication = ()=>{
        loginWithRedirect();
        if(isAuthenticated){
            navigate('/landing');
        }
    }

    return (
        <div className="flex justify-center items-center h-screen ">
            
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full relative">
            <button className="text-black text-2xl absolute top-2 right-5"onClick={()=> navigate('/landing')}>X</button>
                <div className='flex flex-col items-center'>
                <h1 className="text-3xl font-bold text-center mb-2 text-slate-600">Login To India's #2</h1>
                <h1 className="text-3xl font-bold text-center mb-6 text-slate-600">Chess Game</h1>
                 <img src={"/chessBoard.jpeg"} className="object-fit rounded-lg shadow-black mb-3" width='300px'/>
                </div>
                
                <div className="flex flex-col gap-4 items-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
                        onClick={handleAuthentication }
                    >
                        <img src="Google.jpg" alt="Google Logo" className="w-6 h-6 mr-2 inline-block align-middle bg-blue-600 mix-blend-blend rounded-lg" />
                        Login with Google
                    </button>
                    <button
                        className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-lg w-full"
                        onClick={handleAuthentication}
                    >
                        <img src="gitHub.png" alt="Facebook Logo" className="w-6 h-6 mr-2 inline-block align-middle" />
                        Login with GitHub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

