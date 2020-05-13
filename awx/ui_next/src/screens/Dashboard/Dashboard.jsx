import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import {
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';
import KiasLineChart from './Charts/LineChart';
import {
  Card,
  CardBody
} from '@patternfly/react-core';

const LineChart = styled(KiasLineChart)`
  &#d3-line-chart-root {
  min-height: 450px;
  min-width: 75%;
`;

class Dashboard extends Component {
  render() {
    const { i18n } = this.props;
    const { light } = PageSectionVariants;
    const lineChartData = [
      {created: "2020-05-06", failed: 1, successful: 1},
      {created: "2020-05-07", failed: 1, successful: 2},
      {created: "2020-05-08", failed: 3, successful: 1},
    ]
    const clusterTimeFrame = 30;

    return (
      <Fragment>
        <PageSection variant={light} className="pf-m-condensed">
          <Title size="2xl">{i18n._(t`Dashboard`)}</Title>
        </PageSection>
        <PageSection>
          <Card>
            <CardBody>
              <LineChart
                margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                id="d3-line-chart-root"
                data={ lineChartData }
                value={ clusterTimeFrame }
              />
            </CardBody>
          </Card>
        </PageSection>
      </Fragment>
    );
  }
}

export default withI18n()(Dashboard);
