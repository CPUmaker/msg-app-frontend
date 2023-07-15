#!/bin/zsh
declare -a simulators=("A518FC75-3478-4107-AD78-0F2541F78183" "FBB3E653-4DCC-492E-B1C6-3CCDD02496E8")
echo "STARTED"
open -a Simulator
wait_time=1
for i in $simulators[@]
do
    echo "Boot $i"
    xcrun simctl boot $i
    sleep $wait_time
    echo "Install Expo $i"
    xcrun simctl install $i ~/.expo/ios-simulator-app-cache/Exponent-2.29.2.tar.app
    sleep $wait_time
    echo "Lauch Expo $i"
    xcrun simctl openurl $i exp://127.0.0.1:8081
    sleep $wait_time
done
echo "FINISHED"
