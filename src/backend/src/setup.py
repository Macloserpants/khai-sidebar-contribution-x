from setuptools import setup

setup(
    name='ros-sub',
    version='0.0.0',
    packages=['ros-sub'],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/ros-sub']),
        ('share/' + 'ros-sub', ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    description='ros-sub description',
    entry_points={
        'console_scripts': [
            'main = ros-sub.main:main'
        ],
    },
)