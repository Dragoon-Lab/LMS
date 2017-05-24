# LMS
Learning Management System for Dragoon and Topomath. The requirements for both
the tutoring systems are very similar, so to enhance maintainability of the code
for both the websites, merging of the code has become essential. This document explains
the folder structure that we use and then provides step to install the multi-site
structure for Drupal.

# Multi-Site setup #
Multi site idea was setup in the sites folder of any drupal installation. The folder
structure is as follows:

```
sites
|--all
	|--modules
	|--themes
|--dragoon.asu.edu
	|--modules
	|--themes
	|--files
|--topomath.asu.edu
	|--modules
	|--themes
	|--files
```

The files in all is the common code which will be used by both the webistes. The code
in site specific folders have the codes for modules and themes and files that will be
used by each website only.

### Steps for installing the websites ###
These are the steps to install the websites on your local server. To install this
at a server with open domain, the idea remains the same, just that hosts file changes
may or may not be needed.

1. Import the repository in a fresh folder.
2. Download fresh drupal installation and extract in this folder and replace the
original sites folder with this one. `Do not delete the sites folder right now.`
3. Go to apache or your web server configuration file and add the code -
```
<VirtualHost *:80>
	DocumentRoot /path/to/your/drupal/folder
	ServerName  dragoon.asu.edu
</VirtualHost>
<VirtualHost *:80>
	DocumentRoot /path/to/your/drupal/folder
	ServerName  dragoon.asu.edu
</VirtualHost>
```
4. Update your local hosts file to include
```
127.0.0.1   dragoon.asu.edu
127.0.0.1   topomath.asu.edu
```
5. Go to your Drupal and go to sites folder that came with the fresh download
installation. Copy example.settings.php to each folder in sites that is `dragoon.asu.edu`
and `topomath.asu.edu`.
6. Rename the files to settings.php and paste this piece of code around line number 247.
```php
$databases = array (
	'default' => array (
		'default' => array (
			'database' => '<db_name>',
			'username' => '<db_user>',
			'password' => '<db_password>',
			'host' => 'localhost',
			'port' => '',
			'driver' => 'mysql',
			'prefix' => '',
		),
	),
);
```
7. Hit the URL `dragoon.asu.edu/install.php` and `topomath.asu.edu/install.php` to install
both the sites.

Now both the websites are ready after initial installation to setup the modules and theme changes.
