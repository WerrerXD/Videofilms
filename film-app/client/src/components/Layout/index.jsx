import React from "react";
import Navbar from "../NavBar";
// Импортируем ваш компонент Navbar

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main className="p-4">{children}</main>
        </>
    );
};

export default Layout;
