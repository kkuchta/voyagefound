import _ from 'lodash'

const localStorageKey = 'filters';

class FilterStore {
  constructor () {
    // Todo: load from localstorage
    const oldFilters = JSON.parse(window.localStorage.getItem(localStorageKey));
    if (oldFilters && oldFilters.include && oldFilters.exclude) {
      this.filters = oldFilters;
    } else {
      this.filters = {
        include: [],
        exclude: []
      };
    }
    this.listeners = [];
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  addFilter(filter, isInclude) {
    const list = this.filters[isInclude ? 'include' : 'exclude'];
    if (_.includes(list, filter)) return;

    list.push(filter);
    this.updateLocalStorage();
    this.listeners.forEach( (callback) => callback.call() );
  }

  removeFilter(filter, isInclude) {
    const list = this.filters[isInclude ? 'include' : 'exclude'];
    _.pull(list, filter);
    this.updateLocalStorage();
    this.listeners.forEach( (callback) => callback.call() );
  }

  updateLocalStorage() {
    window.localStorage.setItem(localStorageKey, JSON.stringify(this.filters));
  }

  getFilters () {
    return {
      include: this.filters.include.slice(),
      exclude: this.filters.exclude.slice()
    }
  }
}
export default FilterStore;
