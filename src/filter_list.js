import React, { Component } from 'react';

class FilterList extends Component {
  constructor (props) {
    super(props);
    this.state = { filters: [] };
    this.props.filterStore.addListener(this.onFilterChange.bind(this));
  }

  onFilterChange () {
    const filters = this.props.filterStore.getFilters();
    const include = filters.include.map( (filter) => [true, filter] );
    const exclude = filters.exclude.map( (filter) => [false, filter] );
    this.setState({filters: include.concat(exclude)});
  }

  removeFilter (filter, isInclude) {
    this.props.filterStore.removeFilter(filter, isInclude);
    console.log('here');
  }

  render() {
    // TODO: start filling in filterlist and addfilter
    // Maybe combine the two instead?
    const filters = this.state.filters.map( (filterPair) => {
      console.log('filterPair = ', filterPair);
      //return 'foo';
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
