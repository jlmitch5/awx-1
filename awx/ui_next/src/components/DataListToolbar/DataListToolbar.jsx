import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Checkbox } from '@patternfly/react-core';
import styled from 'styled-components';
import { SearchIcon } from '@patternfly/react-icons';
import {
  DataToolbar,
  DataToolbarContent as _DataToolbarContent,
  DataToolbarGroup as _DataToolbarGroup,
  DataToolbarItem,
  DataToolbarToggleGroup,
} from '@patternfly/react-core/dist/umd/experimental';
import ExpandCollapse from '../ExpandCollapse';
import Search from '../Search';
import Sort from '../Sort';

import { SearchColumns, SortColumns, QSConfig } from '@types';

const DataToolbarContent = styled(_DataToolbarContent)`
  --pf-c-data-toolbar__content--PaddingLeft: 24px;
  --pf-c-data-toolbar__content--PaddingRight: 8px;
`;
const DataToolbarGroup = styled(_DataToolbarGroup)`
  --pf-c-data-toolbar__group--spacer: 24px;
`;

const SelectAllContainer = styled.div`
  align-self: stretch;
  border: 1px solid var(--pf-global--BorderColor--300);
  height: 36px;
  display: flex;
  padding: 0 9px;
  white-space: nowrap;
  border-bottom-color: var(--pf-global--BorderColor--200);

  & .pf-c-check {
    display: flex;
  }

  & label {
    margin-left: 10px;
  }
`;

class DataListToolbar extends React.Component {
  render() {
    const {
      clearAllFilters,
      searchColumns,
      sortColumns,
      showSelectAll,
      selectedItemCount,
      currentPageCount,
      isCompact,
      onSort,
      onSearch,
      onReplaceSearch,
      onRemove,
      onCompact,
      onExpand,
      onSelectAll,
      additionalControls,
      i18n,
      qsConfig,
    } = this.props;
    const showExpandCollapse = onCompact && onExpand;

    return (
      <DataToolbar
        id={`${qsConfig.namespace}-list-toolbar`}
        clearAllFilters={clearAllFilters}
        collapseListedFiltersBreakpoint="lg"
      >
        <DataToolbarContent>
          {showSelectAll && (
            <DataToolbarGroup>
              <DataToolbarItem>
                <SelectAllContainer>
                  <Checkbox
                    isChecked={currentPageCount === selectedItemCount}
                    onChange={onSelectAll}
                    aria-label={i18n._(t`Select all`)}
                    id="select-all"
                    label={selectedItemCount !== 0 ? `${selectedItemCount} selected` : null}
                  />
                </SelectAllContainer>
              </DataToolbarItem>
            </DataToolbarGroup>
          )}
          <DataToolbarToggleGroup toggleIcon={<SearchIcon />} breakpoint="lg">
            <DataToolbarItem>
              <Search
                qsConfig={qsConfig}
                columns={searchColumns}
                onSearch={onSearch}
                onReplaceSearch={onReplaceSearch}
                onRemove={onRemove}
              />
            </DataToolbarItem>
            <DataToolbarItem>
              <Sort qsConfig={qsConfig} columns={sortColumns} onSort={onSort} />
            </DataToolbarItem>
          </DataToolbarToggleGroup>
          {showExpandCollapse && (
            <DataToolbarGroup>
              <Fragment>
                <DataToolbarItem>
                  <ExpandCollapse
                    isCompact={isCompact}
                    onCompact={onCompact}
                    onExpand={onExpand}
                  />
                </DataToolbarItem>
              </Fragment>
            </DataToolbarGroup>
          )}
          <DataToolbarGroup variant="icon-button-group">
            {additionalControls.map(control => (
              <DataToolbarItem key={control.key}>{control}</DataToolbarItem>
            ))}
          </DataToolbarGroup>
        </DataToolbarContent>
      </DataToolbar>
    );
  }
}

DataListToolbar.propTypes = {
  clearAllFilters: PropTypes.func,
  qsConfig: QSConfig.isRequired,
  searchColumns: SearchColumns.isRequired,
  sortColumns: SortColumns.isRequired,
  showSelectAll: PropTypes.bool,
  isCompact: PropTypes.bool,
  onCompact: PropTypes.func,
  onExpand: PropTypes.func,
  onSearch: PropTypes.func,
  onReplaceSearch: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSort: PropTypes.func,
  selectedItemCount: PropTypes.number,
  currentPageCount: PropTypes.number,
  additionalControls: PropTypes.arrayOf(PropTypes.node),
};

DataListToolbar.defaultProps = {
  clearAllFilters: null,
  showSelectAll: false,
  isCompact: false,
  onCompact: null,
  onExpand: null,
  onSearch: null,
  onReplaceSearch: null,
  onSelectAll: null,
  onSort: null,
  selectedItemCount: 0,
  currentPageCount: 0,
  additionalControls: [],
};

export default withI18n()(DataListToolbar);
