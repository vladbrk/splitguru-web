#!/bin/sh

cd /home/vladislav/IdeaProjects/sharebill-ui
npm run build
sudo rm -r /var/www/splitguru/*
sudo cp -r /home/vladislav/IdeaProjects/sharebill-ui/build/* /var/www/splitguru
sudo service nginx restart