# task management's backend

<h4> API made for a project i had during the 2020/2021 school year :information_desk_person: , made with expressjs </h4>

## how to use

- fork it
- clone it
- create a mongodb cluster/db
- add a .env file and insert :
  - MONGO_USER = \<put here the username from the mongodb server\>
  - MONGO_PSW = \<put here the password from the mongodb server\>
  - MONGO_SERVER = \<put here your server address\>
  - MONGO_DB = \<put here your db name\>
  - MONGO_CONNECTION_STRING = mongodb+srv://${MONGO_USER}:${MONGO_PSW}@${MONGO_SERVER}/${MONGO_DB}?retryWrites=true&w=majority
  - ACCESS_TOKEN_SECRET = \<put here a secret key that would help you generate uniques access tokens\>
  - REFRESH_TOKEN_SECRET = \<put here a secret key that would help you generate uniques access tokens\>
- npm install
- npm start and enjoy !

## todo list

:white_check_mark: create mongodb server <br/>
:white_check_mark: add .env with complete configuration <br/>
:white_check_mark: create model for user <br/>
:white_check_mark: add logic for user <br/>
:white_check_mark: add route for user so that we can login / signup / get personal informations <br/>
:white_check_mark: refresh the token <br/>
:white_check_mark: create model for spaces <br/>
:white_check_mark: add logic for spaces <br/>
:white_check_mark: add route for spaces so that we can add / update / delete / get a space for a given user <br/>
:white_check_mark: create model for categories <br/>
:white_check_mark: add logic for categories <br/>
:white_check_mark: add route for categories so that we can add / update / delete / get a category for a given user & space <br/>
:white_check_mark: create model for tasks <br/>
:white_check_mark: add logic for tasks <br/>
:white_check_mark: add route for tasks so that we can add / update / delete / get tasks for a given user & category <br/>
:white_check_mark: verify that the user who made the put/delete request is the owner of the task / space / category <br/>
