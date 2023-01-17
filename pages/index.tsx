import { useEffect, useState } from "react";
import Header from "../components/header";

const Home = () => {
    const img = [
        <img key={1} src="https://cdn.pixabay.com/photo/2018/07/26/09/56/ecommerce-3563183_960_720.jpg" />,
        <img key={2} src="https://cdn.pixabay.com/photo/2017/03/13/17/26/ecommerce-2140603_960_720.jpg" />,
        <img key={3} src="https://cdn.pixabay.com/photo/2015/02/05/08/10/iphone-624709_960_720.jpg" />,
    ]

    const [activeIndex, setActiveIndex] = useState(0);
 
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => {
                const res = current === img.length - 1 ? 0 : current + 1;
                return res
            })
        }, 5000)
        return () => clearInterval()
    }, [])
 
    const prevImgIndex = activeIndex ? activeIndex - 1 : img.length - 1;
    const nextImgIndex = activeIndex === img.length - 1 ? 0 : activeIndex + 1;

    return (
        <>
            <Header />
            <main>
                <h2 className="title">Интернет магазин "Online shop"</h2>
                <div className="slider">
                    <div className="slider-img slider-img-prev"
                            key={prevImgIndex}>
                        {img[prevImgIndex]}
                    </div>
                    <div className="slider-img"
                            key={activeIndex}>
                        {img[activeIndex]}
                    </div>
                    <div className="slider-img slider-img-next"
                            key={nextImgIndex}>
                        {img[nextImgIndex]}
                    </div>
                </div>
            </main>
        </>
    )
}
export default Home