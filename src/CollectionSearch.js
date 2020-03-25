import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Icon } from '@folio/stripes/components';
import contains from 'dom-helpers/query/contains';

import CollectionSearchModal from './CollectionSearchModal';

class CollectionSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.modalTrigger = React.createRef();
    this.modalRef = React.createRef();
  }

  openModal() {
    this.setState({
      openModal: true,
    });
  }

  closeModal() {
    this.setState({
      openModal: false,
    }, () => {
      if (this.modalRef.current && this.modalTrigger.current) {
        if (contains(this.modalRef.current, document.activeElement)) {
          this.modalTrigger.current.focus();
        }
      }
    });
  }

  renderTriggerButton() {
    const {
      renderTrigger,
    } = this.props;

    return renderTrigger({
      buttonRef: this.modalTrigger,
      onClick: this.openModal,
    });
  }

  render() {
    const {
      buttonId,
      marginBottom0,
      renderTrigger,
      searchButtonStyle,
      searchLabel,
    } = this.props;

    return (
      <React.Fragment>
        {renderTrigger ?
          this.renderTriggerButton() :
          <FormattedMessage id="ui-plugin-find-finc-metadata-collection.searchButton.title">
            {ariaLabel => (
              <Button
                id={buttonId}
                key="searchButton"
                buttonStyle={searchButtonStyle}
                buttonRef={this.modalTrigger}
                onClick={this.openModal}
                aria-label={ariaLabel}
                marginBottom0={marginBottom0}
              >
                {searchLabel || <Icon icon="search" color="#fff" />}
              </Button>
            )}
          </FormattedMessage>}
        <CollectionSearchModal
          filterId={this.props.filterId}
          collectionIds={this.props.collectionIds}
          isEditable={this.props.isEditable}
          modalRef={this.modalRef}
          open={this.state.openModal}
          onClose={this.closeModal}
          {...this.props}
        />
      </React.Fragment>
    );
  }
}

CollectionSearch.defaultProps = {
  buttonId: 'clickable-plugin-find-finc-metadata-collection',
  searchButtonStyle: 'primary noRightRadius',
};

CollectionSearch.propTypes = {
  buttonId: PropTypes.string,
  filterId: PropTypes.string,
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  isEditable: PropTypes.bool,
  renderTrigger: PropTypes.func,
  searchLabel: PropTypes.node,
  searchButtonStyle: PropTypes.string,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
};

export default CollectionSearch;
