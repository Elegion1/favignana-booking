import Navbar from "./Navbar";
import { useLocation } from 'react-router-dom';

export default function Masthead({ title }) {
    const location = useLocation();
    const mastHeight = location.pathname === '/' ? 'h-[80vh]' : 'h-[40vh]';

    return (
        <div id="masthead" className={`relative w-full ${mastHeight}`}>
            <Navbar />
            <div id="mastText" className="flex items-center justify-center h-full ">
                <h2 className="text-6xl text-center text-white">{title}</h2>
            </div>
        </div>
    );
}