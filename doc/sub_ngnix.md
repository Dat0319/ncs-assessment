### Create subdomain config for nginx

```bash
sudo nano /etc/nginx/sites-available/api.johnremotedev.com


### Paste content
server {
    listen 80;
    server_name api.johnremotedev.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
### END: Paste content

sudo nginx -t
sudo systemctl reload nginx

sudo certbot --nginx -d api.johnremotedev.com

### Paste content for config ssl
server {
    listen 80;
    server_name api.johnremotedev.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.johnremotedev.com;

    ssl_certificate /etc/letsencrypt/live/api.johnremotedev.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.johnremotedev.com/privkey.pem;
    include ssl-params.conf;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
### END: Paste content

```
