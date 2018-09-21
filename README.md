# What does our app do?
For our first group project at WDI, we were tasked to recreate Dropbox. In three days.

Our application allows users to store any file type remotely, modify how its recorded, delete it and allow other users to see and access it. We used free web hosting to build the application, so there
are some restrictions on the file size.

# Links
-Frontend client: https://optimal-salamanders.github.io/bag-of-holding-frontend  
-Frontend repo: https://github.com/Optimal-Salamanders/bag-of-holding-frontend  
-Backend server: https://nameless-harbor-24935.herokuapp.com  
-Backend repo: https://github.com/Optimal-Salamanders/bag-of-holding-backend  

# List of technologies used
-Frontend: Javascript, JQuery, Handlebars, HTML, CSS  
-Backend: Javascript, Express, Mongo, Heroku  
-Operations: GitHub, Trello  

# The Process


## Wireframes
V1: https://i.imgur.com/VrsxZKY.jpg  
V2: https://i.imgur.com/yNDM3LO.jpg  
V3: https://i.imgur.com/8nd4FQb.jpg  

## User stories
### Functionality:
As a registered user...  
-I want to upload a file so I sign in and upload a file with a tag  
-I want to update a file’s title or tags so I sign in and update a file  
-I want to delete a file so I sign in and delete a file  
-I want to see all my files so I sign in and view all my uploads  
-I can view the folder structure of my files  
-I can view associated metadata with the file, such as date uploaded and modified, owner, and tags  

### Stretch goal:
-As a registered user, I want to give permission to another user to update a file so I give permission to another registered user

### Auth:
As a non-registered user...  
-I would like to sign up with email and password  
-As a non-registered user who signs up with an already used email then I should receive an error  
-As a non-registered user who signs up with an new email then I should receive a success message  
-As a registered user, I would like to sign in with email and password  
-As a registered user who signs in with an incorrect password then I should receive an error  
-As a registered user who signs in with a correct password then I should receive a success message  

### Entity Relationship Diagram (ERD)
https://i.imgur.com/EcWQg5c.png  

# Routes Catalog
Authentication  
-POST: Sign-up and sign-in -> API -> client  
-PATCH: Change password -> API -> client  
-DELETE: Sign-out -> API -> client  

Resource  
-POST: Client -> API -> Amazon S3 -> API -> client  
-GET: Client -> API -> client  
-PATCH: Client -> API -> client  
-DELETE: Client -> API -> Amazon S3 -> API -> client  

# Future development opportunities
