import Navbar from "./Navbar";

export default function Masthead() {

    return (
        <div id="masthead" className="relative w-full">
            <Navbar />
            <div id="mastText" className="flex items-center justify-center h-full ">
                <h2 className="text-6xl text-center text-white">Transfer Trapani Favignana</h2>
            </div>
        </div>
    );
}