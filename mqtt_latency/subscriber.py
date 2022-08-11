from mqtt_client import AWSIoTCoreClient

if __name__ == '__main__':
    AWS_IOT_ENDPOINT = "azogl4y0hhyqi-ats.iot.ap-northeast-2.amazonaws.com"
    CLIENT_TYPE = 'SUBSCRIBER'

    PATH_TO_CERTIFICATE = f"certificates/subscriber/certificate.pem.crt"
    PATH_TO_PRIVATE_KEY = f"certificates/subscriber/private.pem.key"
    PATH_TO_AMAZON_ROOT_CA_1 = f"certificates/subscriber/root.pem"

    # publish messages on mqtt topic
    iot_client = AWSIoTCoreClient(
        iot_core_endpoint=AWS_IOT_ENDPOINT,
        client_type=CLIENT_TYPE,
        path_to_cert=PATH_TO_CERTIFICATE,
        path_to_priv_key=PATH_TO_PRIVATE_KEY,
        path_to_amazon_ca=PATH_TO_AMAZON_ROOT_CA_1
    )
    try:
        iot_client.connect()

        while True:
            iot_client.subscribe()

    except KeyboardInterrupt:
        iot_client.calculate_latency()
        iot_client.disconnect()
        pass
