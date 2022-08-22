import os

import boto3

if __name__ == "__main__":
    THING_NAME = 'JITP-TEST'
    IOT_CORE_REGION = "ap-northeast-2"
    THING_TYPE_NAME = "ABP3-TEST"
    PATH_TO_DEVICE_CERT = "/certificates/jitp/jitpTestDevice.pem"
    PATH_TO_ROOT_CA = "/certificates/jitp/rootCA.pem"
    dir_path = os.path.dirname(os.path.realpath(__file__))

    iot_client = boto3.client('iot', IOT_CORE_REGION)

    # Step 1. Create thing
    iot_client.create_thing(thingName=THING_NAME,
                            thingTypeName=THING_TYPE_NAME,
                            attributePayload={
                                'attributes': {
                                    'thingId': '2000000'
                                }
                            })
    print(f"Successfully created thing(={THING_NAME})")

    # Step 2. Register certificate signed by self-signed CA
    with open(dir_path + PATH_TO_DEVICE_CERT, 'r') as f:
        device_cert = f.read()
    with open(dir_path + PATH_TO_ROOT_CA, 'r') as f:
        root_ca = f.read()
    response = iot_client.register_certificate(
        certificatePem=device_cert,
        caCertificatePem=root_ca,
        status='ACTIVE'
    )
    cert_arn = response["certificateArn"]
    print(f"Successfully registered certificate(Arn={cert_arn})")

    # Step 3. Attach certificate to thing
    response = iot_client.attach_thing_principal(
        thingName=THING_NAME,
        principal="arn:aws:iot:ap-northeast-2:238877058502:cert/2ab00bf13782599272a5e25790e4f4d7829455787b62eac127f8fdf16d7a98f8"
    )
    print("Successfully attached certificate to thing")

    # Step 4. Check console
