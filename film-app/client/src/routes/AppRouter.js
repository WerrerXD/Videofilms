import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import NotFound from "../pages/NotFound";
import Layout from "../components/Layout";

const AppRouter = ({ isAdmin }) => {
    return (
        <Layout>
            <Routes>
                {/* Рендерим только те маршруты, которые соответствуют статусу пользователя */}
                {routes
                    .filter(({ adminOnly }) => !adminOnly || isAdmin) // Показываем adminOnly маршруты только для админа
                    .map(({ path, Component }) => (
                        <Route key={path} path={path} Component={Component} exact />
                    ))}
                <Route path="*" Component={NotFound} />
            </Routes>
        </Layout>
    );
};

export default AppRouter;
