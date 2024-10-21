# Nodejs API Template

A template for building APIs in typescript, set in a layered architecture along with DI.

## Structure

### Controllers

Routing is defined in controller classes in /src/controller using @dikur/http, integrates with @sinclair/typebox to
help with:

-   validating input
-   validating output (including removing sensitive fields)
-   auto generating OpenAPI specs

This layer handles defining the routes, the routes inputs and outputs, and other non business HTTP logic that you might need.

The controller classes are converted into a Hono router but they can also be switched to express.

### Usecases

Can be thought of as entry points to the business logic, simple applications may prefer to skip the usecase layer, and put the business logic in the controller
but as applications grow, more layers are helpful to group and isolate unrelated code.

Usecases use Repositories injected through the DBContext dependency to interact with the database, they're also where you would start transactions if you require it.

### Repositories

Acts as a layer to abstract your database, repositories can use a base class that avoids writing all the usual CRUD methods needed.
Any custom query logic that is not covered by the Base Repository should be defined in the repository layer, rather than leaking it
into the upper layers. (e.g. define fetchAllUsersWithUnpaidInvoices() on the user or invoice repository)

## Testing

Testing uses a real postgres database from `test.docker-compose.yaml`, the test fixture utility will create a new database and run migrations, allowing each test to run in parallel.

## Deployment (WIP)

A deployment using docker compose is included, uses a Spilo image as it includes wal-g backup support, but requires some work on healthchecks, currently
you can start the deployment, wait for the database to be ready and restart the backend container. you must also include a volume mount.
