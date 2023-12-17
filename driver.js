import neo4j from 'neo4j-driver'

export const driver = neo4j.driver(
    'neo4j+s://0573c761.databases.neo4j.io',
    neo4j.auth.basic('neo4j', 'MbJvdYjwYZMZgusMLBYz969oGWZ6YsehhmdJhoJnRUU')
)
