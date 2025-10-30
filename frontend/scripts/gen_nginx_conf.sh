#!/bin/bash

cat <<EOF >/etc/nginx/conf.d/default.conf
server {
    listen ${PORT:-80};
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        try_files \$uri /index.html;
    }

    location /api {
        proxy_pass ${API_ENDPOINT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF