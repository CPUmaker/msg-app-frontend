#!/bin/zsh
declare -a simulators=("27D6B718-8348-4C4D-ADFC-6506C2A88EED" "531A59B8-6197-4620-904B-E55308D1EE96" "C08532FE-3CE4-4BB7-A04C-795F2FA7EFE1")
echo "STARTED"
open -a Simulator
wait_time=1
for i in $simulators[@]
do
    echo "Boot $i"
    xcrun simctl boot $i
    sleep $wait_time
    echo "Install Expo $i"
    xcrun simctl install $i ~/.expo/ios-simulator-app-cache/Exponent-2.19.6.tar.app
    sleep $wait_time
    echo "Lauch Expo $i"
    xcrun simctl openurl $i exp://127.0.0.1:19000
    sleep $wait_time
done
echo "FINISHED"
