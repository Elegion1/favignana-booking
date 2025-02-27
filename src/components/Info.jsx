import { useRef, forwardRef } from "react";

const Info = forwardRef((props, ref) => {
    const infoRef = ref || useRef(null);

    let items = [
        {
            image: './taxi.png',
            title: 'Taxi Privato',
            body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati voluptates ipsum facilis rerum necessitatibus provident? Aliquid, debitis! Odio, ipsum quas enim tempore aut dignissimos magnam recusandae sunt quibusdam expedita ullam.'
        },
        {
            image: './ship.png',
            title: 'Transfer Favignana',
            body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati voluptates ipsum facilis rerum necessitatibus provident? Aliquid, debitis! Odio, ipsum quas enim tempore aut dignissimos magnam recusandae sunt quibusdam expedita ullam.'
        },
    ];

    return (
        <div ref={infoRef} id="info" className="w-full absolute flex justify-center items-center my-10">
            <div className=" w-7/8 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col p-5 text-white items-center justify-center bg-c">
                            <div className="bg-d rounded-full p-5 m-4">
                                <img src={item.image} id="icon" alt="immagine" />
                            </div>
                            <p className="text-4xl">{item.title}</p>
                            <p className="text-center mt-2">{item.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default Info;