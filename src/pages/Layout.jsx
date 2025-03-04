import Masthead from '../components/Masthead';
import Footer from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { getLabel } from '../utils/labels';

export default function Layout() {
    const location = useLocation();

    const mastTitles = {
        '/': getLabel("homeMasterTitle"),
        '/transfer': getLabel("transferMasterTitle"),
        '/contact': getLabel("contactMasterTitle"),
        '/terms-and-conditions': getLabel("termsConditions"),
    };

    const title = mastTitles[location.pathname] || 'Page Not Found';

    return (
        <>
            <Masthead title={title} />
            <Outlet />
            <Footer />
        </>
    );
}