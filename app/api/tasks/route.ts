export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  return new Response(JSON.stringify({ tasks: ['Task 1', 'Task 2', 'Task 3'] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
