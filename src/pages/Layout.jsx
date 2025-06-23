import Masthead from '../components/Masthead';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { getLabel } from '../utils/labels';
import seoData from '../utils/seoData';

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
    const pageSeo = seoData[location.pathname] || seoData["default"];

    return (
        <>
            <title>{pageSeo.title}</title>
            <meta name="description" content={pageSeo.description} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={`https://www.favignanatransfer.com${location.pathname}`} />
            <meta property="og:title" content={pageSeo.title} />
            <meta property="og:description" content={pageSeo.description} />
            <meta property="og:url" content={`https://www.favignanatransfer.com${location.pathname}`} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="https://www.favignanatransfer.com/og-image.jpg" />
            <meta property="og:locale" content="it_IT" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageSeo.title} />
            <meta name="twitter:description" content={pageSeo.description} />
            <meta name="twitter:image" content="https://www.favignanatransfer.com/og-image.jpg" />
            <meta name="author" content="Favignana Transfer" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
            
            <Navbar />
            <Masthead title={title} />
            <Outlet />
            <Footer />
        </>
    );
}