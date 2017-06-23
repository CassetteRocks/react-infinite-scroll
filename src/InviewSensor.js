'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export default class InviewSensor extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool,
    partialVisibility: React.PropTypes.bool,
    delay: React.PropTypes.number,
    delayedCall: React.PropTypes.bool,
    children: React.PropTypes.element,
    minTopValue: React.PropTypes.number
  }

  static contextTypes = {
    infiniteScrollComponent: React.PropTypes.object,
  }

  static defaultProps = {
    active: true,
    partialVisibility: false,
    minTopValue: false,
    children: React.createElement('span')
  }

  constructor(props) {
    super(props)
    this.state = {
      isVisible: null,
      visibilityRect: {}
    };
    this.check = _.debounce(this.check.bind(this), 100);
  }

  componentDidMount() {
    this.context.infiniteScrollComponent.scrollWindow.addEventListener('scroll', this.check);
  }

  componentWillUnmount() {
    this.context.infiniteScrollComponent.scrollWindow.removeEventListener('scroll', this.check);
  }

  check() {
    var el = ReactDOM.findDOMNode(this);
    var rect = el.getBoundingClientRect();
    var containmentRect = this.context.infiniteScrollComponent.scrollWindow.getBoundingClientRect();

    var visibilityRect = {
      top: rect.top >= containmentRect.top,
      left: rect.left >= containmentRect.left,
      bottom: rect.bottom <= containmentRect.bottom,
      right: rect.right <= containmentRect.right
    };

    var fullVisible = (
      visibilityRect.top &&
      visibilityRect.left &&
      visibilityRect.bottom &&
      visibilityRect.right
    );

    var partialVertical =
      (rect.top >= containmentRect.top && rect.top <= containmentRect.bottom)
      || (rect.bottom >= containmentRect.top && rect.bottom <= containmentRect.bottom)
      || (rect.top <= containmentRect.top && rect.bottom >= containmentRect.bottom);

    var partialHorizontal =
      (rect.left >= containmentRect.left && rect.left <= containmentRect.right)
      || (rect.right >= containmentRect.left && rect.right <= containmentRect.right);

    var partialVisible = partialVertical && partialHorizontal;

    var isVisible = false;

    // if element is fully visible, why care about partial visibility??
    if (fullVisible !== true && this.props.partialVisibility) {
      // so, if partial visibility is observed
      // if we have minimum top visibility set by props, lets check, if it meets the passed value
      // so if for instance element is at least 200px in viewport, then show it.
      if (this.props.partialVisibility && this.props.minTopValue && partialVisible) {
        isVisible = rect.top <= (containmentRect.bottom - this.props.minTopValue);
      } else {
        // minTopValue was not passed, just give partial Result.
        isVisible = partialVisible;
      }
    } else {
      // Partial visibility is not required, just return fullVisibility value
      isVisible = fullVisible;
    }

    // notify the parent when the value changes
    if (this.state.isVisible !== isVisible) {
      this.setState({
        isVisible: isVisible,
        visibilityRect: visibilityRect
      });
      this.props.onChange(isVisible, visibilityRect);
    }

    return this.state;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
