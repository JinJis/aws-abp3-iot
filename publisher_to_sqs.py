import multiprocessing as mp
import time
from random import randrange

from mqtt_client import AWSIoTCoreClient

AWS_IOT_ENDPOINT = "azogl4y0hhyqi-ats.iot.ap-northeast-2.amazonaws.com"
CLIENT_TYPE = 'PUBLISHER'
PATH_TO_CERTIFICATE = f"certificates/publisher/certificate.pem.crt"
PATH_TO_PRIVATE_KEY = f"certificates/publisher/private.pem.key"
PATH_TO_AMAZON_ROOT_CA_1 = f"certificates/publisher/root.pem"


def launch_publisher(thing_name: str, sleep_interval: float):
    c_proc = mp.current_process()
    print("Running on Process", c_proc.name, "PID", c_proc.pid)
    # publish messages on mqtt topic
    iot_client = AWSIoTCoreClient(
        iot_core_endpoint=AWS_IOT_ENDPOINT,
        thing_name=thing_name,
        client_type=CLIENT_TYPE,
        topic="test/sqs",
        path_to_cert=PATH_TO_CERTIFICATE,
        path_to_priv_key=PATH_TO_PRIVATE_KEY,
        path_to_amazon_ca=PATH_TO_AMAZON_ROOT_CA_1
    )
    try:
        iot_client.connect()

        while True:
            message = {
                "thing_name": iot_client.thing_name,
                "timestamp": str(time.time()),
                "temperature": randrange(25, 40)
            }
            iot_client.publish(message)
            time.sleep(sleep_interval)

    except KeyboardInterrupt:
        iot_client.disconnect()


if __name__ == '__main__':
    START_THING_NUM = 0
    END_THING_NUM = 10
    SLEEP_INTERVAL = 0.005

    pool = mp.Pool()  # use all available cores, otherwise specify the number you want as an argument
    for i in range(START_THING_NUM, END_THING_NUM):
        pool.apply_async(launch_publisher, args=(f"{CLIENT_TYPE}-{i}", SLEEP_INTERVAL))
    pool.close()
    pool.join()
