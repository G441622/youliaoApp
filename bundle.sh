#!/bin/bash
PROJECT_NAME="ULAPP"
mkdir ios/${PROJECT_NAME}/bundle && mkdir ios/${PROJECT_NAME}/bundle/assets 
bundle="ios/${PROJECT_NAME}/bundle"
react-native bundle --entry-file index.ios.js --platform ios --dev false --bundle-output $bundle/index.ios.jsbundle --assets-dest $bundle/

