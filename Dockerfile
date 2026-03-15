FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY public /usr/share/nginx/html
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
