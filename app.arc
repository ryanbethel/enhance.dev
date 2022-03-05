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
post /repl
get /*  #List of Redirects
get /components/* #Fingerprinted Modules and components

@events
repl-secure-sandbox

@plugins
arc-plugin-oauth

@oauth
routes logout login auth
use-mock true

@tables
data
  scopeID *String
  dataID **String
  ttl TTL

@aws
runtime nodejs14.x
region us-east-1
profile begin-examples