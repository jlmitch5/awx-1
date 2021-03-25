import React, { Fragment, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import {
  Card,
  CardHeader,
  CardActions,
  CardBody,
  PageSection,
  Select,
  SelectVariant,
  SelectOption,
  Tabs,
  Tab,
  TabTitleText,
} from '@patternfly/react-core';

import useRequest from '../../util/useRequest';
import { DashboardAPI } from '../../api';
import ScreenHeader from '../../components/ScreenHeader';
import JobList from '../../components/JobList';
import ContentLoading from '../../components/ContentLoading';
import LineChart from './shared/LineChart';
import Count from './shared/Count';
import TemplateList from '../../components/TemplateList';

const Counts = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: var(--pf-global--spacer--lg);

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 1fr;
  }
`;

const MainPageSection = styled(PageSection)`
  padding-top: 0;
  padding-bottom: 0;

  & .spacer {
    margin-bottom: var(--pf-global--spacer--lg);
  }
`;

const GraphCardHeader = styled(CardHeader)`
  margin-top: var(--pf-global--spacer--lg);
`;

const GraphCardActions = styled(CardActions)`
  margin-left: initial;
  padding-left: 0;
`;

function Dashboard({ i18n }) {
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isJobTypeDropdownOpen, setIsJobTypeDropdownOpen] = useState(false);
  const [periodSelection, setPeriodSelection] = useState('month');
  const [jobTypeSelection, setJobTypeSelection] = useState('all');
  const [activeTabId, setActiveTabId] = useState(0);
  const [jobGraphDataState, setJobGraphDataState] = useState([{successful: 0, failed: 0, created: '2021-03-24'}, {successful: 1, failed: 1, created: '2021-03-25'}]);

  useEffect(() => {
    setTimeout(() => {
      // hacky way of creating new data point
      const [{ created: lastDay }] = jobGraphDataState.slice(-1);
      let tomorrow;
      if (jobGraphDataState.length > 2) {
        tomorrow = new Date(new Date(lastDay).getTime() + 24 * 60 * 60 * 1000);
      } else {
        tomorrow = new Date(new Date(lastDay).getTime() + 24 * 60 * 60 * 1000 * 2);
      }
      const tomorrowFormatted = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;

      // concat new data point and show up to latest 15 data points
      const newData = jobGraphDataState.concat([{
        successful: Math.floor(Math.random() * Math.floor(6)),
        failed: Math.floor(Math.random() * Math.floor(6)),
        created: tomorrowFormatted
      }]).slice(-15);

      setJobGraphDataState(newData);
    }, 3000);
  }, [jobGraphDataState]);

  return (
    <Fragment>
      <ScreenHeader
        streamType="all"
        breadcrumbConfig={{ '/home': i18n._(t`Dashboard`) }}
      />
      <PageSection>
      </PageSection>
      <MainPageSection>
        <div className="spacer">
          <Card id="dashboard-main-container">
            <Tabs
              aria-label={i18n._(t`Tabs`)}
              activeKey={activeTabId}
              onSelect={(key, eventKey) => setActiveTabId(eventKey)}
            >
              <Tab
                aria-label={i18n._(t`Job status graph tab`)}
                eventKey={0}
                title={<TabTitleText>{i18n._(t`Job status`)}</TabTitleText>}
              />
              <Tab
                aria-label={i18n._(t`Recent Jobs list tab`)}
                eventKey={1}
                title={<TabTitleText>{i18n._(t`Recent Jobs`)}</TabTitleText>}
              />
              <Tab
                aria-label={i18n._(t`Recent Templates list tab`)}
                eventKey={2}
                title={
                  <TabTitleText>{i18n._(t`Recent Templates`)}</TabTitleText>
                }
              />
            </Tabs>
            {activeTabId === 0 && (
              <Fragment>
                <GraphCardHeader>
                  <GraphCardActions>
                    <Select
                      variant={SelectVariant.single}
                      placeholderText={i18n._(t`Select period`)}
                      aria-label={i18n._(t`Select period`)}
                      className="periodSelect"
                      onToggle={setIsPeriodDropdownOpen}
                      onSelect={(event, selection) =>
                        setPeriodSelection(selection)
                      }
                      selections={periodSelection}
                      isOpen={isPeriodDropdownOpen}
                    >
                      <SelectOption key="month" value="month">
                        {i18n._(t`Past month`)}
                      </SelectOption>
                      <SelectOption key="two_weeks" value="two_weeks">
                        {i18n._(t`Past two weeks`)}
                      </SelectOption>
                      <SelectOption key="week" value="week">
                        {i18n._(t`Past week`)}
                      </SelectOption>
                    </Select>
                    <Select
                      variant={SelectVariant.single}
                      placeholderText={i18n._(t`Select job type`)}
                      aria-label={i18n._(t`Select job type`)}
                      className="jobTypeSelect"
                      onToggle={setIsJobTypeDropdownOpen}
                      onSelect={(event, selection) =>
                        setJobTypeSelection(selection)
                      }
                      selections={jobTypeSelection}
                      isOpen={isJobTypeDropdownOpen}
                    >
                      <SelectOption key="all" value="all">
                        {i18n._(t`All job types`)}
                      </SelectOption>
                      <SelectOption key="inv_sync" value="inv_sync">
                        {i18n._(t`Inventory sync`)}
                      </SelectOption>
                      <SelectOption key="scm_update" value="scm_update">
                        {i18n._(t`SCM update`)}
                      </SelectOption>
                      <SelectOption key="playbook_run" value="playbook_run">
                        {i18n._(t`Playbook run`)}
                      </SelectOption>
                    </Select>
                  </GraphCardActions>
                </GraphCardHeader>
                <CardBody>
                  <LineChart
                    height={390}
                    id="d3-line-chart-root"
                    data={jobGraphDataState}
                  />
                </CardBody>
              </Fragment>
            )}
            {activeTabId === 1 && <JobList defaultParams={{ page_size: 5 }} />}
            {activeTabId === 2 && (
              <TemplateList defaultParams={{ page_size: 5 }} />
            )}
          </Card>
        </div>
      </MainPageSection>
    </Fragment>
  );
}

export default withI18n()(Dashboard);
