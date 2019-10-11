import React, { Component, Fragment } from 'react';
import { array, bool, func, shape, string } from 'prop-types';

import Main from 'src/components/Main';
import Mask from 'src/components/Mask';
import Navigation from 'src/components/Navigation';
import CustomerPopup from 'src/components/CustomerPopup';
import OnlineIndicator from 'src/components/OnlineIndicator';
import A2HS from 'src/components/A2HS';
import renderRoutes from './renderRoutes';
import { ToastContainer } from "react-toastify";
import "src/styles/ReactToastify.scss";

class App extends Component {
    static propTypes = {
        app: shape({
            drawer: string,
            hasBeenOffline: bool,
            isOnline: bool,
            overlay: bool.isRequired,
            formType: string,
            openCustomerPopup: bool
        }).isRequired,
        closeDrawer: func.isRequired,
        markErrorHandled: func.isRequired,
        unhandledErrors: array
    };

    static get initialState() {
        return {
            renderError: null
        };
    }

    get errorFallback() {
        const { renderError } = this.state;
        if (renderError) {
            return (
                <Fragment>
                    <Main isMasked={true} />
                    <Mask isActive={true} />
                </Fragment>
            );
        }
    }

    get onlineIndicator() {
        const { app } = this.props;
        const { hasBeenOffline, isOnline } = app;

        // Only show online indicator when
        // online after being offline
        return hasBeenOffline ? <OnlineIndicator isOnline={isOnline} /> : null;
    }

    // Defining this static method turns this component into an ErrorBoundary,
    // which can re-render a fallback UI if any of its descendant components
    // throw an exception while rendering.
    // This is a common implementation: React uses the returned object to run
    // setState() on the component. <App /> then re-renders with a `renderError`
    // property in state, and the render() method below will render a fallback
    // UI describing the error if the `renderError` property is set.
    static getDerivedStateFromError(renderError) {
        return { renderError };
    }

    recoverFromRenderError = () => window.location.reload();

    state = App.initialState;

    render() {
        const { errorFallback } = this;
        if (errorFallback) {
            return errorFallback;
        }
        const {
            app,
            closeDrawer
        } = this.props;
        const { onlineIndicator } = this;
        const { drawer, overlay, formType, openCustomerPopup } = app;
        const navIsOpen = drawer === 'nav';

        return (
            <Fragment>
                <Main isMasked={overlay} formType={formType} openCustomerPopup={openCustomerPopup}>
                    <Mask isActive={overlay} dismiss={closeDrawer} />
                    {/* <Navigation isOpen={navIsOpen} /> */}
                    <CustomerPopup formType={formType} isOpen={openCustomerPopup} />
                    <ToastContainer
                        autoClose={3000}
                        position={"top-center"}
                        hideProgressBar={true}
                        closeOnClick={true}
                    />
                    <A2HS />
                    {onlineIndicator}
                    {renderRoutes()}
                </Main>
            </Fragment>
        );
    }
}

export default App;
