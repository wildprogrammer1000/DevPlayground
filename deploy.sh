aws s3 cp ~/DevPlayground/frontend/build s3://playgrounddev --recursive &&
aws cloudfront create-invalidation \
    --distribution-id E31KFHBI5YIEAO \
    --paths "/*"