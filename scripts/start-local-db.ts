import EmbeddedPostgres from "embedded-postgres";
import path from "node:path";

const pg = new EmbeddedPostgres({
  databaseDir: path.join(process.cwd(), ".data", "db"),
  user: "postgres",
  password: "password",
  port: 5432,
  persistent: true,
});

// Create the cluster config files
await pg.initialise().catch(() => {});

// Start the server
await pg.start();

const client = pg.getPgClient();

const connectionString = `postgresql://${client.user}:${client.password}@${client.host}:${client.port}/${client.database}`;

console.log("Connection string:", connectionString);
