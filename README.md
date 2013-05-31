xperious-client
===============


## Running locally

1. You will need `Node.js`. Download and install it.

		brew install node

2. Install all dependencies defined in `package.json`. Step into xperious-client folder and execute:

		npm install

3. Initialize application properties file using `grunt` (it should be available after you install all the dependecies).

		grunt init

4. Start server using `grunt`.

		grunt run

5. Go to `http://localhost:8000`. You should see xperious portal.


## Deployment

Just a reminder about deployment.

1. Execute the following commands:
	
		grunt dist
		grunt dist:deploy

	Beware that this will change your local `properties.json` if you run it from your machine. To restore them use `grunt --apihost=http://localhost:8080 init` or similar.

2. Sample configuration for apache-httpd server:

		<VirtualHost test.xperious.com:80>

	        ServerName test.xperious.com
	        DocumentRoot /var/www/html/xperious

	        RewriteEngine On

	        # all images are in the same directory
	        RewriteRule ^.*images/(.+)$ /images/$1 [L]

	        # all URLs (except for assets) map to index.html and are handled by backbone router there
	        RewriteCond %{REQUEST_FILENAME}% !^.*\.(html|js|css|png|jpg|jpeg|gif)
	        RewriteRule (.*) /index.html [L]

	        ExpiresActive On
	        ExpiresDefault "access plus 1 week"
	        ExpiresByType image/png "access plus 1 day"
	        ExpiresByType image/jpg "access plus 1 day"
	        ExpiresByType image/jpeg "access plus 1 day"
	        ExpiresByType image/gif "access plus 1 day"

	        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/x-javascript application/javascript

	        <Directory /var/www/html/xperious>
	                AuthType Basic
	                AuthName "xperious"
	                AuthUserFile /etc/htpasswd/.htpasswd
	                Require valid-user
	                Order allow,deny
	                Allow from all
	        </Directory>

		</VirtualHost>


3. In case you want to add some users for BASIC auth:

		htpasswd /etc/httpasswd/.htpasswd user_name

4. Make sure your system is aware of virtual host. Edit `/etc/hosts`:

		10.1.1.186      test.xperious.com
