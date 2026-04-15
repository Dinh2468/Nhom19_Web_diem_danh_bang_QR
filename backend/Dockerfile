FROM richarvey/nginx-php-fpm:3.1.6

COPY . .

# Cấu hình cho Laravel
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV run_migrations true

RUN composer install --no-dev