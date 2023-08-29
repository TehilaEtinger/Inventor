# A site for inventory management, sales, payables to suppliers, orders and profits.

This is a demo of a site I built for a client.
I built the site in react.js, I used firebase as a database and to perform user authentication, I used materialUI design elements and .env to encrypt the api keys. I put the site online using "render".
The client wanted an easy way to manage his business, and I offered him the website in front of you.
This is a private site, which only authorized users can access (in the demo you see, I gave access to all Google users, so that you can also see the site.)
The main page is for the seller, he does the account for the customer using the main page, which also calculates for him the amount to be paid and the cash surplus for the customer.
As soon as a purchase is made, the inventory is updated, the sales table is updated, and the payables are updated.
The rest of the pages have access only to users who are defined as administrators.
There is a page where you can view sales statistics for the last 4 weeks, there is a page for updating inventory quantities, a page for adding/editing products, a page for managing users, a page that manages payments to suppliers (debts to suppliers are automatically calculated based on sales) and a page where you can view information tables , which can also be exported to an Excel file, such as: profits from sales, etc.
