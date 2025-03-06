import React, { Component } from 'react';
// You would put the ErrorBoundary as a tagname (e.g. of <tagname> </tagname>),
// this would catch and display any errors in the terminal on the browser


// class handles errors for component
class ErrorBoundary extends Component {
    // default constructor that sets the error state to false
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    // static method that returns true if error is present
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    // method that logs error to console
    componentDidCatch(error, errorInfo) { // log error to console
        console.error('ErrorBoundary caught an error', error, errorInfo); // log error to console
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>; // return error message
        }

        return this.props.children; // return children
    }
}

export default ErrorBoundary;
