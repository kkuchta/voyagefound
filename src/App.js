import React, { Component } from 'react';
import _ from 'lodash';
import 'font-awesome/css/font-awesome.css'

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
    if (!newPage) {
      // Todo: handle null random page (probably because of conflicting filters)
      alert("Sorry! No places match your filters!  You may have mutually exclusive filters (eg you're looking for places that are in China but not in Asia).  Maybe adjust your filters and trying again?");
    }
    const newPageTitle = newPage[0]
    this.setState({ pageTitle: newPageTitle });
  }

  toggleCompact = () => {
    const newCompact = !this.state.compact;
    this.setState({ compact: newCompact });
    localStorage.setItem('compact', newCompact);
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
      // I can find no good way to get an iframe to be responsive and scrolling
      // on both desktop and mobile.  For more details see:
      // stackoverflow.com/questions/43732449/iframe-thats-vertically-scrollable-and-responsive-in-both-ios-safari-and-deskto
      <div className='WikiFrame'>
        <iframe className='mobile' scrolling='no' src={this.url(this.props.pageTitle)} />
        <iframe className='desktop' src={this.url(this.props.pageTitle)} />
      </div>
    )
  }
}

export default App;
