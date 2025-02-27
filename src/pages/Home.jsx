import { useState, useEffect, useRef } from "react";
import Info from "../components/Info";

export default function Home() {
    const [infoHeight, setInfoHeight] = useState(0);
    const infoRef = useRef(null);

    const items = [
        {
            image: "./taxi.png",
            title: "Lorem ipsum dolor",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga temporibus cum doloremque! Voluptates dolor, assumenda atque iure"
        },
        {
            image: "./ship.png",
            title: "Lorem ipsum dolor",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga temporibus cum doloremque! Voluptates dolor, assumenda atque iure"
        },
        {
            image: "./card.png",
            title: "Lorem ipsum dolor",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga temporibus cum doloremque! Voluptates dolor, assumenda atque iure"
        },
    ]

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setInfoHeight(entry.contentRect.height);
            }
        });

        if (infoRef.current) {
            observer.observe(infoRef.current);
        }

        return () => observer.disconnect();
    }, []);


    return (
        <>
            <Info ref={infoRef} />

            <div id="space" style={{ height: infoHeight - 100 }}></div>

            <div id="callToAction" className="relative">
                <div id="floater" className="absolute bg-a p-8 shadow-2xl">
                    <p className="mb-4">TRANSFER FAVIGNANA</p>
                    <h2 className="text-2xl mb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
                    <p className="mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate maiores vitae laudantium necessitatibus quae. Saepe, numquam magnam, sint recusandae quidem id eligendi iure aut nisi doloribus fugiat eos laudantium pariatur.</p>
                    <a className="bg-c p-4 uppercase text-a" href="">
                        Scopri adesso
                    </a>
                </div>
            </div>

            <div id="description" className="w-full grid grid-cols-1 md:grid-cols-2">
                <div className="p-10">
                    {items.map((item, index) => (
                        <div key={index} className="flex justify-start items-start my-4">
                            <div className="bg-b p-5 w-32 h-32">
                                <img src={item.image} alt={item.image} />
                            </div>
                            <div className="ms-3 w-1/2">
                                <h4 className="text-2xl">{item.title}</h4>
                                <p className="text-xs">{item.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center md:relative">
                    <div className="w-1/8 h-full hidden md:block"></div>
                    <div className="w-full md:w-7/8 md:h-3/4 p-15 flex items-center justify-center md:flex-none" id="descImg">
                        <div className="md:absolute bg-white w-90 flex flex-col items-center justify-center p-10 top-30 -left-15 shadow-2xl">
                            <h4 className="text-4xl mb-3 text-center">Lorem ipsum</h4>
                            <p className="text-center">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo saepe, asperiores quam quaerat repellendus temporibus aliquid officiis explicabo possimus quae, distinctio cumque reprehenderit repellat porro provident. Fugit blanditiis quasi animi.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
