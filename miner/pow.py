import hashlib, sys, json

originalString = sys.argv[1]
difficulty = int(sys.argv[2])
nonce = 0

stringToHash = originalString + str(nonce)

hashed = hashlib.sha256(stringToHash).hexdigest()
while hashed[:difficulty] != "0" * difficulty:
  nonce += 1
  stringToHash = originalString + str(nonce)
  hashed = hashlib.sha256(stringToHash).hexdigest()

response = nonce

print response
sys.stdout.flush()
