import Masthead from '../components/Masthead';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <>
            <Masthead />
            <Outlet />
            <Footer />
        </>
    )
}