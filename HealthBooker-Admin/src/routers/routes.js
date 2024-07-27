import React, { Suspense, lazy } from "react";
import { Layout } from 'antd';
import { withRouter } from "react-router";
import Footer from '../components/layout/footer/footer';
import Header from '../components/layout/header/header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import NotFound from '../components/notFound/notFound';
import Sidebar from '../components/layout/sidebar/sidebar';
import LoadingScreen from '../components/loading/loadingScreen';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

const { Content } = Layout;

const Login = lazy(() => {
    return Promise.all([
        import('../pages/Login/login'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AccountManagement = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/accountManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ChangePassword = lazy(() => {
    return Promise.all([
        import('../pages/ChangePassword/changePassword'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Profile = lazy(() => {
    return Promise.all([
        import('../pages/Profile/profile'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AssetCategory = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AssetCategory/assetCategory'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AssetManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AssetManagement/assetManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const ResetPassword = lazy(() => {
    return Promise.all([
        import('../pages/ResetPassword/resetPassword'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ResidenceRules = lazy(() => {
    return Promise.all([
        import('../pages/Admin/ResidenceRules/residenceRules'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Notification = lazy(() => {
    return Promise.all([
        import('../pages/Admin/Notification/notification'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const DashBoard = lazy(() => {
    return Promise.all([
        import('../pages/DashBoard/dashBoard'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const NewsList = lazy(() => {
    return Promise.all([
        import('../pages/News/news'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AreaManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AreaManagement/areaManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ProductType = lazy(() => {
    return Promise.all([
        import('../pages/Admin/ProductType/productType'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ProductManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/ProductManagement/productManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Tournament = lazy(() => {
    return Promise.all([
        import('../pages/Admin/Tournament/tournament'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Register = lazy(() => {
    return Promise.all([
        import('../pages/Register/register'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const EmployeeManagement = lazy(() => {
    return Promise.all([
        import('../pages/EmployeeManagement/employeeManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const TournamentResult = lazy(() => {
    return Promise.all([
        import('../pages/Admin/TournamentResult/tournamentResult'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const OrderList = lazy(() => {
    return Promise.all([
        import('../pages/OrderList/orderList'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const DrugManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/DrugManagement/drugManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ScheduleManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/ScheduleManagement/scheduleManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const PrescriptionManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/PrescriptionManagement/prescriptionManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const RouterURL = withRouter(({ location }) => {


    const LoginContainer = () => (
        <div>
            <PublicRoute exact path="/">
                <Suspense fallback={<LoadingScreen />}>
                    <Login />
                </Suspense>
            </PublicRoute>
            <PublicRoute exact path="/login">
                <Login />
            </PublicRoute>
            <PublicRoute exact path="/reset-password/:id">
                <ResetPassword />
            </PublicRoute>
            <PublicRoute exact path="/register">
                <Register />
            </PublicRoute>
        </div>
    )

    const DefaultContainer = () => (
        <PrivateRoute>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout >
                    <Header />
                    <Content style={{ marginLeft: 230, width: 'calc(100% - 230px)', marginTop: 55 }}>
                        <PrivateRoute exact path="/account-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/order-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <OrderList />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/profile">
                            <Suspense fallback={<LoadingScreen />}>
                                <Profile />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/change-password/:id">
                            <Suspense fallback={<LoadingScreen />}>
                                <ChangePassword />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/area-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AreaManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/asset-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <AssetCategory />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/asset-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AssetManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/residence-rules">
                            <Suspense fallback={<LoadingScreen />}>
                                <ResidenceRules />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/notifications">
                            <Suspense fallback={<LoadingScreen />}>
                                <Notification />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/dash-board">
                            <Suspense fallback={<LoadingScreen />}>
                                <DashBoard />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/product-type-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <ProductType />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/product-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <ProductManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/tournament">
                            <Suspense fallback={<LoadingScreen />}>
                                <Tournament />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/news-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <NewsList />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/employee-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <EmployeeManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/tournament-result">
                            <Suspense fallback={<LoadingScreen />}>
                                <TournamentResult />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/drug-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <DrugManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/schedule-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <ScheduleManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/prescription-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <PrescriptionManagement />
                            </Suspense>
                        </PrivateRoute>
                        
                       

                        <PrivateRoute exact path="/notfound">
                            <NotFound />
                        </PrivateRoute>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </PrivateRoute >
    )

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LoginContainer />
                    </Route>

                    <Route exact path="/register">
                        <LoginContainer />
                    </Route>
                    <Route exact path="/login">
                        <LoginContainer />
                    </Route>

                    <Route exact path="/reset-password/:id">
                        <LoginContainer />
                    </Route>

                    <Route exact path="/profile">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/change-password/:id">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/area-management">
                        <DefaultContainer />
                    </Route>


                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/account-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-list">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/maintenance-planning">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/tournament-result">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/sales-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-history">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/maintenance-history">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-report">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/residence-event">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/residence-event-details/:id">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/residence-rules">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/customer-enrollment">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/room-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/contracts-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/complaint-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/reception-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/news-list">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/unauthorized-entry">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/order-list">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/employee-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/notifications">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/prescription-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/product-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/drug-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/product-type-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/schedule-management">
                        <DefaultContainer />
                    </Route>

                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
})

export default RouterURL;
