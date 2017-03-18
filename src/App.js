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
    this.state = { pageTitle: '', loaded: false };
    this.pagePicker = new PagePicker();
    this.pagePicker.loadAncestorData()
      .then( () => {
        this.pagePicker.updateFilters([],[]);
        this.setState({loaded: true});
      } );
    this.filterStore = new FilterStore();
    this.filterStore.addListener( () => {
      const filters = this.filterStore.getFilters();
      this.pagePicker.updateFilters(filters.exclude, filters.include);
    });
  }
  newRandom = () => {
    const newPageTitle = this.pagePicker.randomPage()[0];
    this.setState({ pageTitle: newPageTitle });
  }

  render() {
    if (this.state.loaded) {
      return (
        <div className="App">
          <FilterPanel pages={this.pagePicker.filtered} filterStore={this.filterStore} newRandom={this.newRandom} />
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
