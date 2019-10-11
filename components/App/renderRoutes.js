import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Page } from '@magento/peregrine';
import ErrorView from 'src/components/ErrorView/index';
import CreateAccountPage from 'src/components/CreateAccountPage/index';
import Search from 'src/RootComponents/Search';
import Checkout from 'src/RootComponents/Checkout';
import Cart from 'src/RootComponents/Cart';
import Customer from 'src/RootComponents/Customer';
import ResetPassword from 'src/components/ResetPassword'

const renderRoutingError = props => <ErrorView {...props} />;

const renderRoutes = () => (
    <Switch>
        <Route exact path="/search.html" component={Search} />
        <Route exact path="/cart.html" component={Cart} />
        <Route exact path="/checkout.html" component={Checkout} />
        <Route exact path="/create-account" component={CreateAccountPage} />
        <Route exact path="/customer.html" component={Customer} />
        <Route exact path="/resetpassword.html" component={ResetPassword} />
        <Route render={() => <Page>{renderRoutingError}</Page>} />
    </Switch>
);

export default renderRoutes;
