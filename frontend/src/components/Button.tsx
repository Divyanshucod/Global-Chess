import React, { ReactNode } from "react"

export const Button = ({onClick,children,color}:{onClick: ()=> void, children:ReactNode,color?:String})=>{
    return  <div className="md:mt-4 md:mx-4">
    <button className={`${color} text-white w-full h-full rounded-md cursor-pointer px-3 py-2 md:px-5 text-2xl md:py-4`} onClick={onClick}> {children}</button>
</div>
}