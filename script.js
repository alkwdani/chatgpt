async function askChatGPT() {
  const prompt = document.getElementById('prompt').value;
  const responseDiv = document.getElementById('response');
  responseDiv.textContent = 'Thinking...';

  const res = await fetch('/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: prompt })
  });

  const data = await res.json();
  if (data.history) {
    responseDiv.innerHTML = '';
    data.history.forEach(entry => {
      const div = document.createElement('div');
      div.classList.add('message');
      div.classList.add(entry.role === 'user' ? 'user' : 'assistant');
      div.textContent = (entry.role === 'user' ? 'You: ' : 'ChatGPT: ') + entry.content;
      responseDiv.appendChild(div);
    });
  } else {
    responseDiv.textContent = data.error || 'Error getting response.';
  }
}

async function clearHistory() {
  await fetch('/clear', { method: 'POST' });
  document.getElementById('response').innerHTML = '';
  document.getElementById('prompt').value = '';
}
