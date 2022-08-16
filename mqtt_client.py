import json
import time

from awscrt import io, mqtt
from awsiot import mqtt_connection_builder


class AWSIoTCoreClient:
    def __init__(self, iot_core_endpoint: str, thing_name: str, client_type: str, topic: str, path_to_cert: str,
                 path_to_priv_key: str,
                 path_to_amazon_ca: str):
        self.ENDPOINT = iot_core_endpoint
        self.THING_NAME = thing_name
        self.PATH_TO_CERTIFICATE = path_to_cert
        self.PATH_TO_PRIVATE_KEY = path_to_priv_key
        self.PATH_TO_AMAZON_ROOT_CA_1 = path_to_amazon_ca
        self.MESSAGE = "Hello World"
        self.TOPIC = topic
        self.RANGE = 20

        # conn info
        self.mqtt_connection = None
        self._is_connected = False

        # latency info
        self._latency_float_digits = 4
        self._latencies = []

    @property
    def thing_name(self):
        return self.THING_NAME

    def connect(self):
        # Spin up resources
        event_loop_group = io.EventLoopGroup(1)
        host_resolver = io.DefaultHostResolver(event_loop_group)
        client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)
        self.mqtt_connection = mqtt_connection_builder.mtls_from_path(
            endpoint=self.ENDPOINT,
            cert_filepath=self.PATH_TO_CERTIFICATE,
            pri_key_filepath=self.PATH_TO_PRIVATE_KEY,
            client_bootstrap=client_bootstrap,
            ca_filepath=self.PATH_TO_AMAZON_ROOT_CA_1,
            client_id=self.THING_NAME,
            clean_session=False,
            keep_alive_secs=6
        )
        print("Connecting to {} with Thing Name '{}'...".format(
            self.ENDPOINT, self.THING_NAME))
        # Make the connect() call
        connect_future = self.mqtt_connection.connect()
        # Future.result() waits until a result is available
        connect_future.result()
        self._is_connected = True
        print("Connected!")

    def disconnect(self):
        print("Disconnecting...")
        disconnect_future = self.mqtt_connection.disconnect()
        disconnect_future.result()
        self._is_connected = False
        print("Disconnected!")

    def publish(self, message: dict):
        if not self._is_connected:
            raise RuntimeError("Please call connect() first")
        self.mqtt_connection.publish(
            topic=self.TOPIC,
            payload=json.dumps(message),
            qos=mqtt.QoS.AT_LEAST_ONCE)  # QoS 1
        print("Published: '" + json.dumps(message) + "' to the topic: " + f"'{self.TOPIC}'")

    def subscribe(self):
        if not self._is_connected:
            raise RuntimeError("Please call connect() first")

        subscribe_future, _ = self.mqtt_connection.subscribe(
            topic=self.TOPIC,
            qos=mqtt.QoS.AT_LEAST_ONCE,
            callback=self.on_message_received)

        subscribe_future.result()

    def on_message_received(self, topic, payload, dup, qos, retain, **kwargs):
        print("Received message from topic '{}': {}".format(topic, str(payload)))

        sent_ts = float(payload.decode("utf-8").replace('"', ""))
        cur_ts = float(time.time())

        diff = round((cur_ts - sent_ts), 4)
        self._latencies.append(diff)

    def calculate_latency(self):
        min_ms = min(self._latencies) * 1000
        max_ms = max(self._latencies) * 1000
        avg_ms = round(sum(self._latencies) / len(self._latencies), 4) * 1000
        print(f'Latency results (2 RTT) - min:{min_ms}ms max:{max_ms}ms avg:{avg_ms}ms')
        print(f'Latency results (1 RTT) - min:{min_ms / 2}ms max:{max_ms / 2}ms avg:{avg_ms / 2}ms')
