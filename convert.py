import ipaddress

with open('c:\\auto_pac\\chn_ip.txt') as f:
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
        print(f'[{minIp},{maxIp}],')
print('];')
