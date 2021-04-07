import React from "react";
interface Props {
    element?: string;
    hasMore?: boolean;
    pageStart?: number;
    threshold?: number;
    useWindow?: boolean;
    isReverse?: boolean;
    useCapture?: boolean;
    initialLoad?: boolean;
    loader?: React.ReactNode;
    getScrollParent?: () => Element;
    loadMore: (page: number) => void;
}
declare const InfiniteScroll: React.FC<Props>;
export default InfiniteScroll;
