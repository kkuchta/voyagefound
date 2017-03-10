import React, { Component } from 'react';
import _  from 'lodash';

import FilterPanel from './filter_panel.js'
import './filter_panel.css'

import './App.css';
import PagePicker from './pagePicker.js'

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
  }
  newRandom = () => {
    console.log('App.newRandom');
    const newPageTitle = this.pagePicker.randomPage();
    this.setState({ pageTitle: newPageTitle });
  }

  render() {
    if (this.state.loaded) {
      return (
        <div className="App">
          <FilterPanel pages={this.pagePicker.filtered} />
          <WikiFrame />
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
    //return (
      //<iframe className='WikiFrame' src={this.url(this.props.pageTitle)} />
    //)
    return (<div />)
  }
}

export default App;
