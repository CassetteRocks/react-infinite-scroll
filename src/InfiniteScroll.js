import React, { Component, PropTypes } from 'react';

export default class InfiniteScroll extends Component {
    static propTypes = {
        element: PropTypes.string,
        hasMore: PropTypes.bool,
        initialLoad: PropTypes.bool,
        loadMore: PropTypes.func.isRequired,
        pageStart: PropTypes.number,
        threshold: PropTypes.number,
        useWindow: PropTypes.bool,
        isReverse: PropTypes.bool,
        scrollElement: PropTypes.object
    };

    static defaultProps = {
        element: 'div',
        hasMore: false,
        initialLoad: true,
        pageStart: 0,
        threshold: 250,
        useWindow: true,
        isReverse: false,
        scrollElement: null
    };

    constructor(props) {
        super(props);

        this.scrollListener = this.scrollListener.bind(this);
    }

    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this.attachScrollListener();
    }

    componentDidUpdate() {
        this.attachScrollListener();
    }

    render() {
        const {
            children,
            element,
            hasMore,
            initialLoad,
            loader,
            loadMore,
            pageStart,
            threshold,
            useWindow,
            isReverse,
            scrollElement,
            ...props
        } = this.props;

        if(scrollElement) {
            props.ref = (node) => {
                this.scrollComponent = scrollElement;
            };
        } else {
            props.ref = (node) => {
                this.scrollComponent = node;
            };
        }

        return React.createElement(element, props, children, hasMore && (loader || this._defaultLoader));
    }

    calculateTopPosition(el) {
        if(!el) {
            return 0;
        }
        return el.offsetTop + this.calculateTopPosition(el.offsetParent);
    }

    scrollListener() {
        const el = this.scrollComponent;
        const scrollEl = window;

        let offset;
        if(this.props.scrollElement) {
            if (this.props.isReverse) {
                offset = el.scrollTop;
            } else
                offset = el.scrollHeight - el.scrollTop - el.clientHeight;
        } else if(this.props.useWindow) {
            var scrollTop = (scrollEl.pageYOffset !== undefined) ? scrollEl.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            if (this.props.isReverse)
                offset = scrollTop;
            else
                offset = this.calculateTopPosition(el) + el.offsetHeight - scrollTop - window.innerHeight;
        } else {
            if (this.props.isReverse)
                offset = el.parentNode.scrollTop;
            else
                offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
        }

        if(offset < Number(this.props.threshold)) {
            this.detachScrollListener();
            // Call loadMore after detachScrollListener to allow for non-async loadMore functions
            if(typeof this.props.loadMore == 'function') {
                this.props.loadMore(this.pageLoaded += 1);
            }
        }
    }

    attachScrollListener() {
        if(!this.props.hasMore) {
            return;
        }

        let scrollEl = window;
        if(this.props.scrollElement) {
            scrollEl = this.scrollComponent;
        } else if(this.props.useWindow == false) {
            scrollEl = this.scrollComponent.parentNode;
        }

        scrollEl.addEventListener('scroll', this.scrollListener);
        scrollEl.addEventListener('resize', this.scrollListener);

        if(this.props.initialLoad) {
            this.scrollListener();
        }
    }

    detachScrollListener() {
        var scrollEl = window;
        if(this.props.scrollElement) {
            scrollEl = this.scrollComponent;
        } else if(this.props.useWindow == false) {
            scrollEl = this.scrollComponent.parentNode;
        }

        scrollEl.removeEventListener('scroll', this.scrollListener);
        scrollEl.removeEventListener('resize', this.scrollListener);
    }

    componentWillUnmount() {
        this.detachScrollListener();
    }

    // Set a defaut loader for all your `InfiniteScroll` components
    setDefaultLoader(loader) {
        this._defaultLoader = loader;
    }
}
