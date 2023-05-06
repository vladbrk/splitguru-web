#!/bin/sh

cd /home/vladislav/IdeaProjects/sharebill-ui
npm run build
sudo rm -r /home/vladislav/IdeaProjects/sharebill/sharebill-web/src/main/resources/static/*
sudo cp -r /home/vladislav/IdeaProjects/sharebill-ui/build/* /home/vladislav/IdeaProjects/sharebill/sharebill-web/src/main/resources/static
