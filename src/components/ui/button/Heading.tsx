import { FC, PropsWithChildren } from "react"

interface Iheading { 
classname?:string
}

const Heading: FC<PropsWithChildren<Iheading>> = ({classname, children}) => {
    return <h1 className={`font-semibold text-3xl ${classname}`}
            >{children}
            </h1>
}
export default Heading