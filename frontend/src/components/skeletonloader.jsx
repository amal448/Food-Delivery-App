import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const Skeletonloader = () => {
    return (
        <div className="flex flex-row flex-wrap  gap-2 space-y-3 mt-5">
            {
                Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col space-y-2">
                        <Skeleton className="h-[200px] w-[180px] rounded-xl" />
                        <Skeleton className="h-4 " />
                    </div>
                ))
            }
           
        </div>
    )
}

export default Skeletonloader