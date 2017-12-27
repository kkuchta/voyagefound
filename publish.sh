# usage:
# AWS_PROFILE=whatever sh ./publish.sh
aws s3 cp build s3://voyage-found/ --recursive --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
