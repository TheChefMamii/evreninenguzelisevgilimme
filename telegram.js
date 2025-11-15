// telegram.js

// BURAYA KENDİ BOT TOKEN ve CHAT ID'ni YAPIŞTIR
const BOT_TOKEN = 'BOT_TOKEN_BURAYA'; 
const CHAT_ID = 'CHAT_ID_BURAYA';

document.getElementById('sendMsg').onclick = () => {
  const msg = document.getElementById('messageText').value.trim();
  if(!msg) {
    alert('Lütfen bir mesaj yazın ❤️');
    return;
  }
    
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: `❤️ Webden Mesaj:\n\n${msg}` })
  })
  .then(r => r.json())
  .then(data => {
    if(data.ok) {
      alert('Mesajın gönderildi ❤️');
      document.getElementById('messageText').value = '';
    } else {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  })
  .catch(() => alert('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.'));
};