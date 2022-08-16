import time

from mqtt_client import AWSIoTCoreClient

if __name__ == '__main__':
    AWS_IOT_ENDPOINT = "azogl4y0hhyqi-ats.iot.ap-northeast-2.amazonaws.com"
    CLIENT_TYPE = 'PUBLISHER'

    PATH_TO_CERTIFICATE = f"certificates/publisher/certificate.pem.crt"
    PATH_TO_PRIVATE_KEY = f"certificates/publisher/private.pem.key"
    PATH_TO_AMAZON_ROOT_CA_1 = f"certificates/publisher/root.pem"

    THING_NAME = f"{CLIENT_TYPE}-latency-test"

    # publish messages on mqtt topic
    iot_client = AWSIoTCoreClient(
        iot_core_endpoint=AWS_IOT_ENDPOINT,
        thing_name=THING_NAME,
        client_type=CLIENT_TYPE,
        topic="test/latency-testing",
        path_to_cert=PATH_TO_CERTIFICATE,
        path_to_priv_key=PATH_TO_PRIVATE_KEY,
        path_to_amazon_ca=PATH_TO_AMAZON_ROOT_CA_1
    )
    try:
        iot_client.connect()

        while True:
            message = str(time.time())
            iot_client.publish(message)
            time.sleep(1)

    except KeyboardInterrupt:
        iot_client.disconnect()
