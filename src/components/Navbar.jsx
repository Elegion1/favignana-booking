import { NavLink } from 'react-router-dom';
import { getLabel } from '../utils/labels';


export default function Navbar() {
    
    const activeClass = "text-blue-800 font-bold capitalize";
    const inactiveClass = "text-b capitalize";
    

    const text = [
        {
            link: "/",
            name: getLabel("home"),
        },
        {
            link: "/transfer",
            name: getLabel("transfer"),
        },
        {
            link: "/contact",
            name: getLabel("contactUs"),
        }
    ];

    return (
        <>
            <div className="h-24 absolute top-0 left-0 w-full flex justify-center items-center flex-col z-10 bg-gray-200/35">
                <h1 className="text-3xl text-a">Favignana Transfer</h1>
                <div>
                    <ul className="flex justify-center items-center space-x-4">
                        {text.map((item, index) => (
                            <li key={index}>
                                <NavLink
                                    to={item.link}
                                    className={({ isActive }) =>
                                        isActive ? activeClass : inactiveClass
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
           
        </>
    );
}