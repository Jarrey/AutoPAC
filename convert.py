import ipaddress
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
chn_ip_path = os.path.join(script_dir, 'chn_ip.txt')

with open(chn_ip_path) as f:
    networkList = f.readlines()

networkList = [x.strip() for x in networkList]

print('let cnIp = [')
for networkItem in networkList:
    ipAddrs = networkItem.split()
    if len(ipAddrs) > 1:
        minIpAddr = ipAddrs[0]
        maxIpAddr = ipAddrs[1]
        minIp = int(ipaddress.IPv4Network(minIpAddr)[0])
        maxIp = int(ipaddress.IPv4Network(maxIpAddr)[0])
        print(f'[{minIp}, {maxIp}],')
print('];')
