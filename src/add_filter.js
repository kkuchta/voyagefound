import React, { Component } from 'react';
import _ from 'lodash';
import Autocomplete from 'react-autocomplete';
import './add_filter.css';

// TODO: anglicize umlauts and whatnot so people can actually type them
class AddFilter extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    // TODO: update this when props.pages changes
    // A simple 1-level index.  TODO: use a trie, or at least a deeper index to
    // speed this thing up.
    this.pageIndex = _.groupBy(this.props.pages, (page) => {
      return page[0][0].toLowerCase();
    });
    this.pageIndex[''] = [];
    //console.log('pageIndex=', this.pageIndex);
    console.log('contructor done');
  }
  getItems() {
    console.log('getitems');
    if (this.state.value == '') {
      return [];
    }

    return this.pageIndex[this.state.value[0][0].toLowerCase()];
  }
  sortItems(a, b, value) {
    // From https://github.com/reactjs/react-autocomplete/blob/master/lib/utils.js
    const aLower = a[0].toLowerCase();
    const bLower = b[0].toLowerCase();
    //const valueLower = value.toLowerCase();
    //const queryPosA = aLower.indexOf(valueLower);
    //const queryPosB = bLower.indexOf(valueLower);
    //if (queryPosA !== queryPosB) {
      //return queryPosA - queryPosB;
    //}
    return aLower < bLower ? -1 : 1;
  }

  shouldItemRender(page, value) {
    return _.startsWith(page[0].toLowerCase(), value.toLowerCase());
  }
  renderItem(item, isHighlighted) {
    return (<div
      className={isHighlighted ? 'highlighted' : ''}
      key={item.join(' < ')}
    >
      {_.truncate(item.join(' < '), { length: 50 })}
    </div>);
  }

  onChange(event, value) {
    console.log('onchange');
    this.setState({ value });
  }

  render() {
    return (
      <div className='AddFilter'>
        <Autocomplete
          items={this.getItems()}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          sortItems={this.sortItems}
          getItemValue={(item) => item[0]}
          shouldItemRender={this.shouldItemRender}
          renderItem={this.renderItem}
        />
      </div>
    )
  }
}

export default AddFilter
