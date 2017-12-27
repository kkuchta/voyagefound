# usage:
# AWS_PROFILE=whatever sh ./publish.sh
npm run build
aws s3 cp build s3://voyage-found/ --recursive --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

# Note: you'll also needs to set up a cloudfront invalidation manually at this
# point since I'm too lazy to set up an aim role that allows that right now.
