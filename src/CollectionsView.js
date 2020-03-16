import React from 'react';
import PropTypes from 'prop-types';
// import {
//   get,
//   noop,
// } from 'lodash';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Icon,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import CollectionFilters from './CollectionFilters';
import css from './CollectionSearch.css';


export default class CollectionsView extends React.Component {
  static defaultProps = {
    filterData: {},
    visibleColumns: ['label', 'mdSource', 'permitted', 'filters', 'freeContent'],
  }

  constructor(props) {
    super(props);

    this.state = {
      filterPaneIsVisible: true,
    };
  }

  columnMapping = {
    label: 'Label',
    mdSource: 'MdSource',
    permitted: 'Permitted',
    filters: 'Filters',
    freeContent: 'FreeContent'
  };

  columnWidths = {
    label: 250,
    mdSource: 250,
    permitted: 100,
    filters: 100,
    freeContent: 100
  };

  getArrayElementsCommaSeparated = (array) => {
    let formatted = '';

    if (array && array.length) {
      for (let i = 0; i < array.length; i += 1) {
        formatted += (i > 0 ? '; ' : '') + array[i];
      }
    }
    return formatted;
  }

  formatter = {
    label: collection => collection.label,
    // mdSource: collection => collection.mdSource.name,
    mdSource: collection => _.get(collection, 'mdSource.name', '-'),
    permitted: collection => collection.permitted,
    selected: collection => collection.selected,
    filters: collection => this.getArrayElementsCommaSeparated(collection.filters),
    freeContent: collection => collection.freeContent,
  };

  // fade in/out of filter-pane
  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  renderIsEmptyMessage = (query, collection) => {
    if (!collection) {
      return 'no collection yet';
    }

    return (
      <div data-test-collections-no-results-message>
        <NoResultsMessage
          collection={collection}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={_.noop}
        />
      </div>
    );
  };

  // fade in / out the filter menu
  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount }}>
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  visible={filterPaneIsVisible}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  // counting records of result list
  renderResultsPaneSubtitle = (collection) => {
    if (collection) {
      const count = collection ? collection.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  render() {
    const { filterData, children, contentRef, contentData, onNeedMoreData, onSelectRow, queryGetter, querySetter, collection, visibleColumns } = this.props;
    const count = collection ? collection.totalCount() : 0;
    const query = queryGetter() || {};
    const sortOrder = query.sort || '';

    return (
      <div data-test-collections ref={contentRef}>
        <SearchAndSortQuery
          initialFilterState={{ permitted: ['yes'], selected: ['yes'] }}
          initialSearchState={{ query: '' }}
          initialSortState={{ sort: 'label' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
          syncToLocationSearch={false}
        >
          {
            ({
              searchValue,
              getSearchHandlers,
              onSubmitSearch,
              onSort,
              getFilterHandlers,
              activeFilters,
              filterChanged,
              searchChanged,
              resetAll
            }) => {
              const disableReset = () => (!filterChanged && !searchChanged);

              return (
                <Paneset>
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      defaultWidth="20%"
                      onClose={this.toggleFilterPane}
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={onSubmitSearch}>
                        <div className={css.searchGroupWrap}>
                          <SearchField
                            autoFocus
                            id="collectionSearchField"
                            inputRef={this.searchField}
                            name="query"
                            onChange={getSearchHandlers().query}
                            onClear={getSearchHandlers().reset}
                            value={searchValue.query}
                          />
                          <Button
                            buttonStyle="primary"
                            disabled={
                              !searchValue.query || searchValue.query === ''
                            }
                            fullWidth
                            id="collectionSubmitSearch"
                            type="submit"
                          >
                            <FormattedMessage id="stripes-smart-components.search" />
                          </Button>
                        </div>
                        <Button
                          buttonStyle="none"
                          disabled={disableReset()}
                          id="clickable-reset-all"
                          onClick={resetAll}
                        >
                          <Icon icon="times-circle-solid">
                            <FormattedMessage id="stripes-smart-components.resetAll" />
                          </Icon>
                        </Button>
                        <CollectionFilters
                          activeFilters={activeFilters.state}
                          filterData={filterData}
                          filterHandlers={getFilterHandlers()}
                        />
                      </form>
                    </Pane>
                  }
                  <Pane
                    defaultWidth="80%"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    padContent={false}
                    paneTitle="Metadata Collections"
                    paneSub={this.renderResultsPaneSubtitle(collection)}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={this.columnMapping}
                      columnWidths={this.columnWidths}
                      contentData={contentData}
                      formatter={this.formatter}
                      id="list-collections"
                      isEmptyMessage="no results"
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      onRowClick={onSelectRow}
                      sortDirection={
                        sortOrder.startsWith('-') ? 'descending' : 'ascending'
                      }
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={visibleColumns}
                    />
                  </Pane>
                  {children}
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}

CollectionsView.propTypes = Object.freeze({
  children: PropTypes.object,
  contentRef: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  filterData: PropTypes.shape({
    mdSources: PropTypes.array,
  }),
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  collection: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func
  }),
  visibleColumns: PropTypes.arrayOf(PropTypes.string)
});
