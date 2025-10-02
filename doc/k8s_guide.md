# K8s Guide

# install kubectl helm in my ubuntu

```bash
#Add Google Cloud's apt repository
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

#Download the Google Cloud public signing key
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg

#Add the Kubernetes apt repository
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

#Update and install kubectl
sudo apt-get update
sudo apt-get install -y kubectl

#Verify installation
kubectl version --client

#Download the latest Helm release
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

#Verify installation
helm version
```

```bash
# Install minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start Minikube with adequate resources
minikube start --driver=docker --cpus=4 --memory=8192 --disk-size=20g
# Check Minikube status
minikube status

# Check Kubernetes nodes
kubectl get nodes

# Enable ingress addon
minikube addons enable ingress

# Check if ingress controller is running
kubectl get pods -n kube-system | grep ingress
```

```bash

#Step 1: Verify Your Kubernetes Context
kubectl config current-context
kubectl get nodes

#Step 2: Add Required Repositories (if needed)
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

#Step 3: Install Dependencies (if any)
helm dependency update /home/john/Desktop/TUTORIAL/ncs-assessment/deploy

cd /home/john/Desktop/TUTORIAL/ncs-assessment/deploy
helm lint .

# List all resources
kubectl get all

# Check the status of your release
helm ls

# View the pods
kubectl get pods

# Get the Minikube IP
minikube ip

# Get the NodePort of your service
kubectl get svc
```

```bash
# Try fix pending in Verifying ingress addon
minikube addons disable ingress
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission

minikube stop
minikube delete
minikube start --driver=docker --cpus=4 --memory=8192 --disk-size=20g

minikube addons enable ingress

# Check if the ingress controller pods are running
kubectl get pods -n ingress-nginx

# Check for any errors
kubectl describe pods -n ingress-nginx

# Delete the existing ingress addon
minikube addons disable ingress

# Install ingress-nginx manually
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml

# Check the status
kubectl get pods -n ingress-nginx --watch

# Reset Minikube completely
minikube delete
minikube start --driver=docker --cpus=4 --memory=8192 --disk-size=20g

# Install ingress with a specific version
minikube addons enable ingress --images="IngressController=registry.k8s.io/ingress-nginx/controller:v1.2.0"

# Check if the ingress controller pod is running
kubectl get pods -n ingress-nginx

# Check the logs for any errors
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=50
```
