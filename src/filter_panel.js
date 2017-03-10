import React, { Component } from 'react';
import AddFilter from './add_filter.js'
import FilterList from './filter_list.js'

class FilterPanel extends Component {
  render() {
    return (
      <div className='FilterPanel'>
        <RandomButton />
        <FilterEditor pages={this.props.pages} />
      </div>
    )
  }
}

class FilterEditor extends Component {
  render() {
    return (
      <div className='FilterEditor'>
        <AddFilter pages={this.props.pages}/>
        <FilterList />
      </div>
    )
  }
}

class RandomButton extends Component {
  render() {
    return (
      <button className='RandomButton' onClick={this.props.newRandom}>
        Random
      </button>
    );
  }
}

export default FilterPanel;
