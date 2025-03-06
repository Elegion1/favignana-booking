import { useRef, forwardRef } from "react";
import { getLabel } from "../utils/labels";

const Info = forwardRef((props, ref) => {
    const infoRef = ref || useRef(null);

    let items = [
        {
            image: './taxi.png',
            title: getLabel("taxiInfoTitle"),
            body: getLabel("taxiInfoBody"),
        },
        {
            image: './ship.png',
            title: getLabel("shipInfoTitle"),
            body: getLabel("shipInfoBody"),
        },
    ];

    return (
        <div ref={infoRef} id="info" className="w-full absolute flex justify-center items-center my-10">
            <div className=" w-7/8 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col p-5 text-white items-center justify-start bg-c">
                            <div className="bg-d rounded-full p-5 mb-5">
                                <img src={item.image} id="icon" alt="immagine" />
                            </div>
                            <p className="text-center text-4xl">{item.title}</p>
                            <p className="text-center mt-2">{item.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default Info;