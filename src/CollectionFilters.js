import React from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import filterConfig from './filterConfigData';

class CollectionFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    filterHandlers: PropTypes.object,
    filterData: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {
      selected: [],
      freeContent: [],
      permitted: [],
      mdSource: [],
      assigned: [],
    },
  };

  state = {
    selected: [],
    freeContent: [],
    permitted: [],
    mdSource: [],
    assigned: [],
  };

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    const arr = [];

    filterConfig.forEach((filter) => {
      const newValues = [];
      let values = {};
      if (filter === 'mdSource') {
        // get filter values from okapi
        values = props.filterData[filter] || [];
      } else {
        // get filte values from filterConfig
        values = filter.values;
      }

      values.forEach((key) => {
        let newValue = {};
        newValue = {
          value: key.cql,
          label: key.name,
        };
        newValues.push(newValue);
      });

      arr[filter.name] = newValues;

      if (
        state[filter.name] &&
        arr[filter.name].length !== state[filter.name].length
      ) {
        newState[filter.name] = arr[filter.name];
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  renderCheckboxFilter = (key, name, props) => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={`${name}`}
        onClearFilter={() => {
          this.props.filterHandlers.clearGroup(key);
        }}
        separator={false}
        {...props}
      >
        <CheckboxFilter
          dataOptions={this.state[key]}
          name={key}
          onChange={(group) => {
            this.props.filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values,
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  renderMetadataSourceFilter = () => {
    const mdSources = this.props.filterData.mdSources;
    const dataOptions = mdSources.map((mdSource) => ({
      value: mdSource.id,
      label: mdSource.label,
    }));

    const { activeFilters } = this.props;
    const mdSourceFilters = activeFilters.mdSource || [];

    return (
      <Accordion
        displayClearButton={mdSourceFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-mdSource"
        label="Metadata source"
        onClearFilter={() => {
          this.props.filterHandlers.clearGroup('mdSource');
        }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="mdSource-filter"
          onChange={(value) =>
            this.props.filterHandlers.state({
              ...activeFilters,
              mdSource: [value],
            })
          }
          placeholder="Select a Source"
          value={mdSourceFilters[0] || ''}
        />
      </Accordion>
    );
  };

  render() {
    return (
      <AccordionSet>
        {this.renderMetadataSourceFilter('mdSource', 'Source')}
        {this.renderCheckboxFilter('freeContent', 'Free content')}
        {this.renderCheckboxFilter('permitted', 'Usage permitted')}
        {this.renderCheckboxFilter('selected', 'Selected')}
        {this.renderCheckboxFilter('assigned', 'Assigned')}
      </AccordionSet>
    );
  }
}

export default CollectionFilters;
