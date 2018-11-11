import { configure, mount } from "enzyme";
import * as React from "react";
import InfiniteScroll from "./InfiniteScroll";

// Configure enzyme
import * as Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

describe("InfiniteScroll component", () => {
  it("should render", () => {
    const loadMore = jest.fn();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );

    const wrapper = mount(
      <div>
        <InfiniteScroll hasMore={false} loadMore={loadMore} pageStart={0}>
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>
    );
    expect(wrapper.find(".child-class").length).toEqual(3);
  });

  it("should render componentDidMount", () => {
    let spy = jest.spyOn(InfiniteScroll.prototype, "componentDidMount");
    const loadMore = jest.fn();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );
    mount(
      <div>
        <InfiniteScroll hasMore={false} loadMore={loadMore} pageStart={0}>
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>
    );
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it("should attach scroll listeners", () => {
    let attachScrollListenerSpy = jest.spyOn(
      InfiniteScroll.prototype,
      "attachScrollListener"
    );
    let scrollListenerSpy = jest.spyOn(
      InfiniteScroll.prototype,
      "scrollListener"
    );
    const loadMore = jest.fn();
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
          hasMore
          loadMore={loadMore}
          pageStart={0}
          threshold={0}
          useWindow={false}
        >
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>
    );
    expect(attachScrollListenerSpy).toHaveBeenCalledTimes(1);
    expect(scrollListenerSpy).toHaveBeenCalledTimes(1);
    attachScrollListenerSpy.mockRestore();
    scrollListenerSpy.mockRestore();
  });

  it("should handle when the scrollElement is removed from the DOM", () => {
    const loadMore = jest.fn();

    const wrapper = mount(
      <div>
        <InfiniteScroll hasMore={false} loadMore={loadMore} pageStart={0}>
          <div className="child-component">Child Text</div>
        </InfiniteScroll>
      </div>
    );

    const component: any = wrapper.find(InfiniteScroll);

    // Invoke the scroll listener which depends on the scrollComponent to
    // verify it executes properly, and safely navigates when the
    // scrollComponent is null.
    component.instance().scrollListener();

    expect(wrapper.text()).toContain("Child Text");
  });
});
