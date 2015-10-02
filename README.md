# NodeOpenVPN
Tested Enviroment: Ubuntu 15.04
### Install
Currently untested setup instructions, I am just documenting after I got it successfully installed, what SHOULD do it )
Also there is a lot that can be improved, I just wanted to get something functional out the door, and then work on improving it
latter

```bash
apt-get install nodejs npm openvpn easy-rsa git
ln -s /usr/bin/nodejs /usr/bin/node
```
Then follow This (https://www.digitalocean.com/community/tutorials/how-to-set-up-an-openvpn-server-on-ubuntu-14-04)[See this ]

Then 
```bash
cd /var/
git clone https://github.com/CouleeTechlinkInc/NodeOpenVPN.git node
cd node
npm install .
node install.js
cp -R /etc/openvpn/easy-rsa /var/node/easy-rsa
# You can Probably get away with  rm -rf /var/node/easy-rsa && ln -s /etc/openvpn/easy-rsa /var/node/easy-rsa 
sed -i 's/vpn.slimcrm.com/vpn.yourdomain.com/g' /var/node/index.js # Please change vpn.yourdomain.com with what ever the url for your openvpn server is ( It can be an ip or hostname )
cp /var/node/systemd/manager.service /lib/systemd/system/openvpnmanager.service
systemctl enable openvpnmanager
systemctl start openvpnmanager
```

Currently this acts as only a web interface to easy-rsa, I do have plans on intigrating client status's ip's ext, But this is at least usable
