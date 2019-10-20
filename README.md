# Frontend component of sample application
## Setup
- install **apache2**
```bash
$ sudo apt-get install apache2
```
- create configuration file for sample site. see sample.conf as reference and place it in sites-available/ directory
- enable site in sites-available/ in /etc/apache2
```bash
$ a2ensite sample
```
- enable apache modules for ReverseProxy to backend server
```bash
$ a2enmod proxy
$ a2enmod proxy_http
```
- restart apache service
```bash
$ sudo service apache2 restart
```
or 
```bash
$ sudo systemctl restart apache2
```
- you may need to enable traffic to apache through the firewall
```bash
$ sudo ufw allow apache2
```
- verify
```bash
$ sudo ufw status
```

## Configuration
- configure apache server settings for the site in sample.conf
- change localhost:8080 to url of backend server
- move contents of public_html folder into DocumentRoot
```text
	DocumentRoot /var/www/sample
	ProxyPass /api http://localhost:8080/api
	ProxyPassReverse /api http://localhost:8080/api
```
- configure virtualhost port and set up listening port, change port 9090 to desired port
```text
<VirtualHost *:9090>
```
- modify ports.conf in /etc/apache2 by adding
```text
LISTEN 9090
```
