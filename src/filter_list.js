import React, { Component } from 'react';

class FilterList extends Component {
  constructor (props) {
    super(props);
    this.state = { filters: this.getFilters() };
    this.props.filterStore.addListener(this.onFilterChange.bind(this));
  }

  onFilterChange () {
    this.setState({filters: this.getFilters()});
  }

  getFilters () {
    const filters = this.props.filterStore.getFilters();
    const include = filters.include.map( (filter) => [true, filter] );
    const exclude = filters.exclude.map( (filter) => [false, filter] );
    return include.concat(exclude)
  }

  removeFilter (filter, isInclude) {
    this.props.filterStore.removeFilter(filter, isInclude);
  }

  render() {
    const filters = this.state.filters.map( (filterPair) => {
      return (<div key={filterPair[1]}>
        {filterPair[0] ? '+' : '-'} {filterPair[1]}
        <span onClick={this.removeFilter.bind(this, filterPair[1], filterPair[0])}>X</span>
      </div>);
    } );
    return (
      <div className='FilterList'>
      { filters }
      </div>
    )
  }
}

export default FilterList
