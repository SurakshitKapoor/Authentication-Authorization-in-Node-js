# Authentication-Authorization-in-Node-js
a detailed backend project in node js which showing the concept of authentication and authorization of users by jwt token.

Here, we have some important folders like model, config, middlewares, controllers, and routes. All of these are working with env and index file to deliver the working of authentication and authorization of users when we login into the server.

Initially, user has to signup, the signup api will create his entry into the databse.

Then, he has to login to get into the server. Once he provide his email and password correctly, we handed/ provide a jwt token to user in response. Using that token, user can make mutliple requests to access the other protected routes according to his specified permissions and he don't need to login again. As we alreday have a jwt token in request. Which the user will be using to create a mutiple requests on a site.

In this way, we will be delievring the conceptual working of Authentication and Auhtorization by using jwt token and cookie.
