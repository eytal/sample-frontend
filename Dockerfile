FROM httpd:alpine

COPY ./public_html /usr/local/apache2/htdocs/

