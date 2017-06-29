import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import InfiniteScroll from '../src/InfiniteScroll';

describe('InfiniteScroll component', () => {
  it('should render', () => {
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );

    const wrapper = mount(
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={false}
        >
          <div className="om-product__list">
            {children}
          </div>
        </InfiniteScroll>
      </div>,
    );
    expect(wrapper.find('.child-class').length).to.equal(3);
  });

  it('should render componentDidMount', () => {
    spy(InfiniteScroll.prototype, 'componentDidMount');
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );
    mount(
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={false}
        >
          <div className="om-product__list">
            {children}
          </div>
        </InfiniteScroll>
      </div>,
    );
    expect(InfiniteScroll.prototype.componentDidMount.callCount).to.equal(1);
    InfiniteScroll.prototype.componentDidMount.restore();
  });

  it('should attach scroll listeners', () => {
    spy(InfiniteScroll.prototype, 'attachScrollListener');
    spy(InfiniteScroll.prototype, 'scrollListener');
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );
    mount(
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore
          useWindow={false}
          threshold={0}
        >
          <div className="om-product__list">
            {children}
          </div>
        </InfiniteScroll>
      </div>,
    );
    expect(InfiniteScroll.prototype.attachScrollListener.callCount).to.equal(1);
    expect(InfiniteScroll.prototype.scrollListener.callCount).to.equal(1);
    InfiniteScroll.prototype.attachScrollListener.restore();
    InfiniteScroll.prototype.scrollListener.restore();
  });

  it('should render Loader', () => {
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
      </div>
    );

    const wrapper = mount(
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          isLoading
          hasMore={false}
          loader={<div className="loader-class" />}
        >
          <div className="om-product__list">
            {children}
          </div>
        </InfiniteScroll>
      </div>,
    );
    expect(wrapper.find('.loader-class').length).to.equal(1);
  });

  it('should not attach scroll listeners when isLoading is equal true', () => {
    spy(InfiniteScroll.prototype, 'attachScrollListener');
    spy(InfiniteScroll.prototype, 'scrollListener');
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
      </div>
    );
    mount(
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore
          isLoading
          useWindow={false}
          threshold={0}
        >
          <div className="om-product__list">
            {children}
          </div>
        </InfiniteScroll>
      </div>,
    );
    expect(InfiniteScroll.prototype.attachScrollListener.callCount).to.equal(1);
    expect(InfiniteScroll.prototype.scrollListener.callCount).to.equal(0);
    InfiniteScroll.prototype.attachScrollListener.restore();
    InfiniteScroll.prototype.scrollListener.restore();
  });
});
