#!/usr/bin/env bash

if [ -z $NGINX_ROOT ]; then
  printf "FATAL: Unable to find NGINX_ROOT on file system, exiting."
  exit 1
fi


NGINX_VERSION=$(/usr/sbin/nginx -v)

cat <<EOM
Miritos proxy docker container environment information:

  MIRITOS_UI_REMOTE:  $MIRITOS_UI_REMOTE
  MIRITOS_API_REMOTE: $MIRITOS_API_REMOTE
  nginx version:      $NGINX_VERSION

---
EOM

rm $NGINX_ROOT/nginx.conf

cat << EOF > $NGINX_ROOT/nginx.conf
daemon off;

error_log /var/log/nginx/error.log;
pid /var/run/nginx.pid;

worker_processes 1;
worker_rlimit_nofile 8192;

events {
  worker_connections 512;
  multi_accept on;
  use epoll;
}

http {
  server_tokens off;
  server {
    listen 80;
    access_log /var/log/nginx/access.log;

    location ~ \.(gif|jpg|png|css|js|ttf|woff) {
      proxy_pass $MIRITOS_UI_REMOTE;
    }

    location / {
      rewrite .* /index.html break;
      proxy_pass $MIRITOS_UI_REMOTE;
    }

    location /api {
      proxy_pass $MIRITOS_API_REMOTE;
    }

    if (\$http_x_forwarded_proto = 'http') {
      return 301 https://\$host\$request_uri;
    }
  }
}
EOF

# run nginx
/usr/sbin/nginx -c $NGINX_ROOT/nginx.conf
