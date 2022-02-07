@app
link-pages

@static
fingerprint true
folder public

@http
get /  #Landing page
get /doc  
get /tutorial
get /playground
get /app/login
get /app/auth
post /logout
get /*  #List of Redirects
get /components/* #Fingerprinted Modules and components

@tables
data
  scopeID *String
  dataID **String
  ttl TTL

@aws
runtime nodejs14.x
region us-east-1
profile begin-examples