brew install mkcert  
security unlock-keychain login.keychain
mkcert -install     
rm -r .cert
mkdir -p .cert
mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem "local.stg-branch.be"