import { Children, FC, PropsWithChildren } from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";

const Layout: FC<PropsWithChildren<unknown>> = ({children}) => {
    return <div>

        <Header />
        <div className="grid bg-secondary" style={{gridTemplateColumns: `.8fr 4fr`}}>
        <Sidebar />
        <main className="p-12 pb-52 bg-bg-color rounded-tl-lg">{children}</main>
        </div>
        </div>
}

export default Layout