import Container from "@awsui/components-react/container";
import Header from "@awsui/components-react/header";
import SpaceBetween from "@awsui/components-react/space-between";
import React, {Component} from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';

const Step1 = () => {
  const codeString = 'mkdir openssl && cd openssl';
  return (
    <SyntaxHighlighter language="python">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step2 = () => {
  const codeString = 'openssl req -x509 \\\n' +
    '            -sha256 -days 356 \\\n' +
    '            -nodes \\\n' +
    '            -newkey rsa:2048 \\\n' +
    '            -subj "/CN=jjinj.amazon.com/C=US/L=San Fransisco" \\\n' +
    '            -keyout rootCA.key -out rootCA.crt';
  return (
    <SyntaxHighlighter language="python">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step3 = () => {
  const codeString = 'cat > rootCA_openssl.conf <<EOF\n' +
    '[ req ]\n' +
    'distinguished_name       = req_distinguished_name\n' +
    'extensions               = v3_ca\n' +
    'req_extensions           = v3_ca\n' +
    '\n' +
    '[ v3_ca ]\n' +
    'basicConstraints         = CA:TRUE\n' +
    '\n' +
    '[ req_distinguished_name ]\n' +
    'countryName              = Country Name (2 letter code)\n' +
    'countryName_default      = KR\n' +
    'countryName_min          = 2\n' +
    'countryName_max          = 2\n' +
    'organizationName         = Organization Name (eg, company)\n' +
    'organizationName_default = JinJ\n' +
    'EOF';
  return (
    <SyntaxHighlighter language="python">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step4 = () => {
  const codeString = 'openssl req -new -sha256 -key rootCA.key -nodes -out rootCA.csr -config rootCA_openssl.conf\n' +
    'openssl x509 -req -days 3650 -extfile rootCA_openssl.conf -extensions v3_ca -in rootCA.csr -signkey rootCA.key -out rootCA.pem';
  return (
    <SyntaxHighlighter language="python">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step5 = () => {
  const codeString = '# Get the registration code for the use below: \n' +
    'aws iot get-registration-code \n' +
    '\n' +
    '# Put the registration code in Common Name field\n' +
    'openssl genrsa -out verificationCert.key 2048\n' +
    'openssl req -new -key verificationCert.key -out verificationCert.csr\n' +
    '\n' +
    'openssl x509 -req -in verificationCert.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out verificationCert.pem -days 500 -sha256';
  return (
    <SyntaxHighlighter language="python">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step6 = () => {
  const codeString = 'aws iot register-ca-certificate \\\n' +
    '    --ca-certificate file://rootCA.pem \\\n' +
    '    --verification-cert file://verificationCert.pem';
  return (
    <SyntaxHighlighter language="python">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step7 = () => {
  const codeString = 'aws iot update-ca-certificate \\\n' +
    '    --certificate-id certificateId \\\n' +
    '    --new-status ACTIVE';
  return (
    <SyntaxHighlighter language="python">
      {codeString}
    </SyntaxHighlighter>
  );
};

const Step8 = () => {
  const codeString = 'openssl genrsa -out jitpTestDevice.key 2048\n' +
    'openssl req -new -key verificationCert.key -out jitpTestDevice.csr\n' +
    'openssl x509 -req -in jitpTestDevice.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out jitpTestDevice.pem -days 500 -sha256';
  return (
    <SyntaxHighlighter language="python">
      {codeString}
    </SyntaxHighlighter>
  );
};

class JITProvisioningPage extends Component {
  render() {
    return <Container header={<Header variant="h2">JIT Provisioning</Header>}>
      <SpaceBetween direction="vertical" size="s">
        <h4>Create self-signed CA</h4>
        <Step1/>
        <Step2/>
        <Step3/>
        <Step4/>
        <h4>Register self-signed CA to AWS IoT Core</h4>
        <Step5/>
        <Step6/>
        <Step7/>
        <h4>Generate X.509 certificate and connect</h4>
        <Step8/>
      </SpaceBetween>
    </Container>
  }
}

export default JITProvisioningPage;
