import rclpy
import os
from enum import Enum
from rclpy.node import Node
# from rcl_interfaces.srv import SetParameters
# from rcl_interfaces.msg import SetParametersResult
from rclpy.qos import QoSProfile, QoSDurabilityPolicy, QoSHistoryPolicy, QoSReliabilityPolicy, QoSLivelinessPolicy
from std_msgs.msg import String

from urinterfaces.msg import Analog, AnalogIOStateStamped
from urinterfaces.srv import SetAnalogOutput


class SampleIOState(Node):

    def __init__(self, namespace: str):
        super().__init__('sample_io_state', namespace=namespace)

        self.get_logger().info('Initializing Analog IO Publisher Node')

        # Setup publisher
        self.setup_publisher()

        # Example: publish a test analog state
        self.timer = self.create_timer(1.0, self.publish_status)  # publish every second

        self.get_logger().info(f'Started ROS2 Node with namespace: {namespace}/{self.get_name()}')

    def setup_publisher(self):
        """
        Sets up ROS2 publisher for Analog state
        """
        qos_profile = QoSProfile(depth=10)
        qos_profile.history = QoSHistoryPolicy.KEEP_LAST
        qos_profile.liveliness = QoSLivelinessPolicy.AUTOMATIC
        qos_profile.reliability = QoSReliabilityPolicy.RELIABLE
        qos_profile.durability = QoSDurabilityPolicy.VOLATILE

        self.STATUS_TOPIC = self.get_name() + '/analog_status'
        self.publisher = self.create_publisher(Analog, self.STATUS_TOPIC, qos_profile)

    def publish_status(self):
        """
        Publishes an Analog message with pin, domain, and value
        """
        msg = Analog()
        msg.pin = 0                      # Example: pin number
        msg.domain = Analog.VOLTAGE      # Example: use VOLTAGE domain
        msg.value = 3.3                  # Example: analog reading value (3.3V)

        self.publisher.publish(msg)
        self.get_logger().info(f'Published Analog state: pin={msg.pin}, domain={msg.domain}, value={msg.value}')


def main(args=None):
    rclpy.init(args=args)
    node = SampleIOState(namespace="urcap")
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()