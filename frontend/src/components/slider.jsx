import * as React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselSlider() {
    return (
        <Carousel className="w-full mx-auto">
            <CarouselContent className="-ml-1">
                {Array.from({ length: 12 }).map((_, index) => (
                    <CarouselItem key={index} className="group relative pl-1 h-48 hover:cursor-pointer md:basis-1/2 lg:basis-1/8">
                        <div className="p-1 h-full">
                            <Card className="h-full w-full p-1 relative overflow-hidden">
                                <CardContent className="p-0 h-full w-full">
                                    <img
                                        className="object-cover transform transition-all duration-500 group-hover:scale-110 group-hover:brightness-75 w-full h-full rounded-2xl"
                                        src="https://tse4.mm.bing.net/th/id/OIP.xjqwsvmf_Y3WC4FtoPP0CQHaEK?pid=Api&P=0&h=180"
                                    />
                                </CardContent>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-sm font-medium">
                                    title
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
