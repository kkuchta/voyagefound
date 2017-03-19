import React, { Component } from 'react';
import _ from 'lodash';

import FilterStore from './filter_store.js'

import FilterPanel from './filter_panel.js'
import './filter_panel.css'

import './app.css';
import PagePicker from './page_picker.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTitle: '',
      loaded: false,
      compact: localStorage.getItem('compact') === 'true'
    };
    this.pagePicker = new PagePicker();
    this.pagePicker.loadAncestorData()
      .then( () => {

        this.filterStore = new FilterStore();
        this.filterStore.addListener( () => {
          const filters = this.filterStore.getFilters();
          this.pagePicker.updateFilters(filters.exclude, filters.include);
        });
        this.pagePicker.updateFilters(
          this.filterStore.filters.exclude,
          this.filterStore.filters.include
        );
        this.setState({loaded: true});
      } );

    // TEMP for testing:
    window.toggleCompact = this.toggleCompact.bind(this);
  }

  newRandom = () => {
    const newPage = this.pagePicker.randomPage()
    // Todo: handle null random page (probably because of conflicting filters)
    alert("Oh no- no page found!  You may have mutually exclusive filters (eg you're looking for places that are in China but not in Asia).  Try adjusting your filters and trying again.");
    const newPageTitle = newPage[0]
    this.setState({ pageTitle: newPageTitle });
  }

  toggleCompact = () => {
    const newCompact = !this.state.compact;
    this.setState({ compact: newCompact });
    localStorage.setItem('compact', newCompact);
    console.log('compact now = ', this.state.compact);
  }

  render() {
    let classNames = [
      'App',
      this.state.compact ? 'compact' : 'expanded'
    ];
    if (this.state.loaded) {
      return (
        <div className={classNames.join(' ')}>
          <FilterPanel pages={this.pagePicker.getAll()} filterStore={this.filterStore} newRandom={this.newRandom} toggleCompact={this.toggleCompact} />
          <WikiFrame pageTitle={this.state.pageTitle} />
        </div>
      );
    } else {
      return (
        <div className="App">
          loading...
        </div>
      );
    }
  }
}

class WikiFrame extends Component {
  url = (pageTitle) => {
    if (!pageTitle || !pageTitle.length) return '';

    return "https://en.wikivoyage.org/wiki/" + pageTitle;
  }
  render() {
    return (
      <iframe className='WikiFrame' src={this.url(this.props.pageTitle)} />
    )
    //return (<div />)
  }
}

export default App;
