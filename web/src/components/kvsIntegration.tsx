import Container from "@awsui/components-react/container";
import Header from "@awsui/components-react/header";
import SpaceBetween from "@awsui/components-react/space-between";
import Button from "@awsui/components-react/button"
import React, {Component} from 'react';


import SyntaxHighlighter from 'react-syntax-highlighter';

const Step1 = () => {
  const codeString = 'aws --profile default  iot describe-endpoint --endpoint-type iot:CredentialProvider --output text > iot-credential-provider.txt';
  return (
    <SyntaxHighlighter language="shell">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step2 = () => {
  const codeString = 'IOT_GET_CREDENTIAL_ENDPOINT=`cat iot-credential-provider.txt`'
  return (
    <SyntaxHighlighter language="shell">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step3 = () => {
  const codeString = 'curl --silent -H "x-amzn-iot-thingname:kvs_example_camera_stream" --cert certificate.pem --key private.pem.key https://$IOT_GET_CREDENTIAL_ENDPOINT/role-aliases/KvsCameraIoTRoleAlias/credentials --cacert ./cacert.pem > token.json'
  return (
    <SyntaxHighlighter language="shell">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step4 = () => {
  const codeString = 'sudo docker run -it --network="host" -v /Users/jjinj/repositories/kvs:/opt/certificate 546150905175.dkr.ecr.us-west-2.amazonaws.com/kinesis-video-producer-sdk-cpp-amazon-linux /bin/bash'
  return (
    <SyntaxHighlighter language="shell">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step5 = () => {
  const codeString = 'export AWS_ACCESS_KEY_ID=\n' +
    'export AWS_SECRET_ACCESS_KEY=\n' +
    'export AWS_SESSION_TOKEN='
  return (
    <SyntaxHighlighter language="shell">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step6 = () => {
  const codeString = 'gst-launch-1.0 -v rtspsrc location=rtsp://rtsp.stream/pattern short-header=TRUE ! rtph264depay ! h264parse ! kvssink iot-certificate="iot-certificate,endpoint=azogl4y0hhyqi-ats.credentials.iot.ap-northeast-2.amazonaws.com,ca-path=/opt/certificate/cacert.pem,cert-path=/opt/certificate/certificate.pem,key-path=/opt/certificate/private.pem.key,role-aliases=KvsCameraIoTRoleAlias" aws-region="ap-northeast-2" stream-name=kvs_example_camera_stream2'
  return (
    <SyntaxHighlighter language="shell">
      {codeString}
    </SyntaxHighlighter>
  );
};


class KvsIntegrationPage extends Component {
  render() {
    return <Container header={<Header variant="h2">KVS Integration</Header>}>
      <SpaceBetween direction="vertical" size="s">
        <h3>Setup Policy, Assumed Role through below link</h3>
        <Button variant="link" iconName="external" target="_blank" href="https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/how-iot.html#how-iot-thingnamestreamname">Link button to
          Guideline</Button>
        <h3>Configure AWS IoT Credential endpoint</h3>
        <Step1/>
        <h3>Get temporary IAM Token with X.509 certificate and Assumed role</h3>
        <Step2/>
        <Step3/>
        <h3>Run Kinesis Producer</h3>
        <Step4 />
        <Step5 />
        <Step6 />
      </SpaceBetween>
    </Container>
  }
}

export default KvsIntegrationPage;