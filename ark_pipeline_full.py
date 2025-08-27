from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription, TimerAction, DeclareLaunchArgument, IncludeLaunchDescription
from launch.conditions import IfCondition, UnlessCondition
from launch_ros.actions import Node, SetRemap, PushRosNamespace
from launch.substitutions import LaunchConfiguration
from launch_ros.substitutions import FindPackageShare
from launch.launch_description_sources import PythonLaunchDescriptionSource
from ament_index_python.packages import get_package_share_directory
import os, shutil, yaml
from ur_ark_ros_common.utilities.utils import get_ip_from_config, get_robot_serial_from_config


def generate_launch_description():

    ARK_ROS2_NAMESPACE = get_ip_from_config()
    ROBOT_SERIAL = get_robot_serial_from_config()

    rviz2 = Node(
        package="rviz2",
        executable="rviz2",
        name='rviz2_node'
    )

    ros2_web_bridge = Node(
        package="ur-ros2-web-bridge",
        executable="message_handler",
        name='message_handler',
    )
    
    overlay_generator= Node(
        package="ur_ark_ros_common",
        executable="overlay_generator",
        name='overlay_generator',
        parameters=[
            {'mode': 'raw'}
        ],        
        remappings=[
            ('/image_in_topic', 'camera/color/image_raw'),
            ('/image_out_topic', 'selected_view/compressed'),
            ('/segmentation_topic', 'segment_anything/raw_segmentation_mask'),
            ('/detections_topic', 'detections_output'),
            ('/apriltag_detections_topic', 'tag_detections'),
        ]
    )

    vizu_raw = Node(
        package="ur_ark_ros_common",
        executable="overlay_generator",
        name='raw_visualizer',
        parameters=[
            {'mode': 'raw'}
        ],        
        remappings=[
            ('/image_in_topic', 'camera/color/image_raw'),
            ('/image_out_topic', 'camera/color/image_raw/resized_compressed'),
        ]
    )

    improc_node = Node(
        package="ur_ark_ros_common",
        executable="pipeline_image_node",
        name='pipeline_image_node',
        remappings=[
            ('/image_in_topic', 'camera/color/image_raw'),
            ('/depth_in_topic', 'camera/depth/image_raw'),
            ('/camera_info_in_topic', 'camera/color/camera_info'),
            ('/segmentation_topic', 'segment_anything/raw_segmentation_mask'),
        ]
    )

    # redirect_node = Node(
    #     package="ur_ark_ros_common",
    #     executable="image_redirect",
    #     name='image_redirect',
    #     parameters=[
    #         {'tags': ['classification']},
    #         {'topic_paths': ['redirect/classif']}
    #     ],        
    #     remappings=[
    #         ('/image_in_topic', 'camera/color/image_raw'),
    #         ('/camera_info_in_topic', 'camera/color/camera_info'),
    #     ]
    # )

    converter_node = Node(
        package="ur_ark_ros_common",
        executable="image_converter",
        name='image_converter',
        remappings=[
            ('/image_in_topic', 'camera/depth/image_raw'),
            ('/image_out_topic', 'camera/depth/image_raw_32f'),
            ]
    )    
    
    calib_node = Node(
        package="ur_ark_ros_common",
        executable="camera_handeye_calib_node",
        name='camera_handeye_calib_node',
        remappings=[
        ('/image_topic', 'camera/color/image_raw'),
        ('/camera_info_topic', 'camera/color/camera_info'),
        ]
    )
    
    console_ui_node = Node(
        package="ur_ark_ros_common",
        executable="console_ui",
        name='console_ui',
        remappings=[
        ('/image_topic', 'camera/color/image_raw'),
        ('/camera_info_topic', 'camera/color/camera_info'),
        ]
    )

    config = os.path.join(
        '/workspaces/isaac_ros-dev',
        'config',
        'config.yaml'
        )    
    env_manager_node = Node(
        package="ur_ark_ros_common",
        executable="env_manager_node",
        name='env_manager_node',
        parameters = [{'local_config_path': config,
                       'part_height': .045}],
        remappings=[
        ('/image_topic', 'camera/color/image_raw'),
        ('/camera_info_topic', 'camera/color/camera_info'),
        ]
    )

    cam_node = IncludeLaunchDescription(
                PythonLaunchDescriptionSource([
                    ".", '/launch', '/gemini_330_series.launch.py'])
                    # ".", '/launch', '/gemini2.launch.py'])
            )


    sam_node = IncludeLaunchDescription(
                PythonLaunchDescriptionSource([
                    ".", '/launch', '/isaac_ros_segment_anything_triton.launch.py']),
                launch_arguments={
                    
                    'image_topic': 'sam_input_image',
                    'camera_info_topic': 'sam_input_camera_info',
                    'prompt_point_topic': 'sam_input_prompt_point',
                    'prompt_bbox_topic': 'sam_input_prompt_bbox',
                    # 'image_topic': 'camera/color/image_raw',
                    # 'camera_info_topic': 'camera/color/camera_info',
                    # 'prompt_topic': 'detections_output',
                    'input_image_width': '640',
                    'input_image_height': '480',
                    'orig_img_dims': '[480, 640]',
                }.items()
            )

    flag_apriltags_continuous = DeclareLaunchArgument(
        'apriltags_continuous',
        default_value='false',
        description='runs apriltags continuously if set to true'
    )

    apriltags_continuous_node = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            ".", '/launch', '/isaac_ros_apriltag_usb_cam.launch.py']),
        launch_arguments={
            'size':  '0.03',
            'image_topic':  'camera/color/image_raw',
            'camera_info_topic':  'camera/color/camera_info',
        }.items(),
        condition=IfCondition(LaunchConfiguration('apriltags_continuous'))
    )
    apriltags_continuous_node_delayed_launch = TimerAction(
        period=15.0,  # Delay for 15 seconds
        actions=[apriltags_continuous_node]
    )

    apriltags_node = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            ".", '/launch', '/apriltags.launch.py']),
        launch_arguments={
            'size':  '0.03',
            'image_topic':  'image_rect',
            'camera_info_topic':  'camera_info_rect',
        }.items(),
        condition=UnlessCondition(LaunchConfiguration('apriltags_continuous'))
    )

    apriltags_refine3d_node = Node(
        package="ur_ark_ros_common",
        executable="apriltags_refine3d",
        name='apriltags_refine3d',
        parameters=[
            {'temporal_smoothing_on': True,
             'temporal_window': 2.,
             'ref_frame': ROBOT_SERIAL + '_base'}
        ],        
        remappings=[
            ('image_topic', 'camera/color/image_raw'),
            ('depth_image_topic', 'camera/depth/image_raw'),
            ('camera_info_topic', 'camera/color/camera_info'),
            # ('image_topic', 'image_rect'),
            # ('depth_image_topic', 'depth_rect'),
            # ('camera_info_topic', 'camera_info_rect'),
            ('apriltag_detections', 'tag_detections'),
        ]
    )

    fp_node = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            ".", '/launch', '/isaac_ros_foundationpose.launch.py']),
        launch_arguments={
            'mesh_file_path': '/workspaces/isaac_ros-dev/data/cylinder/Cylinder.obj',
            'texture_path': '/workspaces/isaac_ros-dev/data/cylinder/brushed_vert.png',
            'score_engine_file_path': '/workspaces/isaac_ros-dev/isaac_ros_assets/models/foundationpose/score_trt_engine.plan',
            'refine_engine_file_path': '/workspaces/isaac_ros-dev/isaac_ros_assets/models/foundationpose/refine_trt_engine.plan',
            'launch_bbox_to_mask': 'False' 
        }.items()
    )

    time_sync = Node(
        package="ur_ark_ros_common",
        executable="time_sync",
        name="time_sync"
    )

    rtdetr_node = Node(
        package="ur_ark_dnn",
        executable="rtdetr_node",
        name="rtdetr_node",
        parameters=[
            {'min_score': 0.6 }
        ],        
    )

    classify_node = Node(
        package="ur_ark_dnn",
        executable="image_classifier_node",
        name='image_classifier_node',
        remappings=[
            ('/image_in_topic', 'camera/color/image_raw'),
        ]
    )
    
    image_collector_node = Node(
        package="ur_ark_ros_common",
        executable="image_collector_node",
        name='image_collector_node',
        remappings=[
            ('/image_in_topic', 'camera/color/image_raw'),
        ]
    )

    ur_cumotion_planner_node = Node(
        name='ur_cumotion_planner_node',
        package="ur_cumotion",
        executable="ur_cumotion_planner_node",
        parameters=[{"local_config_path": config}],
    )
    

    return LaunchDescription([
        # Apply namespace to all nodes
        PushRosNamespace(ARK_ROS2_NAMESPACE),

        fp_node,
        sam_node,
        improc_node,
        
        overlay_generator,
        vizu_raw,
        console_ui_node,
        calib_node,
        env_manager_node,
        ros2_web_bridge,

        rtdetr_node,
        classify_node,
        image_collector_node,

        cam_node,
        time_sync,

        flag_apriltags_continuous,
        apriltags_node,
        apriltags_continuous_node_delayed_launch,
        apriltags_refine3d_node,
        # redirect_node,
        # rqt_image_view,

        ur_cumotion_planner_node,
        #converter_node,
    ])
