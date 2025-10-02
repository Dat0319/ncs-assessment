
### Enable SSH Login With Private Key
```bash
ssh-keygen -t rsa -b 4096 -C "dattran0318@email.com"
ssh-copy-id -i ~/.ssh/id_rsa.pub root@163.223.12.187

### Or manually copy ~/.ssh/id_rsa.pub into the file on VPS:
~/.ssh/authorized_keys

### Test login:

ssh user@163.223.12.187

### Get ssh key
cat ~/.ssh/id_rsa
```

Go to your GitHub repo:
Settings → Secrets → Actions → New repository secret

| Name          | Value                        |
| ------------- |------------------------------|
| `VPS_SSH_KEY` | *(Paste private key here)*   |
| `VPS_HOST`    | `163.223.12.187` *(your IP)* |
| `VPS_USER`    | `root` *(e.g., ubuntu)*      |


### Test
```bash
git push origin main

```