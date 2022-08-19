import multiprocessing as mp
import time
from random import randrange

from mqtt_client import AWSIoTCoreClient


def launch_publisher(thing_name):
    # c_proc = mp.current_process()
    # print("Running on Process", c_proc.name, "PID", c_proc.pid)
    # publish messages on mqtt topic
    iot_client = AWSIoTCoreClient(
        iot_core_endpoint="azogl4y0hhyqi-ats.iot.ap-northeast-2.amazonaws.com",
        thing_name=thing_name,
        topic="test/sqs",
        path_to_cert="certificates/publisher/certificate.pem.crt",
        path_to_priv_key="certificates/publisher/private.pem.key",
        path_to_amazon_ca="certificates/publisher/root.pem"
    )
    try:
        iot_client.connect()

        while True:
            message = {
                "thing_name": thing_name,
                "timestamp": str(time.time()),
                "temperature": randrange(25, 40)
            }
            iot_client.publish(message)
            time.sleep(0.00005)

    except KeyboardInterrupt:
        iot_client.disconnect()


if __name__ == '__main__':

    START_THING_NUM = 99999
    END_THING_NUM = START_THING_NUM - 100

    pool = mp.Pool()  # use all available cores, otherwise specify the number you want as an argument
    for i in range(START_THING_NUM, END_THING_NUM, -1):
        pool.apply_async(launch_publisher, args=(f"PUBLISHER-{i}",))

    pool.close()
    pool.join()
