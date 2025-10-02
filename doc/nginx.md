
## Install ssh and firewall open port

```bash
ssh root@163.223.12.187

# Install ssh
sudo apt update
sudo apt install openssh-server -y
# check ssh status
sudo systemctl start ssh
sudo systemctl enable ssh
sudo systemctl status ssh

# UFW (Ubuntu) Open SSH in Firewall
#sudo apt install ufw -y
sudo ufw allow ssh
sudo ufw enable
sudo ufw reload
sudo ufw status

# Test ssh connect
nc -zv 163.223.12.187 22

#Fix sshd_config If Needed
sudo nano /etc/ssh/sshd_config

Port 22
ListenAddress 0.0.0.0
PermitRootLogin yes
PasswordAuthentication yes

#restart ssh service
sudo systemctl restart ssh

```

## Install startship and mise
```bash
curl https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc  # or source ~/.bashrc

curl -sS https://starship.rs/install.sh | sh
echo 'eval "$(starship init zsh)"' >> ~/.zshrc
source ~/.zshrc

mise use -g node@14
mise use node@14
mise list

```

## Install vscode
```bash
sudo snap install code --classic
```

## Install docker
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install 
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Run docker without sudo
#sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

# Set permission
#sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
#sudo chmod g+rwx "$HOME/.docker" -R
sudo chmod 666 /var/run/docker.sock

# Test
docker run hello-world

```

## Install and config  nginx
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/default

### Paste content
server {
    listen 80;
    server_name johnremotedev.com www.johnremotedev.com;

    location / {
        proxy_pass http://localhost:3000; # Or whatever port your app runs on
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
### End Paste content

sudo systemctl restart nginx

sudo systemctl status nginx.service
```

## Install cert
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx

### update nginx content config
### Paste content
server {
    listen 80;
    server_name johnremotedev.com www.johnremotedev.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name johnremotedev.com www.johnremotedev.com;

    ssl_certificate /etc/letsencrypt/live/johnremotedev.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/johnremotedev.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
### End Paste content
sudo systemctl restart nginx

```