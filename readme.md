1. To run the application you should have PostgreSQL RDS installed.
2. Create database, name it myapp.
3. Create tables from dbscripts.sql file.

4. Open cmd and run npm install from project root folder.
5. Go to rssparser folder and run next command to fill db from https://lifehacker.com/rss:
 ../node_modules/.bin/env-cmd -f ../env/.env.development node rssparser.js

6. Go to project root folder and run npm run dev commannd.
7. Start react ui application.
8. Open http://localhost:3000/

