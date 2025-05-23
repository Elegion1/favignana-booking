import Masthead from '../components/Masthead';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { getLabel } from '../utils/labels';

export default function Layout() {
    const location = useLocation();

    const mastTitles = {
        '/': getLabel("homeMasterTitle"),
        '/transfer': getLabel("transferMasterTitle"),
        '/contact': getLabel("contactMasterTitle"),
        '/terms-and-conditions': getLabel("termsConditions"),
        '/excursion': getLabel("excursionMasterTitle"),
    };

    const title = mastTitles[location.pathname] || 'Page Not Found';

    return (
        <>
            <Navbar />
            <Masthead title={title} />
            <Outlet />
            <Footer />
        </>
    );
}