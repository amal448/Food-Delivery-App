import * as React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const categories = [
    {
        category: "Snacks",
        image: "https://tse3.mm.bing.net/th/id/OIP.oGmIzgY9hTDvwDS0EDW46gAAAA?pid=Api&P=0&h=180"
    },
    {
        category: "Main Course",
        image: "https://tse2.mm.bing.net/th/id/OIP.DsUj3ArHnCzeirAaXtSIYQHaDW?pid=Api&P=0&h=180"
    },
    {
        category: "South Indian",
        image: "https://tse4.mm.bing.net/th/id/OIP.dSCkqsgKfVgX8_CbrrfDxQHaFM?pid=Api&P=0&h=180"
    },
    {
        category: "North Indian",
        image: "https://thumbs.dreamstime.com/b/north-indian-style-vegetarian-thali-served-restaurant-257163933.jpg"
    },

    {
        category: "Desserts",
        image: "https://tse4.mm.bing.net/th/id/OIP.FW5yiTX-dAXYtQzUmqtoFQHaGJ?pid=Api&P=0&h=180"
    },
    {
        category: "Pizza",
        image: "https://tse3.mm.bing.net/th/id/OIP.Gf0BoADsMA30wn_EzmqM-gHaE7?pid=Api&P=0&h=180"
    },
    {
        category: "Burgers",
        image: "https://tse2.mm.bing.net/th/id/OIP.WOEl6Ai_n6kMzkSzarvWmwHaEK?pid=Api&P=0&h=180"
    },
    {
        category: "Sandwitches",
        image: "https://tse2.mm.bing.net/th/id/OIP.ohrluOUVy__pXVpyJKAIfAHaEy?pid=Api&P=0&h=180"
    },

    {
        category: "Chinese",
        image: "https://tse3.mm.bing.net/th/id/OIP.3DZfvfWx9-MA6qz2a6UBrgHaF7?pid=Api&P=0&h=180"
    },
    {
        category: "Fast Food",
        image: "https://nypost.com/wp-content/uploads/sites/2/2016/08/fast-food-main.jpg?quality=90&strip=all&w=1236&h=820&crop=1"
    },
    {
        category: "All",
        image: "https://tse4.mm.bing.net/th/id/OIP.KCphWpjznTjk-wKgKlduqQHaEK?pid=Api&P=0&h=180"
    },

]
export function CarouselSlider({onCategorySelect}) {
    // console.log("data");

    return (
        <Carousel className="w-full mx-auto">
            <CarouselContent className="-ml-1">
                {categories.map((item, index) => (
                    <CarouselItem key={index} className="group relative pl-1 h-48 hover:cursor-pointer md:basis-1/2 lg:basis-1/8">
                        <div className="p-1 h-full "  onClick={() => onCategorySelect(item.category)}>
                            <Card className="h-full w-full p-1 relative overflow-hidden">
                                <CardContent className="p-0 h-full w-full">
                                    <img
                                        className="object-cover transform transition-all duration-500 group-hover:scale-110 group-hover:brightness-75 w-full h-full rounded-2xl"
                                        src={item.image}
                                    />
                                </CardContent>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm font-medium text-center w-[80%] py-1 rounded-lg">
                                    {item.category}
                                </div>

                            </Card>

                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
