require 'httparty'
require 'jwt'

# Admin API key goes here
key = 'YOUR_ADMIN_API_KEY'

# Split the key into ID and SECRET
id, secret = key.split(':')

# Prepare header and payload
iat = Time.now.to_i

header = {alg: 'HS256', typ: 'JWT', kid: id}
payload = {
    iat: iat,
    exp: iat + 5 * 60,
    aud: '/v2/admin/'
}

# Create the token (including decoding secret)
token = JWT.encode payload, [secret].pack('H*'), 'HS256', header

# Make an authenticated request to create a post
url = 'http://localhost:2368/ghost/api/v2/admin/posts/'
headers = {Authorization: "Ghost #{token}"}
body = {posts: [{title: 'Hello World'}]}
puts HTTParty.post(url, body: body, headers: headers)
