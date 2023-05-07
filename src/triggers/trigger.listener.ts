import { Client } from 'pg';

export async function listenToNotifications() {
  const client = new Client({
    connectionString: 'postgresql://postgres:password@localhost:5432/demo',
  });
  await client.connect();

  client.on('notification', (msg) => {
    if (msg.channel === 'project_match') {
      const payload = msg.payload;
      console.log('Project match notification received:', payload);
    }
  });

  client.query('LISTEN project_match');
}
