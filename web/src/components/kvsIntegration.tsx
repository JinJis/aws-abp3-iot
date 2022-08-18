import Container from "@awsui/components-react/container";
import Header from "@awsui/components-react/header";
import SpaceBetween from "@awsui/components-react/space-between";
import Button from "@awsui/components-react/button"
import React, {Component} from 'react';

class KVSIntegrationPage extends Component {
  render() {
    return <Container header={<Header variant="h2">Buttons</Header>}>
      <SpaceBetween direction="vertical" size="l">
        <Header variant="h3">Primary button</Header>
        <Button variant="primary">Primary button</Button>
        <Header variant="h3">Normal button</Header>
        <Button variant="normal">Normal button</Button>
        <Header variant="h3">Link button</Header>
        <Button variant="link" iconName="external" target="_blank" href="https://google.com">Link button to
          Google</Button>
        <Header variant="h3">Icon button</Header>
        <Button variant="icon" iconName="settings"/>
      </SpaceBetween>
    </Container>
  }
}

export default KVSIntegrationPage;