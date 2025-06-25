const fs = require('fs')
const fetch = require('node-fetch')

// 1) Load .env.local
require('dotenv').config()

// 2) Read the SQL schema file
const sql = fs.readFileSync('./schema.sql', 'utf8')

// 3) Call Supabase's SQL API
(async () => {
  const res = await fetch(
    ${process.env.SUPABASE_URL}/rest/v1/rpc/execute_sql,
    {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql })
    }
  )

  if (!res.ok) {
    console.error('❌ Schema push failed:', await res.text())
    process.exit(1)
  }

  console.log('✅ Schema pushed successfully!')
})()
