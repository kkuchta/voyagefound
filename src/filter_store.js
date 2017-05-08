import _ from 'lodash'

const LOCAL_STORAGE_KEY = 'filters';

const DEFAULT_FILTERS = {
  include: ['Asia', 'Africa'],
  exclude: ['China', 'North Korea', 'Thailand']
};
class FilterStore {
  constructor () {
    // Todo: load from localstorage
    this.loadLocalStorage();
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

  loadLocalStorage() {
    const oldFilters = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
    if (oldFilters && oldFilters.include && oldFilters.exclude) {
      this.filters = oldFilters;
    } else {
      this.filters = DEFAULT_FILTERS;
    }
  }

  updateLocalStorage() {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.filters));
  }

  getFilters () {
    return {
      include: this.filters.include.slice(),
      exclude: this.filters.exclude.slice()
    }
  }
}
export default FilterStore;
