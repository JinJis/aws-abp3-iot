import Container from "@awsui/components-react/container";
import Header from "@awsui/components-react/header";
import SpaceBetween from "@awsui/components-react/space-between";
import React, {Component} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

const Example = () => {
  const codeString = 'Received message from topic \'test/latency-testing\': b\'"1661145620.3581991"\'\n' +
    'Received message from topic \'test/latency-testing\': b\'"1661145621.363412"\'\n' +
    'Received message from topic \'test/latency-testing\': b\'"1661145622.3680089"\'\n' +
    'Received message from topic \'test/latency-testing\': b\'"1661145623.368918"\'\n' +
    'Received message from topic \'test/latency-testing\': b\'"1661145624.372071"\'\n' +
    'Received message from topic \'test/latency-testing\': b\'"1661145625.374583"\'\n' +
    'Received message from topic \'test/latency-testing\': b\'"1661145626.3784902"\'\n' +
    'Received message from topic \'test/latency-testing\': b\'"1661145627.3837771"\'\n' +
    'Received message from topic \'test/latency-testing\': b\'"1661145628.384379"\'\n' +
    'Received message from topic \'test/latency-testing\': b\'"1661145629.3894742"\'\n' +
    '> RTT - min:46.800000000000004ms max:98.19999999999999ms avg:55.4ms\n' +
    '> Latency - min:23.400000000000002ms max:49.099999999999994ms avg:27.7ms';
  return (
    <SyntaxHighlighter language="python">
      {codeString}
    </SyntaxHighlighter>
  );
};

class LowerLatencyPage extends Component {
  render() {
    return <Container header={<Header variant="h2">Latency Improvement</Header>}>
      <SpaceBetween direction="vertical" size="l">
        <h4>Run publisher and subscriber.. Will calculate latency from RTT</h4>
        <Example />
      </SpaceBetween>
    </Container>
  }
}

export default LowerLatencyPage;


