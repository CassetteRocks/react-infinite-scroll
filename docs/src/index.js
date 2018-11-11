import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import qwest from 'qwest';

import InfiniteScroll from '../../dist/InfiniteScroll';

const api = {
  baseUrl: 'https://api.soundcloud.com',
  client_id: 'caf73ef1e709f839664ab82bef40fa96'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: [],
      hasMoreItems: true,
      nextHref: null
    };

    this.loadItems = this.loadItems.bind(this);
  }

  loadItems() {
    var self = this;

    var url = api.baseUrl + '/users/8665091/favorites';
    if (this.state.nextHref) {
      url = this.state.nextHref;
    }

    qwest.get(url, {
      client_id: api.client_id,
      linked_partitioning: 1,
      page_size: 10
    }, {
        cache: true
      })
      .then(function (xhr, resp) {
        if (resp) {
          var tracks = self.state.tracks;
          resp.collection.map((track) => {
            if (track.artwork_url == null) {
              track.artwork_url = track.user.avatar_url;
            }

            tracks.push(track);
          });

          if (resp.next_href) {
            self.setState({
              tracks: tracks,
              nextHref: resp.next_href
            });
          } else {
            self.setState({
              hasMoreItems: false
            });
          }
        }
      });
  }

  render() {
    const { hasMoreItems, tracks } = this.state;

    const loader = () => <div className="spinner" />;

    var items = [];
    tracks.map(track => {
      items.push(
        <div className="track" key={track.id}>
          <a href={track.permalink_url} target="_blank">
            <img src={track.artwork_url} width="150" height="150" />
            <p className="title">{track.title}</p>
          </a>
        </div>
      );
    });

    return (
      <InfiniteScroll
        loadMore={this.loadItems}
        hasMore={hasMoreItems}
        loader={loader}
        className="tracks"
      >
        {items}
      </InfiniteScroll>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('root'));
